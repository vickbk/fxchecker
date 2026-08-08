import type { ScrollOptions, ScrollTarget } from "../types/scroll-into-view";

export function scrollIntoView(
  target?: ScrollTarget,
  options?: ScrollOptions,
): void {
  if (!target || typeof window === "undefined") return;

  let element: Element | null = null;

  if (typeof target === "string") {
    element = document.querySelector(target);
  } else if ("current" in target) {
    element = target.current;
  } else {
    element = target;
  }

  if (!element) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const { useAnimationFrame = false, ...scrollOptions } = options || {};

  const finalOptions: ScrollIntoViewOptions = {
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "center",
    inline: "nearest",
    ...scrollOptions,
  };

  if (useAnimationFrame) {
    requestAnimationFrame(() => {
      element?.scrollIntoView(finalOptions);
    });
  } else {
    element.scrollIntoView(finalOptions);
  }
}
