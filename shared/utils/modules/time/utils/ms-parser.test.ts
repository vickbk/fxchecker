import { describe, expect, it } from "vitest";

import type { DurationString } from "../types";
import { parseTimeToMs } from "./ms-parser";

describe("parseTimeToMs", () => {
  describe("happy paths", () => {
    it("converts standard integer values for all supported units", () => {
      const cases: Array<[DurationString, number]> = [
        ["1s", 1000],
        ["2m", 120000],
        ["3h", 10800000],
        ["4d", 345600000],
        ["5D", 432000000],
        ["6w", 3628800000],
        ["7W", 4233600000],
        ["8M", 20736000000],
        ["9y", 283824000000],
        ["10Y", 315360000000],
      ];

      cases.forEach(([value, expected]) => {
        expect(parseTimeToMs(value)).toBe(expected);
      });
    });

    it("supports floating-point values", () => {
      expect(parseTimeToMs("1.5h")).toBe(5400000);
      expect(parseTimeToMs("0.5d")).toBe(43200000);
      expect(parseTimeToMs("2.5m")).toBe(150000);
    });
  });

  describe("runtime error boundaries", () => {
    it("throws for empty strings", () => {
      expect(() => parseTimeToMs("" as unknown as DurationString)).toThrow(
        "parseTimeToMs: Duration string cannot be empty.",
      );
    });

    it("throws for unit symbols without a scalar value", () => {
      expect(() => parseTimeToMs("s" as unknown as DurationString)).toThrow(
        'parseTimeToMs: Invalid runtime input "s". Must match pattern like "30D" or "1.5h".',
      );
      expect(() => parseTimeToMs("M" as unknown as DurationString)).toThrow(
        'parseTimeToMs: Invalid runtime input "M". Must match pattern like "30D" or "1.5h".',
      );
    });

    it("throws for malformed unit characters", () => {
      expect(() => parseTimeToMs("10x" as unknown as DurationString)).toThrow(
        'parseTimeToMs: Invalid runtime input "10x". Must match pattern like "30D" or "1.5h".',
      );
      expect(() => parseTimeToMs("5days" as unknown as DurationString)).toThrow(
        'parseTimeToMs: Invalid runtime input "5days". Must match pattern like "30D" or "1.5h".',
      );
    });

    it("throws for non-numeric scalars", () => {
      expect(() => parseTimeToMs("abcD" as unknown as DurationString)).toThrow(
        'parseTimeToMs: Invalid runtime input "abcD". Must match pattern like "30D" or "1.5h".',
      );
      expect(() => parseTimeToMs("--5m" as unknown as DurationString)).toThrow(
        'parseTimeToMs: Invalid runtime input "--5m". Must match pattern like "30D" or "1.5h".',
      );
    });

    it("throws when only a number is provided", () => {
      expect(() => parseTimeToMs("10" as unknown as DurationString)).toThrow(
        'parseTimeToMs: Invalid runtime input "10". Must match pattern like "30D" or "1.5h".',
      );
    });
  });
});
