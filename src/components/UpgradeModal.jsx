"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";

const PAYMENT_LINK = process.env.NEXT_PUBLIC_DLOCAL_PAYMENT_LINK || "";

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((e || "").trim());
}

export default function UpgradeModal({
  open,
  onClose,
  initialEmail,
  onSaveEmail,
}) {
  const [email, setEmail] = useState(initialEmail || "");
  const [error, setError] = useState(null);

  if (!open) return null;

  const goToCheckout = () => {
    const e = email.trim().toLowerCase();
    if (!isValidEmail(e)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!PAYMENT_LINK) {
      setError("Payment link not configured yet. Try again later.");
      return;
    }
    onSaveEmail?.(e);
    const sep = PAYMENT_LINK.includes("?") ? "&" : "?";
    const url = `${PAYMENT_LINK}${sep}external_reference=${encodeURIComponent(e)}&customer_email=${encodeURIComponent(e)}`;
    window.location.href = url;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3 border border-rule bg-paper p-6 shadow-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">
            Upgrade to Pro
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-ink-3 hover:text-ink"
          >
            ×
          </button>
        </div>
        <p className="mb-4 text-[13px] leading-relaxed text-ink-2">
          <span className="font-semibold text-ink">USD 4 / month</span>. Cancel
          anytime.
        </p>
        <ul className="mb-5 space-y-1.5 text-[12.5px] text-ink-2">
          <li>· PDF without watermark</li>
          <li>· Unlimited AI fills &amp; translations</li>
          <li>· Translate to French, Portuguese, German, Italian</li>
        </ul>
        <div className="space-y-2">
          <Label htmlFor="upgrade-email">Email (used to unlock Pro)</Label>
          <Input
            id="upgrade-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
          />
        </div>
        {error && (
          <div
            role="alert"
            className="mt-3 rounded-2 border border-[#ecbdb0] bg-danger-soft px-3 py-2 text-[12px] text-danger"
          >
            {error}
          </div>
        )}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={goToCheckout}>
            Continue to payment →
          </Button>
        </div>
        <p className="mt-4 text-[11px] leading-snug text-ink-3">
          Payments processed by dLocal Go. After paying, return to formatIT and
          enter the same email here to activate Pro on this device.
        </p>
      </div>
    </div>
  );
}
