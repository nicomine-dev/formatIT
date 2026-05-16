import Label from "@/components/ui/Label";

export default function TopBar({
  saved = true,
  isPro = false,
  email = "",
  onUpgrade,
  onSignOut,
}) {
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
      <div className="flex items-center gap-4">
        <Label className="hidden !text-ink-3 md:inline">
          {saved ? "saved" : "unsaved"}
        </Label>
        <span aria-hidden="true" className="hidden text-ink-4 md:inline">
          ·
        </span>
        <Label className="hidden !text-ink-3 md:inline">A4</Label>
        <span aria-hidden="true" className="hidden text-ink-4 md:inline">
          ·
        </span>
        <Label className="hidden !text-ink-3 md:inline">10.5 pt</Label>
        {isPro ? (
          <button
            type="button"
            onClick={onSignOut}
            title={
              email ? `Signed in as ${email}. Click to sign out.` : "Sign out"
            }
            className="inline-flex items-center gap-1.5 rounded-full border border-accent-rule bg-accent-soft px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-accent-ink transition-colors hover:bg-accent hover:text-paper"
          >
            <span aria-hidden="true">✦</span>
            Pro
          </button>
        ) : (
          <button
            type="button"
            onClick={onUpgrade}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-paper transition-colors hover:bg-ink-2"
          >
            <span aria-hidden="true">✦</span>
            Upgrade
          </button>
        )}
      </div>
    </header>
  );
}
