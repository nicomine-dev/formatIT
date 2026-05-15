"use client";

import { useEffect, useState } from "react";
import { cv as initialCv } from "@/data/cv";
import TopBar from "@/components/editor/TopBar";
import EditorPanel from "@/components/editor/EditorPanel";
import PreviewPane from "@/components/preview/PreviewPane";

const STORAGE_KEY = "formatit:cv:v1";

export default function EditorShell() {
  const [cv, setCv] = useState(initialCv);
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCv(JSON.parse(stored));
    } catch (err) {
      console.warn("[formatIT] failed to read stored CV:", err);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setSaved(false);
    const id = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cv));
        setSaved(true);
      } catch (err) {
        console.warn("[formatIT] failed to persist CV:", err);
      }
    }, 250);
    return () => clearTimeout(id);
  }, [cv, hydrated]);

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <TopBar saved={saved} />
      <div className="flex flex-1 lg:flex-row">
        <EditorPanel cv={cv} setCv={setCv} />
        <PreviewPane cv={cv} />
      </div>
    </div>
  );
}
