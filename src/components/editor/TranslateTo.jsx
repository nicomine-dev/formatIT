"use client";

import Spinner from "@/components/ui/Spinner";

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20" />
      <path d="M12 2a15.3 15.3 0 0 0 0 20" />
    </svg>
  );
}

export default function TranslateTo({
  section,
  label = "Translate to…",
  status,
  error,
  isOpen,
  onOpen,
  onClose,
  onTranslate,
}) {
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex items-center gap-[7px] rounded-full border border-transparent px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink-2 hover:bg-[rgb(20_18_12_/_0.05)] hover:text-ink focus:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--color-bg),0_0_0_4px_var(--color-accent)]"
      >
        <GlobeIcon />
        {label}
      </button>
    );
  }

  const loading = status === "loading";

  return (
    <div className="space-y-2">
      <div className="inline-flex items-center gap-1 rounded-full border border-rule bg-paper p-1 shadow-1">
        {loading ? (
          <span className="flex items-center gap-2 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink-2">
            <Spinner size={10} />
            Translating…
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onTranslate(section, "English")}
              className="rounded-full px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink-2 transition-colors hover:bg-[rgb(20_18_12_/_0.05)] hover:text-ink focus:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--color-bg),0_0_0_4px_var(--color-accent)]"
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onTranslate(section, "Spanish")}
              className="rounded-full px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink-2 transition-colors hover:bg-[rgb(20_18_12_/_0.05)] hover:text-ink focus:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--color-bg),0_0_0_4px_var(--color-accent)]"
            >
              Spanish
            </button>
          </>
        )}
        <span aria-hidden="true" className="mx-1 h-[14px] w-px bg-rule" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Cancel translate"
          className="flex h-6 w-6 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-[rgb(20_18_12_/_0.05)] hover:text-ink focus:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--color-bg),0_0_0_4px_var(--color-accent)]"
        >
          ×
        </button>
      </div>
      {error && (
        <div
          role="alert"
          className="rounded-2 border border-[#ecbdb0] bg-danger-soft px-3 py-2 text-[12px] text-danger"
        >
          {error}
        </div>
      )}
    </div>
  );
}
