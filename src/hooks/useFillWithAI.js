"use client";

import { useCallback, useState } from "react";

const SCOPE_BY_SECTION = {
  summary: "full",
  skills: "skills",
};

function applyResponse(prev, section, data) {
  if (section === "summary") {
    if (!data.cv?.summary?.length) throw new Error("Response missing summary.");
    return { ...prev, summary: data.cv.summary };
  }
  if (section === "skills") {
    if (!data.skills || !Object.keys(data.skills).length)
      throw new Error("Response missing skills.");
    return { ...prev, skills: data.skills };
  }
  throw new Error(`Fill with AI not supported for section "${section}".`);
}

export default function useFillWithAI({ section, cv, setCv, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState(null);

  const close = useCallback(() => {
    setOpen(false);
    setError(null);
    setStatus("idle");
  }, []);

  const submit = useCallback(async () => {
    const trimmed = prompt.trim();
    if (!trimmed || status === "loading") return;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: trimmed,
          current: cv,
          scope: SCOPE_BY_SECTION[section],
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || `Request failed (${res.status})`);
      setCv((prev) => applyResponse(prev, section, data));
      setStatus("idle");
      setOpen(false);
      setPrompt("");
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }, [prompt, status, cv, setCv, section, onSuccess]);

  return {
    open,
    prompt,
    status,
    error,
    setPrompt,
    setOpen: (v) => {
      if (v) {
        setOpen(true);
        setError(null);
        setStatus("idle");
      } else {
        close();
      }
    },
    submit,
  };
}
