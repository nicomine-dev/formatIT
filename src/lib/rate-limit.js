import { redis } from "./redis";

export async function checkRateLimit({ key, limit, windowSeconds }) {
  if (!redis.isConfigured()) {
    return { allowed: true, remaining: limit, retryAfter: 0, bypassed: true };
  }
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSeconds);
    const allowed = count <= limit;
    let retryAfter = 0;
    if (!allowed) {
      const ttl = await redis.ttl(key);
      retryAfter = ttl > 0 ? ttl : windowSeconds;
    }
    return {
      allowed,
      remaining: Math.max(0, limit - count),
      retryAfter,
      bypassed: false,
    };
  } catch (err) {
    console.warn("[rate-limit] redis failure, allowing request:", err.message);
    return { allowed: true, remaining: limit, retryAfter: 0, bypassed: true };
  }
}

export function getClientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export function dayBucket() {
  const d = new Date();
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
}
