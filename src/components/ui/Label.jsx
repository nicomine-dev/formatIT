export default function Label({ as: As = "span", className = "", children }) {
  return (
    <As
      className={`font-mono text-[10px] font-medium uppercase leading-none tracking-[0.12em] text-ink-3 ${className}`.trim()}
    >
      {children}
    </As>
  );
}
