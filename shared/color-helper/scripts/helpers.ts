import type { ParsedColor } from "../types";

export function removeNameDetails(name: string): string {
  const endIndex = name.indexOf("(");
  return name.substring(0, endIndex === -1 ? name.length : endIndex);
}

export function parseColors(input: string): ParsedColor[] {
  if (!input.trim()) return [];

  return input
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      // Remove *, -, and clean hsl() format
      const cleaned = line
        .replaceAll(/[-*]/g, "")
        .replaceAll(/hsl\(|\)/g, "")
        .replaceAll(/,\s/g, " ");
      const parts = cleaned.split(":");
      if (parts.length < 2) return null;

      const name = removeNameDetails(parts[0])
        .trim()
        .replaceAll(" ", "-")
        .toLowerCase();
      const value = parts.slice(1).join(":").trim();

      return name && value ? { name, value } : null;
    })
    .filter((color): color is ParsedColor => color !== null);
}

export function generateSassOutput(colors: ParsedColor[]): string {
  return colors.map(({ name, value }) => `  ${name}: ${value}`).join("\n");
}

export function generateTailwindOutput(colors: ParsedColor[]): string {
  const colorEntries = colors
    .map(({ name, value }) => `  --color-${name}: hsl(${value});`)
    .join("\n");

  return `@theme {\n${colorEntries}\n}`;
}
