"use client";

import { cv as initialCv } from "@/data/cv";
import Accordion, { AccordionList } from "@/components/editor/Accordion";
import Button from "@/components/ui/Button";
import EducationSection from "@/components/editor/sections/EducationSection";
import ExperienceSection from "@/components/editor/sections/ExperienceSection";
import HeaderSection from "@/components/editor/sections/HeaderSection";
import Label from "@/components/ui/Label";
import SkillsSection from "@/components/editor/sections/SkillsSection";
import SummarySection from "@/components/editor/sections/SummarySection";
import useAccordion from "@/hooks/useAccordion";

const SECTION_IDS = ["header", "summary", "experience", "education", "skills"];

export default function EditorPanel({ cv, setCv }) {
  const { open, toggle, registerRef, handleKeyDown } = useAccordion(
    "header",
    SECTION_IDS,
  );

  const reset = () => {
    if (
      confirm(
        "Reset the CV to the default content? Your current edits will be lost.",
      )
    ) {
      setCv(initialCv);
    }
  };

  const sections = [
    {
      id: "header",
      title: "Header",
      count: null,
      render: () => <HeaderSection cv={cv} setCv={setCv} />,
    },
    {
      id: "summary",
      title: "Professional Summary",
      count: `${cv.summary.length} ¶`,
      render: () => <SummarySection cv={cv} setCv={setCv} />,
    },
    {
      id: "experience",
      title: "Professional Experience",
      count: `${cv.experience.length} roles`,
      render: () => <ExperienceSection cv={cv} setCv={setCv} />,
    },
    {
      id: "education",
      title: "Education",
      count: `${cv.education.length} entries`,
      render: () => <EducationSection cv={cv} setCv={setCv} />,
    },
    {
      id: "skills",
      title: "Technical Skills",
      count: `${Object.keys(cv.skills).length} groups`,
      render: () => <SkillsSection cv={cv} setCv={setCv} />,
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
          <Button variant="ghost" onClick={reset}>
            Reset
          </Button>
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
              {s.render()}
            </Accordion>
          ))}
        </AccordionList>
      </div>
    </aside>
  );
}
