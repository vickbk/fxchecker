// src/features/header/modules/live-market/useMarqueeVisibility.ts
import { useCallback, useEffect, useRef, useState } from "react";

export function useMarqueeVisibility<
  C extends HTMLElement = HTMLDivElement,
  I extends HTMLElement = HTMLElement,
>() {
  const containerRef = useRef<C | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [hasHydrated, setHasHydrated] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    (() => setHasHydrated(true))();
  }, []);

  // Initialize IntersectionObserver scoped to the container viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        setVisibleKeys((prev) => {
          const next = new Set(prev);
          let changed = false;

          for (const entry of entries) {
            const key = entry.target.getAttribute("data-marquee-key");
            if (!key) continue;

            if (entry.isIntersecting) {
              if (!next.has(key)) {
                next.add(key);
                changed = true;
              }
            } else {
              if (next.has(key)) {
                next.delete(key);
                changed = true;
              }
            }
          }

          return changed ? next : prev;
        });
      },
      {
        root: container,
        threshold: 0.05, // Trigger as soon as 5% of the item enters or leaves
      },
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Callback ref to register items dynamically as they mount or duplicate
  const registerItem = useCallback((key: string) => {
    return (node: I | null) => {
      if (!node) return;
      node.setAttribute("data-marquee-key", key);
      observerRef.current?.observe(node);
    };
  }, []);

  /**
   * Helper to evaluate item visibility
   * @param key Unique key for the item (e.g. "trackA-USD-EUR")
   * @param isTrackA Whether the item belongs to the primary track (used for SSR fallback)
   */
  const isItemVisible = useCallback(
    (key: string, isTrackA: boolean = false): boolean => {
      if (!hasHydrated) {
        return isTrackA;
      }
      return visibleKeys.has(key);
    },
    [hasHydrated, visibleKeys],
  );

  return { containerRef, registerItem, isItemVisible };
}
