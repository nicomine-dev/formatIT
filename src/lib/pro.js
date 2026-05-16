import { redis } from "./redis";

const KEY_PREFIX = "pro:";
const INDEX_KEY = "pro:index";

function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

export function isValidEmail(email) {
  const e = normalizeEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export async function getProStatus(email) {
  const e = normalizeEmail(email);
  if (!e || !redis.isConfigured()) {
    return { isPro: false, expiresAt: null };
  }
  try {
    const raw = await redis.get(KEY_PREFIX + e);
    if (!raw) return { isPro: false, expiresAt: null };
    const expiresAt = Number(raw);
    if (!Number.isFinite(expiresAt)) return { isPro: false, expiresAt: null };
    const isPro = expiresAt > Date.now();
    return { isPro, expiresAt };
  } catch (err) {
    console.warn("[pro] redis failure, defaulting to free:", err.message);
    return { isPro: false, expiresAt: null };
  }
}

export async function grantPro(email, days = 31) {
  const e = normalizeEmail(email);
  if (!e || !redis.isConfigured()) return false;
  const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000;
  const ttlSeconds = days * 24 * 60 * 60 + 7 * 24 * 60 * 60;
  await redis.set(KEY_PREFIX + e, String(expiresAt), ttlSeconds);
  await redis.sadd(INDEX_KEY, e);
  return { email: e, expiresAt };
}

export async function revokePro(email) {
  const e = normalizeEmail(email);
  if (!e || !redis.isConfigured()) return false;
  await redis.del(KEY_PREFIX + e);
  await redis.srem(INDEX_KEY, e);
  return true;
}

export async function listPro() {
  if (!redis.isConfigured()) return [];
  try {
    const emails = (await redis.smembers(INDEX_KEY)) || [];
    const rows = await Promise.all(
      emails.map(async (email) => {
        const raw = await redis.get(KEY_PREFIX + email);
        if (!raw) {
          await redis.srem(INDEX_KEY, email);
          return null;
        }
        const expiresAt = Number(raw);
        if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
          await redis.srem(INDEX_KEY, email);
          return null;
        }
        return { email, expiresAt };
      }),
    );
    return rows.filter(Boolean).sort((a, b) => b.expiresAt - a.expiresAt);
  } catch (err) {
    console.warn("[pro] listPro failed:", err.message);
    return [];
  }
}
