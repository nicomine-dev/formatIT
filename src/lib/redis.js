const URL = process.env.KV_REST_API_URL;
const TOKEN = process.env.KV_REST_API_TOKEN;

// Local-dev fallback: an in-process store so Pro activation and rate limiting
// can be exercised without an Upstash instance. Production always requires
// real credentials.
const useMemoryStore =
  (!URL || !TOKEN) && process.env.NODE_ENV !== "production";

function ensureConfigured() {
  if (!URL || !TOKEN) {
    throw new Error(
      "Upstash Redis not configured. Set KV_REST_API_URL and KV_REST_API_TOKEN.",
    );
  }
}

async function call(command) {
  ensureConfigured();
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upstash ${res.status}: ${text}`);
  }
  const data = await res.json();
  if (data.error) throw new Error(`Upstash: ${data.error}`);
  return data.result;
}

const upstashRedis = {
  isConfigured: () => Boolean(URL && TOKEN),
  get: (key) => call(["GET", key]),
  set: (key, value, ttlSeconds) =>
    ttlSeconds
      ? call(["SET", key, value, "EX", ttlSeconds])
      : call(["SET", key, value]),
  del: (key) => call(["DEL", key]),
  incr: (key) => call(["INCR", key]),
  expire: (key, ttlSeconds) => call(["EXPIRE", key, ttlSeconds]),
  ttl: (key) => call(["TTL", key]),
  sadd: (key, member) => call(["SADD", key, member]),
  srem: (key, member) => call(["SREM", key, member]),
  smembers: (key) => call(["SMEMBERS", key]),
};

// globalThis keeps a single store even when Next.js dev compiles routes into
// separate module instances.
const memory = useMemoryStore
  ? (globalThis.__formatitMemoryRedis ??= new Map())
  : null;

function liveEntry(key) {
  const entry = memory.get(key);
  if (!entry) return null;
  if (entry.expiresAt && entry.expiresAt <= Date.now()) {
    memory.delete(key);
    return null;
  }
  return entry;
}

const memoryRedis = {
  isConfigured: () => true,
  get: async (key) => liveEntry(key)?.value ?? null,
  set: async (key, value, ttlSeconds) => {
    memory.set(key, {
      value: String(value),
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    });
    return "OK";
  },
  del: async (key) => (memory.delete(key) ? 1 : 0),
  incr: async (key) => {
    const entry = liveEntry(key);
    const next = Number(entry?.value ?? 0) + 1;
    memory.set(key, {
      value: String(next),
      expiresAt: entry?.expiresAt ?? null,
    });
    return next;
  },
  expire: async (key, ttlSeconds) => {
    const entry = liveEntry(key);
    if (!entry) return 0;
    entry.expiresAt = Date.now() + ttlSeconds * 1000;
    return 1;
  },
  ttl: async (key) => {
    const entry = liveEntry(key);
    if (!entry) return -2;
    if (!entry.expiresAt) return -1;
    return Math.ceil((entry.expiresAt - Date.now()) / 1000);
  },
  sadd: async (key, member) => {
    const entry = liveEntry(key) ?? { value: new Set(), expiresAt: null };
    memory.set(key, entry);
    if (entry.value.has(member)) return 0;
    entry.value.add(member);
    return 1;
  },
  srem: async (key, member) => {
    const entry = liveEntry(key);
    if (!entry) return 0;
    return entry.value.delete(member) ? 1 : 0;
  },
  smembers: async (key) => {
    const entry = liveEntry(key);
    return entry ? [...entry.value] : [];
  },
};

if (useMemoryStore) {
  console.warn(
    "[redis] KV_REST_API_URL/KV_REST_API_TOKEN not set — using in-memory dev store (data resets on server restart).",
  );
}

export const redis = useMemoryStore ? memoryRedis : upstashRedis;
