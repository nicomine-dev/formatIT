import Button from "@/components/ui/Button";
import EntryCard from "@/components/editor/EntryCard";
import FillWithAI from "@/components/editor/FillWithAI";
import Input from "@/components/ui/Input";
import SectionTranslate from "@/components/editor/SectionTranslate";
import Textarea from "@/components/ui/Textarea";
import useFillWithAI from "@/hooks/useFillWithAI";

export default function SkillsSection({ cv, setCv, translate }) {
  const fill = useFillWithAI({ section: "skills", cv, setCv });
  const rename = (oldName, newName) =>
    setCv((prev) => {
      if (newName === oldName) return prev;
      const next = {};
      for (const [k, v] of Object.entries(prev.skills)) {
        next[k === oldName ? newName : k] = v;
      }
      return { ...prev, skills: next };
    });
  const updateItems = (category, value) =>
    setCv((prev) => ({
      ...prev,
      skills: { ...prev.skills, [category]: value },
    }));
  const add = () =>
    setCv((prev) => {
      let name = "New Category";
      let n = 1;
      while (Object.prototype.hasOwnProperty.call(prev.skills, name)) {
        n += 1;
        name = `New Category ${n}`;
      }
      return { ...prev, skills: { ...prev.skills, [name]: "" } };
    });
  const remove = (category) =>
    setCv((prev) => {
      const next = { ...prev.skills };
      delete next[category];
      return { ...prev, skills: next };
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {!fill.open && <FillWithAI section="skills" controller={fill} />}
          <SectionTranslate section="skills" translate={translate} />
        </div>
        <Button variant="ghost" onClick={add}>
          + Add category
        </Button>
      </div>
      {fill.open && <FillWithAI section="skills" controller={fill} />}
      <div className="space-y-3">
        {Object.entries(cv.skills).map(([category, items], i) => (
          <EntryCard
            key={i}
            kind="Skill group"
            index={i + 1}
            onRemove={() => remove(category)}
          >
            <Input
              label="Category"
              value={category}
              onChange={(v) => rename(category, v)}
            />
            <Textarea
              label="Items (comma-separated)"
              value={Array.isArray(items) ? items.join(", ") : items}
              onChange={(v) => updateItems(category, v)}
              rows={2}
            />
          </EntryCard>
        ))}
      </div>
    </div>
  );
}
