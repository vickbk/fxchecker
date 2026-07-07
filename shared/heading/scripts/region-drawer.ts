import type { RegionMaping } from "../types";

export const LANDMARK_SELECTOR =
  "main, header, section, article, header, legend";
export const HEADING_SELECTOR = "h1, h2, h3, h4, h5, h6";

export function drawRegion<T extends Element>(element: T): RegionMaping {
  const regions = [...element.querySelectorAll(LANDMARK_SELECTOR)].filter(
    (region) => region.parentElement!.closest(LANDMARK_SELECTOR) === element,
  );

  const headings = [...element.querySelectorAll(HEADING_SELECTOR)]
    .filter((heading) => heading.closest(LANDMARK_SELECTOR) === element)
    .map((heading) => heading.tagName)
    .sort();

  const region = { tagName: element.tagName, headings, children: [] };

  if (regions.length === 0) {
    return region;
  }
  return {
    ...region,
    children: regions.map((region) => drawRegion(region)),
  };
}
