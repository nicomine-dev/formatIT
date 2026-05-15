import Label from "@/components/ui/Label";

export default function TopBar({ saved = true }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-rule bg-surface/80 px-6 backdrop-blur-sm print:hidden">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-[22px] w-[22px] items-center justify-center rounded-1 bg-ink font-mono text-[12px] font-semibold text-paper"
        >
          f
        </span>
        <span className="text-[13.5px] font-semibold tracking-[-0.015em] text-ink">
          formatIT
        </span>
        <Label className="!text-ink-3">v0.4 · resume builder</Label>
      </div>
      <div className="hidden items-center gap-4 md:flex">
        <Label className="!text-ink-3">{saved ? "saved" : "unsaved"}</Label>
        <span aria-hidden="true" className="text-ink-4">
          ·
        </span>
        <Label className="!text-ink-3">A4</Label>
        <span aria-hidden="true" className="text-ink-4">
          ·
        </span>
        <Label className="!text-ink-3">10.5 pt</Label>
      </div>
    </header>
  );
}
