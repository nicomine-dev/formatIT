"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";

const DOT_GRID =
  "[background-image:radial-gradient(circle_at_1px_1px,rgb(20_18_12_/_0.06)_1px,transparent_0)] [background-size:16px_16px]";

export default function PreviewPane({ cv }) {
  const [downloading, setDownloading] = useState(false);

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
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-rule/60 bg-bg/80 px-8 py-4 backdrop-blur-sm print:hidden">
        <div className="flex items-center gap-3">
          <Label>A4 · 210 × 297 mm</Label>
        </div>
        <Button variant="primary" onClick={downloadPdf} disabled={downloading}>
          {downloading ? "Generating…" : "↓ Download PDF"}
        </Button>
      </div>
      <div className="flex flex-col items-center gap-8 px-6 py-10 lg:px-12">
        <div className="rounded-3 bg-paper p-16 text-[13px] leading-relaxed text-ink-2 shadow-paper">
          Preview will render here in step 7.
        </div>
      </div>
    </section>
  );
}
