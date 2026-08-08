import { RegionMapping } from "../types";

/**
 * Recursively validates that heading levels in a region tree follow semantic HTML rules.
 *
 * - Headings can increase by at most 1 (e.g., H1 -> H2).
 * - Headings can remain the same level (sibling sections).
 * - Headings can decrease to any higher-level parent (e.g., H3 -> H2).
 * - Clamps and rejects levels exceeding H6 or falling below H1.
 */
export function checkHeadingOrder(
  region: RegionMapping,
  currentLevel = 1,
): boolean {
  if (!region) return true;

  const { headings, children } = region;

  let nextLevel = currentLevel;

  if (headings && headings.length > 0) {
    const rawHeading = headings[0];
    // Match exact heading patterns like 'h1', 'H2', etc., to avoid parsing embedded numbers
    const match = rawHeading.match(/^h([1-6])$/i);

    if (match) {
      nextLevel = Number(match[1]);
    } else {
      // Fallback: extract the first sequence of digits anywhere in the string
      const fallbackDigits = rawHeading.match(/\d+/);
      if (fallbackDigits) {
        nextLevel = Number(fallbackDigits[0]);
      }
    }
  }

  // Enforce absolute HTML bounds (H1-H6)
  if (nextLevel < 1 || nextLevel > 6) {
    return false;
  }

  // Validation rules:
  // 1. Cannot skip levels going down (nextLevel - currentLevel > 1)
  // 2. Can go down by 1, stay same (0), or jump back up to any higher level (negative diff)
  const diff = nextLevel - currentLevel;
  if (diff > 1) {
    return false;
  }

  // Recursively validate all children using the current region's resolved level as context
  return children.every((child) => checkHeadingOrder(child, nextLevel));
}
