"use client";

import { useLayoutEffect, useRef, useState } from "react";
import CVPaper from "@/components/preview/CVPaper";

const PAGE_HEIGHT_PX = 1123; // A4 @ 96dpi
const FOOTER_RESERVE = 56;

export default function CVMultiPage({ cv }) {
  const measureRef = useRef(null);
  const [pages, setPages] = useState(1);

  useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) return;
    const update = () => {
      const usable = PAGE_HEIGHT_PX - FOOTER_RESERVE;
      const h = node.scrollHeight;
      setPages(Math.max(1, Math.ceil(h / usable)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, [cv]);

  if (pages === 1) {
    return <CVPaper cv={cv} innerRef={measureRef} />;
  }

  const sliceHeight = PAGE_HEIGHT_PX - FOOTER_RESERVE;

  return (
    <div className="flex flex-col items-center gap-8">
      {Array.from({ length: pages }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden bg-paper"
          style={{
            width: "794px",
            height: `${PAGE_HEIGHT_PX}px`,
            boxShadow: "var(--shadow-paper)",
          }}
        >
          {i > 0 && (
            <div className="absolute left-[72px] top-[28px] z-10 font-mono text-[9pt] uppercase tracking-[0.12em] text-[#666]">
              {cv.name} · cont.
            </div>
          )}
          <div style={{ transform: `translateY(-${i * sliceHeight}px)` }}>
            <CVPaper
              cv={cv}
              innerRef={i === 0 ? measureRef : null}
              withShadow={false}
            />
          </div>
          <div className="absolute bottom-[32px] left-[72px] right-[72px] flex justify-between font-mono text-[8pt] uppercase tracking-[0.12em] text-[#888]">
            <span>{cv.name}</span>
            <span>
              {i + 1} / {pages}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
