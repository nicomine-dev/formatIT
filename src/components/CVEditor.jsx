'use client';

import { useState } from 'react';
import CV from '@/components/CV';
import { cv as initialCv } from '@/data/cv';

const CONTACT_FIELDS = [
  { key: 'location', label: 'Location' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'github', label: 'GitHub' },
  { key: 'portfolio', label: 'Portfolio' },
];

function Field({ label, value, onChange, type = 'text' }) {
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
          className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
  const [openId, setOpenId] = useState('header');

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
    setCv((prev) => ({ ...prev, summary: [...prev.summary, ''] }));
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
          ? { ...e, bullets: e.bullets.map((b, j) => (j === bIndex ? value : b)) }
          : e,
      ),
    }));
  const addExperienceBullet = (expIndex) =>
    setCv((prev) => ({
      ...prev,
      experience: prev.experience.map((e, i) =>
        i === expIndex ? { ...e, bullets: [...e.bullets, ''] } : e,
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
        { role: '', company: '', start: '', end: '', bullets: [''] },
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
        { degree: '', institution: '', start: '', end: '' },
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
      skills: {
        ...prev.skills,
        [category]: itemsString
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      },
    }));
  const addSkillCategory = () =>
    setCv((prev) => {
      let name = 'New Category';
      let n = 1;
      while (Object.prototype.hasOwnProperty.call(prev.skills, name)) {
        n += 1;
        name = `New Category ${n}`;
      }
      return { ...prev, skills: { ...prev.skills, [name]: [] } };
    });
  const removeSkillCategory = (category) =>
    setCv((prev) => {
      const next = { ...prev.skills };
      delete next[category];
      return { ...prev, skills: next };
    });

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-zinc-100 p-6 lg:flex-row print:p-0">
      <aside className="w-full shrink-0 rounded-lg bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:w-96 lg:overflow-y-auto print:hidden">
        <h2 className="mb-4 text-lg font-bold text-zinc-900">Edit CV</h2>

        <div className="space-y-3">
          <Accordion id="header" title="Header" openId={openId} setOpenId={setOpenId}>
            <div className="space-y-4">
              <Field
                label="Name"
                value={cv.name}
                onChange={(v) => updateField('name', v)}
              />
              <Field
                label="Subtitle"
                value={cv.title}
                onChange={(v) => updateField('title', v)}
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
                      value={cv.contact[key] ?? ''}
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
            <div className="mb-3 flex justify-end">
              <PrimaryButton onClick={addSummaryParagraph}>+ Add paragraph</PrimaryButton>
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
            <div className="mb-3 flex justify-end">
              <PrimaryButton onClick={addExperience}>+ Add experience</PrimaryButton>
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
                    onChange={(v) => updateExperience(i, 'role', v)}
                  />
                  <Field
                    label="Company"
                    value={job.company}
                    onChange={(v) => updateExperience(i, 'company', v)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Field
                      label="Start"
                      value={job.start}
                      onChange={(v) => updateExperience(i, 'start', v)}
                    />
                    <Field
                      label="End"
                      value={job.end}
                      onChange={(v) => updateExperience(i, 'end', v)}
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
            <div className="mb-3 flex justify-end">
              <PrimaryButton onClick={addEducation}>+ Add education</PrimaryButton>
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
                    onChange={(v) => updateEducation(i, 'degree', v)}
                  />
                  <Field
                    label="Institution"
                    value={ed.institution}
                    onChange={(v) => updateEducation(i, 'institution', v)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Field
                      label="Start"
                      value={ed.start}
                      onChange={(v) => updateEducation(i, 'start', v)}
                    />
                    <Field
                      label="End"
                      value={ed.end}
                      onChange={(v) => updateEducation(i, 'end', v)}
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
            <div className="mb-3 flex justify-end">
              <PrimaryButton onClick={addSkillCategory}>+ Add category</PrimaryButton>
            </div>
            <div className="space-y-3">
              {Object.entries(cv.skills).map(([category, items]) => (
                <EntryCard
                  key={category}
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
                    value={items.join(', ')}
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
        <CV cv={cv} />
      </section>
    </div>
  );
}
