'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import CV from '@/components/CV';

const PAGE_HEIGHT_MM = 297;
const MM_TO_PX = 96 / 25.4;
const PAGE_HEIGHT_PX = PAGE_HEIGHT_MM * MM_TO_PX;

export default function PaperPreview({ cv }) {
  const measureRef = useRef(null);
  const [pages, setPages] = useState(1);

  useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) return;
    const update = () => {
      const h = node.scrollHeight;
      setPages(Math.max(1, Math.ceil(h / PAGE_HEIGHT_PX)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, [cv]);

  return (
    <>
      <div className="space-y-6 print:hidden">
        {Array.from({ length: pages }).map((_, i) => {
          const isFirst = i === 0;
          const multiPage = pages > 1;
          return (
            <div
              key={i}
              className="relative mx-auto w-[210mm] overflow-hidden bg-white shadow-md"
              style={
                multiPage
                  ? { height: `${PAGE_HEIGHT_MM}mm` }
                  : { minHeight: `${PAGE_HEIGHT_MM}mm` }
              }
            >
              <div
                ref={isFirst ? measureRef : null}
                style={
                  multiPage
                    ? { transform: `translateY(-${i * PAGE_HEIGHT_MM}mm)` }
                    : undefined
                }
              >
                <CV cv={cv} />
              </div>
              {multiPage && (
                <span className="absolute right-3 top-3 rounded bg-zinc-700/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Page {i + 1} / {pages}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden print:block">
        <div className="mx-auto w-[210mm]">
          <CV cv={cv} />
        </div>
      </div>
    </>
  );
}
