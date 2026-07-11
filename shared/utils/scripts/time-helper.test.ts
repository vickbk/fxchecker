import { formatDateTime, formatTime } from "./time-helper";

describe("Time Helper", () => {
  describe("format Time", () => {
    it("should format seconds correctly", () => {
      expect(formatTime(0)).toBe("0:00");
      expect(formatTime(30)).toBe("0:30");
      expect(formatTime(60)).toBe("1:00");
    });

    it("should pad seconds with leading zero", () => {
      expect(formatTime(5)).toBe("0:05");
      expect(formatTime(65)).toBe("1:05");
    });

    it("should handle large times", () => {
      expect(formatTime(3661)).toBe("61:01");
      expect(formatTime(7200)).toBe("120:00");
    });

    it("should handle fractional seconds", () => {
      expect(formatTime(65.7)).toBe("1:05");
      expect(formatTime(125.3)).toBe("2:05");
    });

    it("should handle edge cases", () => {
      expect(formatTime(59)).toBe("0:59");
      expect(formatTime(119)).toBe("1:59");
    });
  });

  describe("format Date Time", () => {
    const testTime = new Date("2024-01-15T14:30:00").getTime();

    it("should format date with default options", () => {
      const result = formatDateTime({ time: testTime });
      expect(result).toContain("January");
      expect(result).toContain("15");
      expect(result).toContain("2024");
    });

    it("should format date with custom options", () => {
      const result = formatDateTime({
        time: testTime,
        options: { year: "2-digit", month: "2-digit", day: "2-digit" },
      });
      expect(result).toMatch(/24.*01.*15|01.*15.*24|15.*01.*24/);
    });

    it("should include weekday when specified", () => {
      const result = formatDateTime({
        time: testTime,
        options: { weekday: "long" },
      });
      expect(result).toMatch(
        /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/,
      );
    });

    it("should include time when specified", () => {
      const result = formatDateTime({
        time: testTime,
        options: { hour: "numeric", minute: "numeric" },
      });
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it("should handle current time", () => {
      const now = Date.now();
      const result = formatDateTime({ time: now });
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
