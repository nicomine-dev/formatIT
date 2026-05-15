const BASE =
  "inline-flex items-center justify-center gap-[7px] rounded-2 px-[11px] py-[7px] text-[12.5px] font-medium leading-none transition-[background-color,border-color,color,box-shadow] duration-[120ms] focus:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--color-bg),0_0_0_4px_var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS = {
  primary:
    "border border-ink bg-ink text-paper hover:bg-[#000] hover:border-[#000]",
  ai: "border border-accent-rule bg-accent-soft text-accent-ink hover:bg-[#dde2f6]",
  outline: "border border-rule-strong bg-paper text-ink hover:bg-surface-2",
  ghost:
    "border border-transparent bg-transparent text-ink-2 hover:bg-[rgb(20_18_12_/_0.05)] hover:text-ink",
  danger:
    "border border-transparent bg-transparent text-danger hover:bg-danger-soft",
};

export default function Button({
  variant = "outline",
  type = "button",
  className = "",
  children,
  ...rest
}) {
  const variantCls = VARIANTS[variant] ?? VARIANTS.outline;
  return (
    <button
      type={type}
      className={`${BASE} ${variantCls} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}

export function AISigil({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-[14px] w-[14px] items-center justify-center text-[11px] leading-none ${className}`}
    >
      ✦
    </span>
  );
}
