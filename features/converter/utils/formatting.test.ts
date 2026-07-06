import { describe, expect, it } from "vitest";
import {
  DEFAULT_AMOUNT,
  DEFAULT_FROM,
  DEFAULT_TO,
  normalizeAmount,
  normalizeCurrency,
} from "./formatting";

describe("normalizeCurrency", () => {
  it("trims and uppercases currency values", () => {
    expect(normalizeCurrency("  usd  ", DEFAULT_FROM)).toBe("USD");
    expect(normalizeCurrency("eur", DEFAULT_TO)).toBe("EUR");
  });

  it("falls back to the provided default when the value is empty", () => {
    expect(normalizeCurrency("", DEFAULT_FROM)).toBe(DEFAULT_FROM);
    expect(normalizeCurrency("   ", DEFAULT_TO)).toBe(DEFAULT_TO);
    expect(normalizeCurrency(null, DEFAULT_FROM)).toBe(DEFAULT_FROM);
    expect(normalizeCurrency(undefined, DEFAULT_TO)).toBe(DEFAULT_TO);
  });
});

describe("normalizeAmount", () => {
  it("returns the default amount for invalid or non-positive values", () => {
    expect(normalizeAmount("not-a-number")).toBe(DEFAULT_AMOUNT);
    expect(normalizeAmount("-10")).toBe(DEFAULT_AMOUNT);
    expect(normalizeAmount("0")).toBe(DEFAULT_AMOUNT);
    expect(normalizeAmount(null)).toBe(DEFAULT_AMOUNT);
    expect(normalizeAmount(undefined)).toBe(DEFAULT_AMOUNT);
  });

  it("preserves valid positive floats", () => {
    expect(normalizeAmount("12.5")).toBe(12.5);
    expect(normalizeAmount("0.01")).toBe(0.01);
  });
});
