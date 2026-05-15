"use client";

import { useEffect, useState } from "react";
import PaperPreview from "@/components/PaperPreview";
import { cv as initialCv } from "@/data/cv";

const STORAGE_KEY = "formatit:cv:v1";

const CONTACT_FIELDS = [
  { key: "location", label: "Location" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "portfolio", label: "Portfolio" },
];

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 4 }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
          {label}
        </span>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full resize-y rounded border border-zinc-300 bg-white px-3 py-2 text-sm leading-relaxed text-zinc-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
      />
    </label>
  );
}

function Accordion({ id, title, openId, setOpenId, children }) {
  const isOpen = openId === id;
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <button
        type="button"
        onClick={() => setOpenId(isOpen ? null : id)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-zinc-50"
      >
        <span className="text-sm font-bold uppercase tracking-wide text-zinc-800">
          {title}
        </span>
        <span
          aria-hidden="true"
          className={`text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
      {isOpen && (
        <div className="border-t border-zinc-200 px-4 py-4">{children}</div>
      )}
    </div>
  );
}

function EntryCard({ title, onRemove, children }) {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-50 p-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-700">
          {title}
        </span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-medium text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function TranslateControl({ section, onTranslate }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handle = async (lang) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await onTranslate(section, lang);
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError(null);
        }}
        className="rounded border border-emerald-600 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
      >
        Translate to
      </button>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2 rounded border border-emerald-200 bg-emerald-50/60 px-2 py-1">
      <span className="text-xs font-semibold text-zinc-700">Translate to:</span>
      <button
        type="button"
        onClick={() => handle("English")}
        disabled={busy}
        className="rounded border border-emerald-600 px-2 py-0.5 text-xs font-medium text-emerald-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        English
      </button>
      <button
        type="button"
        onClick={() => handle("Spanish")}
        disabled={busy}
        className="rounded border border-emerald-600 px-2 py-0.5 text-xs font-medium text-emerald-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        Spanish
      </button>
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setError(null);
        }}
        className="text-xs font-medium text-zinc-500 hover:text-zinc-800"
      >
        Cancel
      </button>
      {busy && <span className="text-xs text-zinc-500">Translating…</span>}
      {error && (
        <span className="basis-full text-xs text-red-600">{error}</span>
      )}
    </div>
  );
}

function PrimaryButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded border border-blue-600 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50"
    >
      {children}
    </button>
  );
}

export default function CVEditor() {
  const [cv, setCv] = useState(initialCv);
  const [openId, setOpenId] = useState("header");
  const [hydrated, setHydrated] = useState(false);
  const [summaryAiOpen, setSummaryAiOpen] = useState(false);
  const [summaryJobDescription, setSummaryJobDescription] = useState("");
  const [summaryAiBusy, setSummaryAiBusy] = useState(false);
  const [summaryAiError, setSummaryAiError] = useState(null);
  const [skillsAiOpen, setSkillsAiOpen] = useState(false);
  const [skillsJobDescription, setSkillsJobDescription] = useState("");
  const [skillsAiBusy, setSkillsAiBusy] = useState(false);
  const [skillsAiError, setSkillsAiError] = useState(null);

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cv));
    } catch (err) {
      console.warn("[formatIT] failed to persist CV:", err);
    }
  }, [cv, hydrated]);

  const translateSection = async (section, targetLanguage) => {
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
    if (!res.ok)
      throw new Error(data.error || `Request failed (${res.status})`);
    if (!data.data) throw new Error("Response missing translated section.");

    setCv((prev) => {
      if (section === "header") {
        return {
          ...prev,
          name: data.data.name ?? prev.name,
          title: data.data.title ?? prev.title,
          contact: { ...prev.contact, ...(data.data.contact ?? {}) },
        };
      }
      return { ...prev, [section]: data.data };
    });
  };

  const fillSkillsWithAI = async () => {
    const prompt = skillsJobDescription.trim();
    if (!prompt || skillsAiBusy) return;
    setSkillsAiBusy(true);
    setSkillsAiError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, current: cv, scope: "skills" }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || `Request failed (${res.status})`);
      if (!data.skills || !Object.keys(data.skills).length)
        throw new Error("Response missing skills.");

      setCv((prev) => ({ ...prev, skills: data.skills }));
      setSkillsAiOpen(false);
      setSkillsJobDescription("");
    } catch (err) {
      setSkillsAiError(err.message);
    } finally {
      setSkillsAiBusy(false);
    }
  };

  const fillSummaryWithAI = async () => {
    const prompt = summaryJobDescription.trim();
    if (!prompt || summaryAiBusy) return;
    setSummaryAiBusy(true);
    setSummaryAiError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, current: cv }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || `Request failed (${res.status})`);
      if (!data.cv?.summary?.length)
        throw new Error("Response missing summary.");

      setCv((prev) => ({ ...prev, summary: data.cv.summary }));
      setSummaryAiOpen(false);
      setSummaryJobDescription("");
    } catch (err) {
      setSummaryAiError(err.message);
    } finally {
      setSummaryAiBusy(false);
    }
  };

  const resetCv = () => {
    if (
      !confirm(
        "Reset the CV to the default content? Your current edits will be lost.",
      )
    )
      return;
    setCv(initialCv);
  };

  const updateField = (key, value) =>
    setCv((prev) => ({ ...prev, [key]: value }));

  const updateContact = (key, value) =>
    setCv((prev) => ({ ...prev, contact: { ...prev.contact, [key]: value } }));

  // Summary
  const updateSummaryParagraph = (index, value) =>
    setCv((prev) => ({
      ...prev,
      summary: prev.summary.map((p, i) => (i === index ? value : p)),
    }));
  const addSummaryParagraph = () =>
    setCv((prev) => ({ ...prev, summary: [...prev.summary, ""] }));
  const removeSummaryParagraph = (index) =>
    setCv((prev) => ({
      ...prev,
      summary: prev.summary.filter((_, i) => i !== index),
    }));

  // Experience
  const updateExperience = (index, key, value) =>
    setCv((prev) => ({
      ...prev,
      experience: prev.experience.map((e, i) =>
        i === index ? { ...e, [key]: value } : e,
      ),
    }));
  const updateExperienceBullet = (expIndex, bIndex, value) =>
    setCv((prev) => ({
      ...prev,
      experience: prev.experience.map((e, i) =>
        i === expIndex
          ? {
              ...e,
              bullets: e.bullets.map((b, j) => (j === bIndex ? value : b)),
            }
          : e,
      ),
    }));
  const addExperienceBullet = (expIndex) =>
    setCv((prev) => ({
      ...prev,
      experience: prev.experience.map((e, i) =>
        i === expIndex ? { ...e, bullets: [...e.bullets, ""] } : e,
      ),
    }));
  const removeExperienceBullet = (expIndex, bIndex) =>
    setCv((prev) => ({
      ...prev,
      experience: prev.experience.map((e, i) =>
        i === expIndex
          ? { ...e, bullets: e.bullets.filter((_, j) => j !== bIndex) }
          : e,
      ),
    }));
  const addExperience = () =>
    setCv((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { role: "", company: "", start: "", end: "", bullets: [""] },
      ],
    }));
  const removeExperience = (index) =>
    setCv((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));

  // Education
  const updateEducation = (index, key, value) =>
    setCv((prev) => ({
      ...prev,
      education: prev.education.map((e, i) =>
        i === index ? { ...e, [key]: value } : e,
      ),
    }));
  const addEducation = () =>
    setCv((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: "", institution: "", start: "", end: "" },
      ],
    }));
  const removeEducation = (index) =>
    setCv((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));

  // Skills
  const renameSkillCategory = (oldName, newName) =>
    setCv((prev) => {
      if (newName === oldName) return prev;
      const next = {};
      for (const [k, v] of Object.entries(prev.skills)) {
        next[k === oldName ? newName : k] = v;
      }
      return { ...prev, skills: next };
    });
  const updateSkillItems = (category, itemsString) =>
    setCv((prev) => ({
      ...prev,
      skills: { ...prev.skills, [category]: itemsString },
    }));
  const addSkillCategory = () =>
    setCv((prev) => {
      let name = "New Category";
      let n = 1;
      while (Object.prototype.hasOwnProperty.call(prev.skills, name)) {
        n += 1;
        name = `New Category ${n}`;
      }
      return { ...prev, skills: { ...prev.skills, [name]: "" } };
    });
  const removeSkillCategory = (category) =>
    setCv((prev) => {
      const next = { ...prev.skills };
      delete next[category];
      return { ...prev, skills: next };
    });

  const [downloading, setDownloading] = useState(false);

  const downloadPdf = async () => {
    if (typeof window === "undefined") return;
    setDownloading(true);
    try {
      const [{ pdf }, { default: CVPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/CVPdfDocument"),
      ]);
      const blob = await pdf(<CVPdfDocument cv={cv} />).toBlob();
      const url = URL.createObjectURL(blob);
      const sanitize = (s) => (s || "").replace(/[\\/:*?"<>|]+/g, "-").trim();
      const namePart = sanitize(cv.name) || "CV";
      const titlePart = sanitize(cv.title);
      const fileName = `${namePart}${titlePart ? ` - ${titlePart}` : ""}.pdf`;
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[formatIT] PDF generation failed:", err);
      alert("Could not generate the PDF. See the console for details.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-zinc-100 p-6 lg:flex-row print:p-0">
      <button
        type="button"
        onClick={downloadPdf}
        disabled={downloading}
        className="fixed right-6 top-6 z-50 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 print:hidden"
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4v12" />
          <path d="m7 11 5 5 5-5" />
          <path d="M5 20h14" />
        </svg>
        {downloading ? "Generating…" : "Download PDF"}
      </button>
      <aside className="w-full shrink-0 rounded-lg bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:w-96 lg:overflow-y-auto print:hidden">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900">Edit CV</h2>
          <button
            type="button"
            onClick={resetCv}
            className="text-xs font-medium text-zinc-500 hover:text-red-600"
          >
            Reset
          </button>
        </div>

        <div className="space-y-3">
          <Accordion
            id="header"
            title="Header"
            openId={openId}
            setOpenId={setOpenId}
          >
            <div className="mb-3 flex justify-start">
              <TranslateControl
                section="header"
                onTranslate={translateSection}
              />
            </div>
            <div className="space-y-4">
              <Field
                label="Name"
                value={cv.name}
                onChange={(v) => updateField("name", v)}
              />
              <Field
                label="Subtitle"
                value={cv.title}
                onChange={(v) => updateField("title", v)}
              />
              <div className="pt-2">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-zinc-600">
                  Contact
                </h4>
                <div className="space-y-3">
                  {CONTACT_FIELDS.map(({ key, label }) => (
                    <Field
                      key={key}
                      label={label}
                      value={cv.contact[key] ?? ""}
                      onChange={(v) => updateContact(key, v)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Accordion>

          <Accordion
            id="summary"
            title="Professional Summary"
            openId={openId}
            setOpenId={setOpenId}
          >
            <div className="mb-3">
              {!summaryAiOpen ? (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSummaryAiOpen(true);
                        setSummaryAiError(null);
                      }}
                      className="rounded border border-blue-600 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      Fill with AI
                    </button>
                    <TranslateControl
                      section="summary"
                      onTranslate={translateSection}
                    />
                  </div>
                  <PrimaryButton onClick={addSummaryParagraph}>
                    + Add paragraph
                  </PrimaryButton>
                </div>
              ) : (
                <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-800">
                      Fill summary with AI
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setSummaryAiOpen(false);
                        setSummaryAiError(null);
                      }}
                      className="text-xs font-medium text-zinc-500 hover:text-zinc-800"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Paste a job description. Gemini rewrites only the summary to
                    match the role.
                  </p>
                  <TextArea
                    label="Job description"
                    value={summaryJobDescription}
                    onChange={setSummaryJobDescription}
                    rows={8}
                  />
                  {summaryAiError && (
                    <p className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">
                      {summaryAiError}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={fillSummaryWithAI}
                    disabled={summaryAiBusy || !summaryJobDescription.trim()}
                    className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {summaryAiBusy ? "Generating…" : "Fill with AI"}
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {cv.summary.map((paragraph, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                      Paragraph {i + 1}
                    </span>
                    {cv.summary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSummaryParagraph(i)}
                        className="text-xs font-medium text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <TextArea
                    value={paragraph}
                    onChange={(v) => updateSummaryParagraph(i, v)}
                    rows={5}
                  />
                </div>
              ))}
            </div>
          </Accordion>

          <Accordion
            id="experience"
            title="Professional Experience"
            openId={openId}
            setOpenId={setOpenId}
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <TranslateControl
                section="experience"
                onTranslate={translateSection}
              />
              <PrimaryButton onClick={addExperience}>
                + Add experience
              </PrimaryButton>
            </div>
            <div className="space-y-3">
              {cv.experience.map((job, i) => (
                <EntryCard
                  key={i}
                  title={job.role || `Experience ${i + 1}`}
                  onRemove={() => removeExperience(i)}
                >
                  <Field
                    label="Role"
                    value={job.role}
                    onChange={(v) => updateExperience(i, "role", v)}
                  />
                  <Field
                    label="Company"
                    value={job.company}
                    onChange={(v) => updateExperience(i, "company", v)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Field
                      label="Start"
                      value={job.start}
                      onChange={(v) => updateExperience(i, "start", v)}
                    />
                    <Field
                      label="End"
                      value={job.end}
                      onChange={(v) => updateExperience(i, "end", v)}
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                        Bullets
                      </span>
                      <PrimaryButton onClick={() => addExperienceBullet(i)}>
                        + Add bullet
                      </PrimaryButton>
                    </div>
                    <div className="space-y-2">
                      {job.bullets.map((bullet, j) => (
                        <div key={j} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                              Bullet {j + 1}
                            </span>
                            {job.bullets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeExperienceBullet(i, j)}
                                className="text-xs font-medium text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <TextArea
                            value={bullet}
                            onChange={(v) => updateExperienceBullet(i, j, v)}
                            rows={3}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </EntryCard>
              ))}
            </div>
          </Accordion>

          <Accordion
            id="education"
            title="Education"
            openId={openId}
            setOpenId={setOpenId}
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <TranslateControl
                section="education"
                onTranslate={translateSection}
              />
              <PrimaryButton onClick={addEducation}>
                + Add education
              </PrimaryButton>
            </div>
            <div className="space-y-3">
              {cv.education.map((ed, i) => (
                <EntryCard
                  key={i}
                  title={ed.degree || `Education ${i + 1}`}
                  onRemove={() => removeEducation(i)}
                >
                  <Field
                    label="Degree"
                    value={ed.degree}
                    onChange={(v) => updateEducation(i, "degree", v)}
                  />
                  <Field
                    label="Institution"
                    value={ed.institution}
                    onChange={(v) => updateEducation(i, "institution", v)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Field
                      label="Start"
                      value={ed.start}
                      onChange={(v) => updateEducation(i, "start", v)}
                    />
                    <Field
                      label="End"
                      value={ed.end}
                      onChange={(v) => updateEducation(i, "end", v)}
                    />
                  </div>
                </EntryCard>
              ))}
            </div>
          </Accordion>

          <Accordion
            id="skills"
            title="Technical Skills"
            openId={openId}
            setOpenId={setOpenId}
          >
            <div className="mb-3">
              {!skillsAiOpen ? (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSkillsAiOpen(true);
                        setSkillsAiError(null);
                      }}
                      className="rounded border border-blue-600 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      Fill with AI
                    </button>
                    <TranslateControl
                      section="skills"
                      onTranslate={translateSection}
                    />
                  </div>
                  <PrimaryButton onClick={addSkillCategory}>
                    + Add category
                  </PrimaryButton>
                </div>
              ) : (
                <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-800">
                      Fill skills with AI
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setSkillsAiOpen(false);
                        setSkillsAiError(null);
                      }}
                      className="text-xs font-medium text-zinc-500 hover:text-zinc-800"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Paste a job description. Gemini extracts the technical
                    skills it requires and replaces this section.
                  </p>
                  <TextArea
                    label="Job description"
                    value={skillsJobDescription}
                    onChange={setSkillsJobDescription}
                    rows={8}
                  />
                  {skillsAiError && (
                    <p className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">
                      {skillsAiError}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={fillSkillsWithAI}
                    disabled={skillsAiBusy || !skillsJobDescription.trim()}
                    className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {skillsAiBusy ? "Generating…" : "Fill with AI"}
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {Object.entries(cv.skills).map(([category, items], i) => (
                <EntryCard
                  key={i}
                  title={category}
                  onRemove={() => removeSkillCategory(category)}
                >
                  <Field
                    label="Category name"
                    value={category}
                    onChange={(v) => renameSkillCategory(category, v)}
                  />
                  <TextArea
                    label="Items (comma-separated)"
                    value={Array.isArray(items) ? items.join(", ") : items}
                    onChange={(v) => updateSkillItems(category, v)}
                    rows={2}
                  />
                </EntryCard>
              ))}
            </div>
          </Accordion>
        </div>
      </aside>

      <section className="flex-1 print:m-0 print:p-0">
        <PaperPreview cv={cv} />
      </section>
    </div>
  );
}
