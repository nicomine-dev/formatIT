import crypto from "node:crypto";
import { grantPro, revokePro, isValidEmail } from "@/lib/pro";

function verifySignature(rawBody, signatureHeader, secret) {
  if (!secret) return false;
  if (!signatureHeader) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const provided = signatureHeader.replace(/^sha256=/, "").trim();
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(provided, "hex"),
    );
  } catch {
    return false;
  }
}

function extractEmail(payload) {
  const candidates = [
    payload?.external_reference,
    payload?.customer?.email,
    payload?.payer?.email,
    payload?.subscription?.external_reference,
    payload?.data?.external_reference,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && isValidEmail(c)) return c;
  }
  return null;
}

function classifyEvent(payload) {
  const status = (payload?.status || payload?.event_type || "")
    .toString()
    .toLowerCase();
  if (
    status.includes("paid") ||
    status.includes("authorized") ||
    status.includes("succeeded") ||
    status.includes("active")
  ) {
    return "active";
  }
  if (
    status.includes("cancel") ||
    status.includes("failed") ||
    status.includes("expired") ||
    status.includes("refund") ||
    status.includes("disputed")
  ) {
    return "cancelled";
  }
  return "unknown";
}

export async function POST(req) {
  const rawBody = await req.text();
  const secret = process.env.DLOCAL_WEBHOOK_SECRET;
  const signature =
    req.headers.get("x-dlocal-signature") ||
    req.headers.get("x-signature") ||
    req.headers.get("signature");

  if (!verifySignature(rawBody, signature, secret)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = extractEmail(payload);
  if (!email) {
    console.warn("[dlocal webhook] no email found in payload");
    return Response.json({ ok: true, ignored: "no_email" });
  }

  const kind = classifyEvent(payload);
  if (kind === "active") {
    await grantPro(email, 31);
    return Response.json({ ok: true, email, action: "granted" });
  }
  if (kind === "cancelled") {
    await revokePro(email);
    return Response.json({ ok: true, email, action: "revoked" });
  }
  return Response.json({ ok: true, email, action: "ignored" });
}
