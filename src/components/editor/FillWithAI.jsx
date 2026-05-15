"use client";

import { AISigil } from "@/components/ui/Button";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import Spinner from "@/components/ui/Spinner";

function ShimmerLines() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="space-y-2 rounded-2 border border-accent-rule bg-paper/70 p-3"
    >
      <span className="sr-only">Generating…</span>
      {[0.85, 0.95, 0.75, 0.6].map((w, i) => (
        <span
          key={i}
          className="block h-3 rounded-1 bg-[linear-gradient(90deg,var(--color-accent-soft)_0%,#cad2f4_50%,var(--color-accent-soft)_100%)] bg-[length:200%_100%] [animation:shimmer_1.4s_linear_infinite]"
          style={{ width: `${w * 100}%` }}
        />
      ))}
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}

const TITLE_BY_SECTION = {
  summary: "Tailor the summary to a role",
  skills: "Extract skills from a job description",
};

const HINT_BY_SECTION = {
  summary:
    "Paste the job description. Gemini reads the role, seniority and stack, and rewrites your summary to match.",
  skills:
    "Paste the job description. Gemini extracts every technical skill it requires and rebuilds the categories.",
};

export default function FillWithAI({ section, controller }) {
  const { open, prompt, status, error, setPrompt, setOpen, submit } =
    controller;
  const loading = status === "loading";

  if (!open) {
    return (
      <Button variant="ai" onClick={() => setOpen(true)}>
        <AISigil />
        Fill with AI
      </Button>
    );
  }

  return (
    <div className="anim-fade-slide-down rounded-3 border border-accent-rule bg-accent-soft p-[14px]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-[18px] w-[18px] items-center justify-center rounded-1 bg-accent text-[11px] text-paper"
          >
            ✦
          </span>
          <div>
            <h4 className="text-[12.5px] font-semibold leading-tight text-accent-ink">
              Fill with AI
            </h4>
            <p className="mt-0.5 text-[11.5px] leading-snug text-accent-ink/80">
              {TITLE_BY_SECTION[section]}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close AI panel"
          className="flex h-6 w-6 items-center justify-center rounded-full text-accent-ink/70 transition-colors hover:bg-paper/60 hover:text-accent-ink focus:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--color-accent-soft),0_0_0_4px_var(--color-accent)]"
        >
          ×
        </button>
      </div>

      <div className="space-y-2">
        <Label>Job description</Label>
        {loading ? (
          <ShimmerLines />
        ) : (
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            placeholder={HINT_BY_SECTION[section]}
            className="block w-full resize-y rounded-2 border border-accent-rule bg-paper/70 px-[11px] py-[9px] text-[13px] leading-[1.55] text-ink transition-[border-color,box-shadow] duration-[120ms] focus:border-accent focus:outline-none focus:[box-shadow:0_0_0_3px_var(--color-paper)] placeholder:text-ink-3"
          />
        )}
        {error && status === "error" && (
          <div
            role="alert"
            className="rounded-2 border border-[#ecbdb0] bg-danger-soft px-3 py-2 text-[12px] text-danger"
          >
            {error}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent-ink/70">
          Powered by Gemini
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="ai"
            onClick={submit}
            disabled={loading || !prompt.trim()}
          >
            {loading ? <Spinner size={12} /> : <AISigil />}
            {loading ? "Generating…" : "Generate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
