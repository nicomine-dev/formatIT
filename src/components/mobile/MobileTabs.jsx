"use client";

export default function MobileTabs({ value, onChange }) {
  return (
    <nav
      role="tablist"
      aria-label="View mode"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-2 border-t border-rule bg-surface/95 px-4 py-3 backdrop-blur-sm md:hidden print:hidden"
    >
      {["edit", "preview"].map((key) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(key)}
            className={`flex-1 rounded-3 px-4 py-2.5 text-[12px] font-medium capitalize tracking-[-0.005em] transition-colors focus:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--color-bg),0_0_0_4px_var(--color-accent)] ${
              active
                ? "bg-ink text-paper"
                : "bg-transparent text-ink-2 hover:bg-[rgb(20_18_12_/_0.05)]"
            }`}
          >
            {key}
          </button>
        );
      })}
    </nav>
  );
}
