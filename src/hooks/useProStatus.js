"use client";

import { useCallback, useEffect, useState } from "react";

const EMAIL_KEY = "formatit:pro:email:v1";

export default function useProStatus() {
  const [email, setEmailState] = useState("");
  const [isPro, setIsPro] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(EMAIL_KEY) || "";
      if (stored) setEmailState(stored);
    } catch {}
    setHydrated(true);
  }, []);

  const refresh = useCallback(async (target) => {
    const e = (target ?? "").trim().toLowerCase();
    if (!e) {
      setIsPro(false);
      setExpiresAt(null);
      return { isPro: false, expiresAt: null };
    }
    setChecking(true);
    try {
      const res = await fetch(
        `/api/pro/status?email=${encodeURIComponent(e)}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      setIsPro(Boolean(data.isPro));
      setExpiresAt(data.expiresAt ?? null);
      return data;
    } catch {
      setIsPro(false);
      setExpiresAt(null);
      return { isPro: false, expiresAt: null };
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (email) refresh(email);
  }, [hydrated, email, refresh]);

  const setEmail = useCallback((next) => {
    const e = (next || "").trim().toLowerCase();
    setEmailState(e);
    try {
      if (e) localStorage.setItem(EMAIL_KEY, e);
      else localStorage.removeItem(EMAIL_KEY);
    } catch {}
  }, []);

  const signOut = useCallback(() => {
    setEmail("");
    setIsPro(false);
    setExpiresAt(null);
  }, [setEmail]);

  return {
    email,
    setEmail,
    isPro,
    expiresAt,
    hydrated,
    checking,
    refresh,
    signOut,
  };
}
