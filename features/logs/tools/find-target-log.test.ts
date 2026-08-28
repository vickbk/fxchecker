import { describe, expect, it } from "vitest";
import { findTargetLogId } from "./find-target-log";

describe("findTargetLogId", () => {
  const sampleLogs = [
    { id: "log-newest-1" },
    { id: "log-middle-2" },
    { id: "log-oldest-3" },
  ];

  describe("Single log array handling", () => {
    it("returns the log ID when only one log exists, regardless of position", () => {
      const singleLog = [{ id: "log-solo" }];

      expect(findTargetLogId(singleLog, undefined)).toBe("log-solo");
      expect(findTargetLogId(singleLog, "latest")).toBe("log-solo");
      expect(findTargetLogId(singleLog, "oldest")).toBe("log-solo");
      expect(findTargetLogId(singleLog, 0)).toBe("log-solo");
    });
  });

  describe("Position aliases ('latest', 'last', 'oldest', 'first')", () => {
    it.each([
      {
        position: "latest" as const,
        expectedId: "log-newest-1",
        desc: "'latest'",
      },
      { position: "last" as const, expectedId: "log-newest-1", desc: "'last'" },
    ])(
      "returns the head item (index 0) for position $desc",
      ({ position, expectedId }) => {
        expect(findTargetLogId(sampleLogs, position)).toBe(expectedId);
      },
    );

    it.each([
      {
        position: "oldest" as const,
        expectedId: "log-oldest-3",
        desc: "'oldest'",
      },
      {
        position: "first" as const,
        expectedId: "log-oldest-3",
        desc: "'first'",
      },
    ])(
      "returns the tail item (last index) for position $desc",
      ({ position, expectedId }) => {
        expect(findTargetLogId(sampleLogs, position)).toBe(expectedId);
      },
    );
  });

  describe("Numeric index positioning", () => {
    it.each([
      { index: 0, expectedId: "log-newest-1", desc: "first item (0)" },
      { index: 1, expectedId: "log-middle-2", desc: "middle item (1)" },
      { index: 2, expectedId: "log-oldest-3", desc: "last item (2)" },
    ])("resolves target log at valid index: $desc", ({ index, expectedId }) => {
      expect(findTargetLogId(sampleLogs, index)).toBe(expectedId);
    });

    it.each([
      { index: -1, desc: "negative index" },
      { index: 3, desc: "index equal to length" },
      { index: 99, desc: "index far out of bounds" },
    ])(
      "throws out-of-bounds error for invalid index: $desc ($index)",
      ({ index }) => {
        expect(() => findTargetLogId(sampleLogs, index)).toThrowError(
          `Invalid position index ${index}. Range is 0 to ${sampleLogs.length - 1}.`,
        );
      },
    );
  });

  describe("Missing or undefined position handling", () => {
    it("throws error when position is undefined and multiple logs exist", () => {
      expect(() => findTargetLogId(sampleLogs, undefined)).toThrowError(
        "Unable to identify target log to delete.",
      );
    });
  });

  describe("Empty logs array and corrupt data edge cases", () => {
    it("throws error when logs array is empty and position is string/undefined", () => {
      expect(() => findTargetLogId([], "latest")).toThrowError(
        "Unable to identify target log to delete.",
      );
      expect(() => findTargetLogId([], undefined)).toThrowError(
        "Unable to identify target log to delete.",
      );
    });

    it("throws out-of-bounds error when logs array is empty and numeric index is passed", () => {
      expect(() => findTargetLogId([], 0)).toThrowError(
        "Invalid position index 0. Range is 0 to -1.",
      );
    });

    it("throws error if target log object has an empty or missing id", () => {
      const corruptLogs = [{ id: "" }, { id: "valid-id" }];

      // Target index 0 exists but has an empty id string
      expect(() => findTargetLogId(corruptLogs, "latest")).toThrowError(
        "Unable to identify target log to delete.",
      );
    });
  });
});
