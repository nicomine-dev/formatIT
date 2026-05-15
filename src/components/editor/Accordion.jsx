"use client";

export function AccordionList({ children }) {
  return <div className="space-y-2">{children}</div>;
}

export default function Accordion({
  id,
  index,
  title,
  count,
  isOpen,
  onToggle,
  registerRef,
  onKeyDown,
  children,
}) {
  const indexLabel = String(index).padStart(2, "0");
  const headerId = `acc-h-${id}`;
  const panelId = `acc-p-${id}`;

  return (
    <section
      className={`rounded-3 border transition-colors ${
        isOpen
          ? "border-rule bg-paper shadow-1"
          : "border-transparent bg-transparent hover:bg-[rgb(20_18_12_/_0.035)]"
      }`}
    >
      <h3 className="m-0">
        <button
          ref={registerRef ? registerRef(id) : null}
          id={headerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => onToggle(id)}
          onKeyDown={(e) => onKeyDown?.(e, id)}
          className="flex w-full items-center gap-3 rounded-3 px-[14px] py-[13px] text-left focus:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--color-bg),0_0_0_4px_var(--color-accent)]"
        >
          <span className="font-mono text-[10px] font-medium tracking-[0.12em] text-ink-3">
            {indexLabel}
          </span>
          <span className="flex-1 text-[13.5px] font-medium tracking-[-0.005em] text-ink">
            {title}
          </span>
          {count != null && (
            <span className="font-mono text-[10px] font-medium tracking-[0.08em] text-ink-3">
              {count}
            </span>
          )}
          <span
            aria-hidden="true"
            className={`inline-block text-[12px] text-ink-3 transition-transform duration-[200ms] [transition-timing-function:cubic-bezier(.2,.7,.3,1)] ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </button>
      </h3>
      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          className="anim-fade-slide-down px-[14px] pb-4 pt-1"
        >
          <div className="space-y-[14px]">{children}</div>
        </div>
      )}
    </section>
  );
}
