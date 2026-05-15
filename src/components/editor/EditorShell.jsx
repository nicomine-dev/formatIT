"use client";

import { useEffect, useState } from "react";
import { cv as initialCv } from "@/data/cv";
import EditorPanel from "@/components/editor/EditorPanel";
import MobileTabs from "@/components/mobile/MobileTabs";
import PreviewPane from "@/components/preview/PreviewPane";
import TopBar from "@/components/editor/TopBar";

const STORAGE_KEY = "formatit:cv:v1";

export default function EditorShell() {
  const [cv, setCv] = useState(initialCv);
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(true);
  const [mobileView, setMobileView] = useState("edit");

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
    <div className="flex min-h-screen flex-col bg-bg pb-16 text-ink md:pb-0">
      <TopBar saved={saved} />
      <div className="flex flex-1 flex-col lg:flex-row">
        <div
          className={`${
            mobileView === "edit" ? "block" : "hidden"
          } md:block lg:contents`}
        >
          <EditorPanel cv={cv} setCv={setCv} />
        </div>
        <div
          className={`${
            mobileView === "preview" ? "block" : "hidden"
          } md:block lg:contents flex-1`}
        >
          <PreviewPane cv={cv} />
        </div>
      </div>
      <MobileTabs value={mobileView} onChange={setMobileView} />
    </div>
  );
}
