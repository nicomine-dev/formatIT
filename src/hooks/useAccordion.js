"use client";

import { useCallback, useMemo, useRef, useState } from "react";

export default function useAccordion(initialOpen = null, ids = []) {
  const [open, setOpen] = useState(initialOpen);
  const buttonRefs = useRef({});

  const toggle = useCallback((id) => {
    setOpen((current) => (current === id ? null : id));
  }, []);

  const close = useCallback(() => setOpen(null), []);

  const registerRef = useCallback(
    (id) => (el) => {
      if (el) buttonRefs.current[id] = el;
      else delete buttonRefs.current[id];
    },
    [],
  );

  const focusAt = useCallback((idList, index) => {
    const target = idList[(index + idList.length) % idList.length];
    const node = buttonRefs.current[target];
    if (node) node.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e, id) => {
      const idx = ids.indexOf(id);
      if (idx === -1) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          focusAt(ids, idx + 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          focusAt(ids, idx - 1);
          break;
        case "Home":
          e.preventDefault();
          focusAt(ids, 0);
          break;
        case "End":
          e.preventDefault();
          focusAt(ids, ids.length - 1);
          break;
        case "Escape":
          if (open === id) {
            e.preventDefault();
            close();
          }
          break;
        default:
          break;
      }
    },
    [ids, open, focusAt, close],
  );

  return useMemo(
    () => ({ open, toggle, close, registerRef, handleKeyDown }),
    [open, toggle, close, registerRef, handleKeyDown],
  );
}
