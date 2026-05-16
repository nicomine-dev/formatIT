"use client";

import { useState } from "react";
import Accordion, { AccordionList } from "@/components/editor/Accordion";
import Button from "@/components/ui/Button";
import EducationSection from "@/components/editor/sections/EducationSection";
import ExperienceSection from "@/components/editor/sections/ExperienceSection";
import HeaderSection from "@/components/editor/sections/HeaderSection";
import Label from "@/components/ui/Label";
import SkillsSection from "@/components/editor/sections/SkillsSection";
import SummarySection from "@/components/editor/sections/SummarySection";
import TranslateTo from "@/components/editor/TranslateTo";
import useAccordion from "@/hooks/useAccordion";
import useTranslate from "@/hooks/useTranslate";

const SECTION_IDS = ["header", "summary", "experience", "education", "skills"];

export default function EditorPanel({
  cv,
  setCv,
  onReset,
  onSetAsDefault,
  email,
  isPro,
  onUpgrade,
}) {
  const { open, toggle, registerRef, handleKeyDown } = useAccordion(
    "header",
    SECTION_IDS,
  );
  const [toast, setToast] = useState(null);
  const translateHook = useTranslate({
    cv,
    setCv,
    email,
    onSuccess: (lang) => {
      setToast(`Translated to ${lang}`);
      setTimeout(() => setToast(null), 2500);
    },
  });
  const translate = { ...translateHook, isPro, onUpgrade };

  const reset = () => {
    if (
      confirm(
        "Reset the CV to the default content? Your current edits will be lost.",
      )
    ) {
      onReset();
    }
  };

  const setAsDefault = () => {
    if (
      confirm(
        "Save the current CV as your default? This will replace any previously saved default.",
      )
    ) {
      const ok = onSetAsDefault();
      setToast(ok ? "Saved as default" : "Failed to save default");
      setTimeout(() => setToast(null), 2500);
    }
  };

  const sectionRender = {
    header: () => <HeaderSection cv={cv} setCv={setCv} translate={translate} />,
    summary: () => (
      <SummarySection
        cv={cv}
        setCv={setCv}
        translate={translate}
        email={email}
      />
    ),
    experience: () => (
      <ExperienceSection cv={cv} setCv={setCv} translate={translate} />
    ),
    education: () => (
      <EducationSection cv={cv} setCv={setCv} translate={translate} />
    ),
    skills: () => (
      <SkillsSection
        cv={cv}
        setCv={setCv}
        translate={translate}
        email={email}
      />
    ),
  };

  const sections = [
    { id: "header", title: "Header", count: null },
    {
      id: "summary",
      title: "Professional Summary",
      count: `${cv.summary.length} ¶`,
    },
    {
      id: "experience",
      title: "Professional Experience",
      count: `${cv.experience.length} roles`,
    },
    {
      id: "education",
      title: "Education",
      count: `${cv.education.length} entries`,
    },
    {
      id: "skills",
      title: "Technical Skills",
      count: `${Object.keys(cv.skills).length} groups`,
    },
  ];

  return (
    <aside className="w-full shrink-0 border-b border-rule bg-surface lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:w-[408px] lg:overflow-y-auto lg:border-b-0 lg:border-r print:hidden">
      <div className="px-6 pb-10 pt-6">
        <div className="mb-6 flex items-baseline justify-between">
          <div className="space-y-1">
            <Label>Editor</Label>
            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
              Edit your CV
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={reset}>
              Reset
            </Button>
            <Button variant="outline" onClick={setAsDefault}>
              Set as default
            </Button>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between rounded-3 border border-rule bg-paper px-4 py-3 shadow-1">
          <div className="space-y-1">
            <Label>Translate everything</Label>
            <p className="text-[12.5px] leading-snug text-ink-2">
              Rewrite the whole CV at once.
            </p>
          </div>
          <TranslateTo
            section="all"
            label="Translate…"
            status={translate.openSection === "all" ? translate.status : "idle"}
            error={translate.openSection === "all" ? translate.error : null}
            isOpen={translate.openSection === "all"}
            onOpen={() => translate.open("all")}
            onClose={translate.close}
            onTranslate={translate.translate}
            isPro={isPro}
            onUpgrade={onUpgrade}
          />
        </div>

        <AccordionList>
          {sections.map((s, i) => (
            <Accordion
              key={s.id}
              id={s.id}
              index={i + 1}
              title={s.title}
              count={s.count}
              isOpen={open === s.id}
              onToggle={toggle}
              registerRef={registerRef}
              onKeyDown={handleKeyDown}
            >
              {sectionRender[s.id]()}
            </Accordion>
          ))}
        </AccordionList>
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="anim-toast-in fixed bottom-6 right-6 z-40 rounded-2 border border-[#b8dec9] bg-[#e8f5ee] px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-success shadow-2"
        >
          {toast}
        </div>
      )}
    </aside>
  );
}
