import crypto from "node:crypto";
import { grantPro, revokePro, listPro, isValidEmail } from "@/lib/pro";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

function authorize(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

async function rateLimitOrReject(req) {
  const ip = getClientIp(req);
  const rl = await checkRateLimit({
    key: `rl:admin:${ip}`,
    limit: 10,
    windowSeconds: 60,
  });
  if (!rl.allowed) {
    return Response.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }
  return null;
}

export async function GET(req) {
  const limited = await rateLimitOrReject(req);
  if (limited) return limited;
  if (!authorize(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await listPro();
  return Response.json({ subscribers: rows });
}

export async function POST(req) {
  const limited = await rateLimitOrReject(req);
  if (limited) return limited;
  if (!authorize(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { action, email, days } = body || {};
  if (!isValidEmail(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }
  if (action === "grant") {
    const result = await grantPro(email, Number(days) || 31);
    if (!result) {
      return Response.json({ error: "Redis not configured" }, { status: 500 });
    }
    return Response.json({ ok: true, ...result });
  }
  if (action === "revoke") {
    await revokePro(email);
    return Response.json({ ok: true, email });
  }
  return Response.json({ error: "Unknown action" }, { status: 400 });
}
