export default function Spinner({ size = 12, className = "" }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-[rgb(20_18_12_/_0.12)] border-t-accent [animation-duration:900ms] ${className}`.trim()}
      style={{ width: size, height: size }}
    />
  );
}
