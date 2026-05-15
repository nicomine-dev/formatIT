"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import PaperPreview from "@/components/PaperPreview";
import Label from "@/components/ui/Label";

const DOT_GRID =
  "[background-image:radial-gradient(circle_at_1px_1px,rgb(20_18_12_/_0.06)_1px,transparent_0)] [background-size:16px_16px]";

const ZOOM_STEPS = [0.34, 0.5, 0.75, 1];
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 1.5;

export default function PreviewPane({ cv }) {
  const [downloading, setDownloading] = useState(false);
  const [zoom, setZoom] = useState(1);

  const stepZoom = (dir) =>
    setZoom((z) => {
      if (dir > 0) {
        const next =
          ZOOM_STEPS.find((s) => s > z + 0.001) ?? Math.min(MAX_ZOOM, z + 0.1);
        return next;
      }
      const desc = [...ZOOM_STEPS].reverse();
      const next =
        desc.find((s) => s < z - 0.001) ?? Math.max(MIN_ZOOM, z - 0.1);
      return next;
    });

  const downloadPdf = async () => {
    if (typeof window === "undefined") return;
    setDownloading(true);
    try {
      const [{ pdf }, { default: CVPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/CVPdfDocument"),
      ]);
      const blob = await pdf(<CVPdfDocument cv={cv} />).toBlob();
      const url = URL.createObjectURL(blob);
      const sanitize = (s) => (s || "").replace(/[\\/:*?"<>|]+/g, "-").trim();
      const namePart = sanitize(cv.name) || "CV";
      const titlePart = sanitize(cv.title);
      const fileName = `${namePart}${titlePart ? ` - ${titlePart}` : ""}.pdf`;
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[formatIT] PDF generation failed:", err);
      alert("Could not generate the PDF. See the console for details.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section
      className={`relative flex-1 overflow-y-auto bg-bg ${DOT_GRID} print:m-0 print:bg-paper print:p-0`}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-rule/60 bg-bg/80 px-6 py-4 backdrop-blur-sm md:px-8 print:hidden">
        <div className="hidden items-center gap-3 md:flex">
          <Label>A4 · 210 × 297 mm</Label>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-rule bg-paper p-1 shadow-1">
          <button
            type="button"
            onClick={() => stepZoom(-1)}
            aria-label="Zoom out"
            disabled={zoom <= MIN_ZOOM}
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-[rgb(20_18_12_/_0.05)] hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>
          <span className="min-w-[3ch] text-center font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-ink-3">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => stepZoom(1)}
            aria-label="Zoom in"
            disabled={zoom >= MAX_ZOOM}
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-[rgb(20_18_12_/_0.05)] hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>
        <Button variant="primary" onClick={downloadPdf} disabled={downloading}>
          {downloading ? (
            "Generating…"
          ) : (
            <>
              <span aria-hidden="true">↓</span>
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </>
          )}
        </Button>
      </div>
      <div className="flex justify-center px-2 py-8 md:px-6 lg:px-12">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            width: "794px",
          }}
        >
          <PaperPreview cv={cv} />
        </div>
      </div>
    </section>
  );
}
