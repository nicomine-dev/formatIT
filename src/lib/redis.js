const URL = process.env.KV_REST_API_URL;
const TOKEN = process.env.KV_REST_API_TOKEN;

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

export const redis = {
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
