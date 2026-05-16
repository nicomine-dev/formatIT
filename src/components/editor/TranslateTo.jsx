"use client";

import Spinner from "@/components/ui/Spinner";

const FREE_LANGUAGES = ["English", "Spanish"];
const PRO_LANGUAGES = ["French", "Portuguese", "German", "Italian"];

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
  isPro = false,
  onUpgrade,
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
  const langButton = (lang, locked) => (
    <button
      key={lang}
      type="button"
      onClick={() => {
        if (locked) onUpgrade?.();
        else onTranslate(section, lang);
      }}
      title={locked ? "Pro feature — upgrade to unlock" : undefined}
      className={`flex items-center gap-1 rounded-full px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] transition-colors focus:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--color-bg),0_0_0_4px_var(--color-accent)] ${
        locked
          ? "text-ink-3 hover:bg-[rgb(20_18_12_/_0.03)] hover:text-ink-2"
          : "text-ink-2 hover:bg-[rgb(20_18_12_/_0.05)] hover:text-ink"
      }`}
    >
      {lang}
      {locked && <span aria-hidden="true">✦</span>}
    </button>
  );

  return (
    <div className="space-y-2">
      <div className="inline-flex flex-wrap items-center gap-1 rounded-2xl border border-rule bg-paper p-1 shadow-1">
        {loading ? (
          <span className="flex items-center gap-2 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink-2">
            <Spinner size={10} />
            Translating…
          </span>
        ) : (
          <>
            {FREE_LANGUAGES.map((l) => langButton(l, false))}
            {PRO_LANGUAGES.map((l) => langButton(l, !isPro))}
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
