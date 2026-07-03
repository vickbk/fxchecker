import { act, renderHook, waitFor } from "@testing-library/react";
import { useColorsHelper } from "./use-colors-helper";

describe("useColorsHelper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have empty colors initially", () => {
      const { result } = renderHook(() => useColorsHelper());
      expect(result.current.colors).toBe("");
    });

    it("should have empty parsedColors initially", () => {
      const { result } = renderHook(() => useColorsHelper());
      expect(result.current.parsedColors).toEqual([]);
    });

    it("should have null copiedFormat initially", () => {
      const { result } = renderHook(() => useColorsHelper());
      expect(result.current.copiedFormat).toBeNull();
    });

    it("should have empty string outputs initially", () => {
      const { result } = renderHook(() => useColorsHelper());
      expect(result.current.sassOutput).toBe("");
      // Tailwind output returns empty theme for empty colors array
      expect(result.current.tailwindOutput).toBe("@theme {\n\n}");
    });
  });

  describe("setColors", () => {
    it("should update colors state", () => {
      const { result } = renderHook(() => useColorsHelper());

      act(() => {
        result.current.setColors("Neutral 900: hsl(0, 0%, 7%)");
      });

      expect(result.current.colors).toBe("Neutral 900: hsl(0, 0%, 7%)");
    });

    it("should parse colors when input changes", async () => {
      const { result } = renderHook(() => useColorsHelper());

      act(() => {
        result.current.setColors("Neutral 900: hsl(0, 0%, 7%)");
      });

      await waitFor(() => {
        expect(result.current.parsedColors).toHaveLength(1);
        expect(result.current.parsedColors[0]).toEqual({
          name: "neutral-900",
          value: "0 0% 7%",
        });
      });
    });

    it("should parse multiple colors", async () => {
      const { result } = renderHook(() => useColorsHelper());

      act(() => {
        result.current.setColors(`Neutral 900: hsl(0, 0%, 7%)
Neutral 800: hsl(0, 0%, 15%)
Blue 600: hsl(214, 100%, 55%)`);
      });

      await waitFor(() => {
        expect(result.current.parsedColors).toHaveLength(3);
      });
    });

    it("should update sassOutput when colors change", async () => {
      const { result } = renderHook(() => useColorsHelper());

      act(() => {
        result.current.setColors("Neutral 900: hsl(0, 0%, 7%)");
      });

      await waitFor(() => {
        expect(result.current.sassOutput).toBe("  neutral-900: 0 0% 7%");
      });
    });

    it("should update tailwindOutput when colors change", async () => {
      const { result } = renderHook(() => useColorsHelper());

      act(() => {
        result.current.setColors("Neutral 900: hsl(0, 0%, 7%)");
      });

      await waitFor(() => {
        expect(result.current.tailwindOutput).toBe(`@theme {
  --color-neutral-900: 0 0% 7%;
}`);
      });
    });

    it("should handle empty input", () => {
      const { result } = renderHook(() => useColorsHelper());

      act(() => {
        result.current.setColors("");
      });

      expect(result.current.parsedColors).toEqual([]);
      expect(result.current.sassOutput).toBe("");
      expect(result.current.tailwindOutput).toBe("@theme {\n\n}");
    });
  });

  describe("handleCopy", () => {
    beforeEach(() => {
      vi.stubGlobal("navigator", {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("should copy text to clipboard", async () => {
      const { result } = renderHook(() => useColorsHelper());

      await act(async () => {
        await result.current.handleCopy("test text", "sass");
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test text");
    });

    it("should set copiedFormat after successful copy", async () => {
      const { result } = renderHook(() => useColorsHelper());

      await act(async () => {
        await result.current.handleCopy("test text", "sass");
      });

      expect(result.current.copiedFormat).toBe("sass");
    });

    it("should clear copiedFormat after timeout", async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useColorsHelper());

      await act(async () => {
        await result.current.handleCopy("test text", "sass");
      });

      expect(result.current.copiedFormat).toBe("sass");

      await act(async () => {
        await vi.advanceTimersByTimeAsync(2000);
      });

      expect(result.current.copiedFormat).toBeNull();
      vi.useRealTimers();
    });

    it("should handle copy failure gracefully", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      vi.stubGlobal("navigator", {
        clipboard: {
          writeText: vi.fn().mockRejectedValue(new Error("Clipboard error")),
        },
      });

      const { result } = renderHook(() => useColorsHelper());

      await act(async () => {
        await result.current.handleCopy("test text", "sass");
      });

      expect(consoleSpy).toHaveBeenCalled();
      expect(result.current.copiedFormat).toBeNull();
      consoleSpy.mockRestore();
    });

    it("should accept different format names", async () => {
      const { result } = renderHook(() => useColorsHelper());

      await act(async () => {
        await result.current.handleCopy("tailwind output", "tailwind");
      });

      expect(result.current.copiedFormat).toBe("tailwind");
    });
  });

  describe("memoization", () => {
    it("should not re-parse colors when setColors is called with same value", async () => {
      const { result, rerender } = renderHook(() => useColorsHelper());

      act(() => {
        result.current.setColors("Neutral 900: hsl(0, 0%, 7%)");
      });

      await waitFor(() => {
        expect(result.current.parsedColors).toHaveLength(1);
      });

      const firstParseResult = result.current.parsedColors;

      rerender();

      expect(result.current.parsedColors).toBe(firstParseResult);
    });
  });
});
