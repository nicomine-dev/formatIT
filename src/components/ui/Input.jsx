import Label from "@/components/ui/Label";

const INPUT_CLS =
  "block w-full rounded-2 border border-rule bg-paper px-[11px] py-[9px] text-[13px] leading-[1.4] text-ink transition-[border-color,box-shadow] duration-[120ms] focus:border-accent focus:outline-none focus:[box-shadow:0_0_0_3px_var(--color-accent-soft)] placeholder:text-ink-3";

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  className = "",
  ...rest
}) {
  if (!label) {
    return (
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${INPUT_CLS} ${className}`.trim()}
        {...rest}
      />
    );
  }
  return (
    <label className="block space-y-[6px]">
      <Label>{label}</Label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${INPUT_CLS} ${className}`.trim()}
        {...rest}
      />
    </label>
  );
}

export { INPUT_CLS };
