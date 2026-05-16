import { getProStatus, isValidEmail } from "@/lib/pro";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") || "";
  if (!isValidEmail(email)) {
    return Response.json({ isPro: false, expiresAt: null });
  }
  const status = await getProStatus(email);
  return Response.json(status);
}
