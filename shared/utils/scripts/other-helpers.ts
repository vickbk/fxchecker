import {
  QueryValue,
  ScrollOptions,
  ScrollTarget,
} from "../types/other-helpers";

export function joinClasses(...classes: (string | false)[]) {
  return classes.filter((c) => c !== false).join(" ");
}

export function keyFromSearchQuery(
  keys: Record<string, string | number>,
  ...include: string[]
): string {
  if (!keys) return "";

  let result = "";

  // 1. Driven by `include`: O(M) loop with O(1) object lookups
  if (include.length > 0) {
    for (let i = 0; i < include.length; i++) {
      const key = include[i];
      const val = keys[key];

      if (val !== undefined) {
        if (result.length > 0) result += "-";
        result += key + "-" + val;
      }
    }
    return result;
  }

  // 2. Fallback when no `include` array is passed
  const keyList = Object.keys(keys);
  for (let i = 0; i < keyList.length; i++) {
    const key = keyList[i];
    const val = keys[key];

    if (val !== undefined) {
      if (result.length > 0) result += "-";
      result += key + "-" + val;
    }
  }

  return result;
}

export function getSearchQuery(
  queries: URLSearchParams,
  ...params: Array<[string, QueryValue]>
): string {
  if (!queries) return "";

  // 1. Fast exit: Avoid copying URLSearchParams if no updates were passed
  if (params.length === 0) return queries.toString();

  const nextQueries = new URLSearchParams(queries);
  const len = params.length;

  // 2. High-performance indexed loop
  for (let i = 0; i < len; i++) {
    const pair = params[i];
    if (!pair) continue;

    const key = pair[0];
    const val = pair[1];

    // 3. Clean up empty/nullish parameters to prevent URL pollution
    if (val === undefined || val === null || val === "") {
      nextQueries.delete(key);
    } else {
      nextQueries.set(key, String(val));
    }
  }

  return nextQueries.toString();
}

export function getSearchQueryObject(
  queries: URLSearchParams,
  params: Record<string, QueryValue>,
): string {
  if (!queries) return "";
  if (!params) return queries.toString();

  const nextQueries = new URLSearchParams(queries);
  const keys = Object.keys(params);
  const len = keys.length;

  for (let i = 0; i < len; i++) {
    const key = keys[i];
    const val = params[key];

    if (val === undefined || val === null || val === "") {
      nextQueries.delete(key);
    } else {
      nextQueries.set(key, String(val));
    }
  }

  return nextQueries.toString();
}

export function scrollIntoView(
  target?: ScrollTarget,
  options?: ScrollOptions,
): void {
  if (!target || typeof window === "undefined") return;

  // 1. Resolve target (handles React refs, CSS selectors, or direct DOM elements)
  let element: Element | null = null;

  if (typeof target === "string") {
    element = document.querySelector(target);
  } else if ("current" in target) {
    element = target.current;
  } else {
    element = target;
  }

  if (!element) return;

  // 2. Check accessibility settings for motion sensitivity
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const { useAnimationFrame = false, ...scrollOptions } = options || {};

  // 3. Merge sensible defaults with custom options and a11y overrides
  const finalOptions: ScrollIntoViewOptions = {
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "center",
    inline: "nearest",
    ...scrollOptions,
  };

  // 4. Perform scroll (optionally scheduled after next DOM paint)
  if (useAnimationFrame) {
    requestAnimationFrame(() => {
      element?.scrollIntoView(finalOptions);
    });
  } else {
    element.scrollIntoView(finalOptions);
  }
}
