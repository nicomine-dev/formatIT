import Label from "@/components/ui/Label";

const TEXTAREA_CLS =
  "block w-full resize-y rounded-2 border border-rule bg-paper px-[11px] py-[9px] text-[13px] leading-[1.55] text-ink transition-[border-color,box-shadow] duration-[120ms] focus:border-accent focus:outline-none focus:[box-shadow:0_0_0_3px_var(--color-accent-soft)] placeholder:text-ink-3";

export default function Textarea({
  label,
  value,
  onChange,
  rows = 4,
  className = "",
  ...rest
}) {
  if (!label) {
    return (
      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${TEXTAREA_CLS} ${className}`.trim()}
        {...rest}
      />
    );
  }
  return (
    <label className="block space-y-[6px]">
      <Label>{label}</Label>
      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${TEXTAREA_CLS} ${className}`.trim()}
        {...rest}
      />
    </label>
  );
}

export { TEXTAREA_CLS };
