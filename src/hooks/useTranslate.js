"use client";

import { useCallback, useState } from "react";

async function callApi({ section, targetLanguage, cv }) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scope: "translate",
      section,
      targetLanguage,
      current: cv,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  if (!data.data) throw new Error("Response missing translated section.");
  return data.data;
}

function applyHeader(prev, translated) {
  return {
    ...prev,
    name: translated.name ?? prev.name,
    title: translated.title ?? prev.title,
    contact: { ...prev.contact, ...(translated.contact ?? {}) },
  };
}

export default function useTranslate({ cv, setCv, onSuccess }) {
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  const reset = useCallback(() => {
    setError(null);
    setStatus("idle");
  }, []);

  const open = useCallback((section) => {
    setOpenSection(section);
    setError(null);
    setStatus("idle");
  }, []);

  const close = useCallback(() => {
    setOpenSection(null);
    setError(null);
    setStatus("idle");
  }, []);

  const translate = useCallback(
    async (section, targetLanguage) => {
      setStatus("loading");
      setError(null);
      try {
        if (section === "all") {
          const translated = await callApi({
            section: "all",
            targetLanguage,
            cv,
          });
          setCv((prev) => ({
            ...prev,
            name: translated.name ?? prev.name,
            title: translated.title ?? prev.title,
            contact: { ...prev.contact, ...(translated.contact ?? {}) },
            summary: translated.summary ?? prev.summary,
            experience: translated.experience ?? prev.experience,
            education: translated.education ?? prev.education,
            skills: translated.skills ?? prev.skills,
          }));
        } else {
          const translated = await callApi({ section, targetLanguage, cv });
          setCv((prev) =>
            section === "header"
              ? applyHeader(prev, translated)
              : { ...prev, [section]: translated },
          );
        }
        setStatus("idle");
        setOpenSection(null);
        onSuccess?.(targetLanguage);
      } catch (err) {
        setStatus("error");
        setError(err.message);
      }
    },
    [cv, setCv, onSuccess],
  );

  return {
    status,
    error,
    openSection,
    open,
    close,
    translate,
    reset,
  };
}
