"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";

const EMAIL_KEY = "formatit:pro:email:v1";

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((e || "").trim());
}

export default function ProSuccessPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [attempts, setAttempts] = useState(0);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(EMAIL_KEY) || "";
      if (stored) setEmail(stored);
    } catch {}
  }, []);

  const check = async (target) => {
    const e = (target || "").trim().toLowerCase();
    if (!isValidEmail(e)) return;
    setStatus("checking");
    try {
      const res = await fetch(
        `/api/pro/status?email=${encodeURIComponent(e)}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      if (data.isPro) {
        try {
          localStorage.setItem(EMAIL_KEY, e);
        } catch {}
        setIsPro(true);
        setStatus("active");
      } else {
        setStatus("pending");
        setAttempts((n) => n + 1);
      }
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status !== "pending") return;
    if (attempts > 12) return;
    const id = setTimeout(() => check(email), 5000);
    return () => clearTimeout(id);
  }, [status, attempts, email]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
      <div className="w-full max-w-md rounded-3 border border-rule bg-paper p-8 shadow-2">
        <h1 className="mb-2 text-[22px] font-semibold tracking-[-0.02em] text-ink">
          {isPro ? "You are Pro 🎉" : "Almost there"}
        </h1>
        <p className="mb-5 text-[13px] leading-relaxed text-ink-2">
          {isPro
            ? "Thanks for supporting formatIT. All Pro features are now active."
            : "If you just paid, your activation may take up to a minute. Enter the same email you used at checkout."}
        </p>

        {!isPro && (
          <>
            <div className="space-y-2">
              <Label htmlFor="success-email">Email</Label>
              <Input
                id="success-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                variant="primary"
                onClick={() => check(email)}
                disabled={status === "checking"}
              >
                {status === "checking" || status === "pending"
                  ? "Checking…"
                  : "Activate Pro"}
              </Button>
            </div>
            {status === "pending" && attempts > 12 && (
              <p className="mt-4 text-[12px] text-ink-3">
                Still not active? Email us with your payment receipt.
              </p>
            )}
            {status === "error" && (
              <p className="mt-4 text-[12px] text-danger">
                Could not verify status. Try again in a moment.
              </p>
            )}
          </>
        )}

        <div className="mt-6 border-t border-rule pt-4">
          <Link
            href="/"
            className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink-2 hover:text-ink"
          >
            ← Back to editor
          </Link>
        </div>
      </div>
    </main>
  );
}
