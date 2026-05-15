import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";

export default function EditorPanel({ cv, setCv }) {
  const reset = () => {
    if (
      confirm(
        "Reset the CV to the default content? Your current edits will be lost.",
      )
    ) {
      import("@/data/cv").then((m) => setCv(m.cv));
    }
  };

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
        <p className="text-[12.5px] leading-relaxed text-ink-2">
          Sections live below. Expand one at a time, edit inline, and the
          preview on the right updates as you type.
        </p>
      </div>
    </aside>
  );
}
