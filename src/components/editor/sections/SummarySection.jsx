import Button from "@/components/ui/Button";
import FillWithAI from "@/components/editor/FillWithAI";
import Label from "@/components/ui/Label";
import SectionTranslate from "@/components/editor/SectionTranslate";
import Textarea from "@/components/ui/Textarea";
import useFillWithAI from "@/hooks/useFillWithAI";

export default function SummarySection({ cv, setCv, translate, email }) {
  const fill = useFillWithAI({ section: "summary", cv, setCv, email });
  const update = (i, value) =>
    setCv((prev) => ({
      ...prev,
      summary: prev.summary.map((p, idx) => (idx === i ? value : p)),
    }));
  const add = () =>
    setCv((prev) => ({ ...prev, summary: [...prev.summary, ""] }));
  const remove = (i) =>
    setCv((prev) => ({
      ...prev,
      summary: prev.summary.filter((_, idx) => idx !== i),
    }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {!fill.open && <FillWithAI section="summary" controller={fill} />}
          <SectionTranslate section="summary" translate={translate} />
        </div>
        <Button variant="ghost" onClick={add}>
          + Add paragraph
        </Button>
      </div>
      {fill.open && <FillWithAI section="summary" controller={fill} />}
      <div className="space-y-4">
        {cv.summary.map((paragraph, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Paragraph {String(i + 1).padStart(2, "0")}</Label>
              {cv.summary.length > 1 && (
                <Button variant="danger" onClick={() => remove(i)}>
                  Remove
                </Button>
              )}
            </div>
            <Textarea
              value={paragraph}
              onChange={(v) => update(i, v)}
              rows={5}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
