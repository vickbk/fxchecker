import type { RegionMaping } from "../types";

/**
 * Recursively validates that the heading levels in a region tree follow semantic HTML rules.
 *
 * - Allows heading levels to increase by 1 (e.g., H2 after H1) or remain the same (for clamped H6 or
 *   when a region lacks its own heading but contains children).
 * - Clamps at H6: deeper nested headings remain at H6, as required by the HTML spec.
 * - If a region has no heading, its children do not increment the level.
 * - Returns false if heading levels exceed H6 or if a child region violates the allowed increment.
 *
 * Architectural note:
 * - Assumes each region has at most one heading relevant for the hierarchy (other tests cover multiple headings per region).
 * - Designed for flexibility: allows for sections without headings and repeated H6 at deep nesting.
 *
 * @param region - The region mapping object representing a semantic region and its headings/children.
 * @param currentLevel - The current heading level context (default: 1 for H1).
 * @returns boolean indicating whether the heading order is valid throughout the tree.
 */

export function checkHeadingOrder(
  region: RegionMaping,
  currentLevel = 1,
): boolean {
  if (currentLevel > 6) return false;

  const { headings, children } = region;

  const level = +(headings[0]?.match(/\d+/)?.[0] ?? currentLevel);
  return (
    [0, 1].includes(level - currentLevel) &&
    children.every((child) => checkHeadingOrder(child, level))
  );
}
