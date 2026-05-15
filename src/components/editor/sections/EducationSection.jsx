import Button from "@/components/ui/Button";
import EntryCard from "@/components/editor/EntryCard";
import Input from "@/components/ui/Input";
import SectionTranslate from "@/components/editor/SectionTranslate";

export default function EducationSection({ cv, setCv, translate }) {
  const update = (i, key, value) =>
    setCv((prev) => ({
      ...prev,
      education: prev.education.map((e, idx) =>
        idx === i ? { ...e, [key]: value } : e,
      ),
    }));
  const add = () =>
    setCv((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: "", institution: "", start: "", end: "" },
      ],
    }));
  const remove = (i) =>
    setCv((prev) => ({
      ...prev,
      education: prev.education.filter((_, idx) => idx !== i),
    }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTranslate section="education" translate={translate} />
        <Button variant="ghost" onClick={add}>
          + Add education
        </Button>
      </div>
      <div className="space-y-3">
        {cv.education.map((ed, i) => (
          <EntryCard
            key={i}
            kind="Education"
            index={i + 1}
            onRemove={() => remove(i)}
          >
            <Input
              label="Degree"
              value={ed.degree}
              onChange={(v) => update(i, "degree", v)}
            />
            <Input
              label="Institution"
              value={ed.institution}
              onChange={(v) => update(i, "institution", v)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start"
                value={ed.start}
                onChange={(v) => update(i, "start", v)}
              />
              <Input
                label="End"
                value={ed.end}
                onChange={(v) => update(i, "end", v)}
              />
            </div>
          </EntryCard>
        ))}
      </div>
    </div>
  );
}
