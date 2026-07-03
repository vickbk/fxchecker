import {
  generateSassOutput,
  generateTailwindOutput,
  parseColors,
  removeNameDetails,
} from "./helpers";

describe("removeNameDetails", () => {
  it("should return full string when no parentheses", () => {
    expect(removeNameDetails("Neutral 900")).toBe("Neutral 900");
  });

  it("should remove text after opening parenthesis", () => {
    expect(removeNameDetails("Neutral 900 (some detail)")).toBe("Neutral 900 ");
  });

  it("should handle string with multiple parentheses", () => {
    expect(removeNameDetails("Color (primary) (extra)")).toBe("Color ");
  });

  it("should return empty string for only parentheses", () => {
    expect(removeNameDetails("()")).toBe("");
  });

  it("should handle parenthesis at start", () => {
    expect(removeNameDetails("(something)")).toBe("");
  });
});

describe("parseColors", () => {
  it("should return empty array for empty input", () => {
    expect(parseColors("")).toEqual([]);
  });

  it("should return empty array for whitespace only", () => {
    expect(parseColors("   \n\t\n   ")).toEqual([]);
  });

  it("should parse single color correctly", () => {
    const result = parseColors("Neutral 900: hsl(0, 0%, 7%)");
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ name: "neutral-900", value: "0 0% 7%" });
  });

  it("should parse multiple colors correctly", () => {
    const input = `Neutral 900: hsl(0, 0%, 7%)
Neutral 800: hsl(0, 0%, 15%)
Blue 600: hsl(214, 100%, 55%)`;
    const result = parseColors(input);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ name: "neutral-900", value: "0 0% 7%" });
    expect(result[1]).toEqual({ name: "neutral-800", value: "0 0% 15%" });
    expect(result[2]).toEqual({ name: "blue-600", value: "214 100% 55%" });
  });

  it("should remove asterisk prefix", () => {
    const result = parseColors("*Neutral 900: hsl(0, 0%, 7%)");
    expect(result[0].name).toBe("neutral-900");
  });

  it("should remove hyphen from color names", () => {
    const result = parseColors("-Neutral-900: hsl(0, 0%, 7%)");
    expect(result[0].name).toBe("neutral900");
  });

  it("should convert spaces to hyphens", () => {
    const result = parseColors("Light Blue: hsl(210, 100%, 65%)");
    expect(result[0].name).toBe("light-blue");
  });

  it("should convert to lowercase", () => {
    const result = parseColors("NEUTRAL 900: hsl(0, 0%, 7%)");
    expect(result[0].name).toBe("neutral-900");
  });

  it("should remove parenthetical details", () => {
    const result = parseColors("Neutral 900 (primary): hsl(0, 0%, 7%)");
    expect(result[0].name).toBe("neutral-900");
  });

  it("should filter out empty lines", () => {
    const input = `Neutral 900: hsl(0, 0%, 7%)

Neutral 800: hsl(0, 0%, 15%)`;
    const result = parseColors(input);
    expect(result).toHaveLength(2);
  });

  it("should return empty array for invalid format without colon", () => {
    expect(parseColors("not a valid color")).toEqual([]);
  });

  it("should handle colors with complex hsl values", () => {
    const result = parseColors("Yellow 400: hsl(49, 85%, 70%)");
    expect(result[0]).toEqual({ name: "yellow-400", value: "49 85% 70%" });
  });

  it("should handle multiple colors with various formats", () => {
    const input = `Red 500: hsl(354, 63%, 57%)
Green 500: hsl(140, 63%, 57%)
Yellow 400: hsl(49, 85%, 70%)`;
    const result = parseColors(input);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ name: "red-500", value: "354 63% 57%" });
    expect(result[1]).toEqual({ name: "green-500", value: "140 63% 57%" });
    expect(result[2]).toEqual({ name: "yellow-400", value: "49 85% 70%" });
  });

  it("should handle color value with multiple colons", () => {
    const result = parseColors("Test: value:with:colons");
    expect(result[0]).toEqual({ name: "test", value: "value:with:colons" });
  });

  it("should skip colors with empty name", () => {
    const result = parseColors(": hsl(0, 0%, 7%)");
    expect(result).toHaveLength(0);
  });

  it("should skip colors with empty value", () => {
    const result = parseColors("Neutral 900:");
    expect(result).toHaveLength(0);
  });
});

describe("generateSassOutput", () => {
  it("should return empty string for empty array", () => {
    expect(generateSassOutput([])).toBe("");
  });

  it("should generate single color SASS variable", () => {
    const result = generateSassOutput([
      { name: "neutral-900", value: "0 0% 7%" },
    ]);
    expect(result).toBe("  neutral-900: 0 0% 7%");
  });

  it("should generate multiple SASS variables", () => {
    const result = generateSassOutput([
      { name: "neutral-900", value: "0 0% 7%" },
      { name: "neutral-800", value: "0 0% 15%" },
      { name: "blue-600", value: "214 100% 55%" },
    ]);
    expect(result).toBe(`  neutral-900: 0 0% 7%
  neutral-800: 0 0% 15%
  blue-600: 214 100% 55%`);
  });

  it("should handle colors with complex values", () => {
    const result = generateSassOutput([
      { name: "yellow-400", value: "49 85% 70%" },
    ]);
    expect(result).toBe("  yellow-400: 49 85% 70%");
  });
});

describe("generateTailwindOutput", () => {
  it("should return empty theme for empty array", () => {
    const result = generateTailwindOutput([]);
    expect(result).toBe("@theme {\n\n}");
  });

  it("should generate single color Tailwind variable", () => {
    const result = generateTailwindOutput([
      { name: "neutral-900", value: "0 0% 7%" },
    ]);
    expect(result).toBe(`@theme {
  --color-neutral-900: 0 0% 7%;
}`);
  });

  it("should generate multiple Tailwind color variables", () => {
    const result = generateTailwindOutput([
      { name: "neutral-900", value: "0 0% 7%" },
      { name: "neutral-800", value: "0 0% 15%" },
      { name: "blue-600", value: "214 100% 55%" },
    ]);
    expect(result).toBe(`@theme {
  --color-neutral-900: 0 0% 7%;
  --color-neutral-800: 0 0% 15%;
  --color-blue-600: 214 100% 55%;
}`);
  });

  it("should prefix color names with --color-", () => {
    const result = generateTailwindOutput([
      { name: "yellow-400", value: "49 85% 70%" },
    ]);
    expect(result).toBe(`@theme {
  --color-yellow-400: 49 85% 70%;
}`);
  });

  it("should handle colors with hyphens in names", () => {
    const result = generateTailwindOutput([
      { name: "light-blue", value: "210 100% 65%" },
    ]);
    expect(result).toContain("--color-light-blue:");
  });
});
