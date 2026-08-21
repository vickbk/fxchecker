import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scrollIntoView } from "./scroll-into-view";

describe("scrollIntoView", () => {
  let mockScrollIntoView: ReturnType<typeof vi.fn>;
  let mockMatchMedia: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockScrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView as unknown as (
      arg?: boolean | ScrollIntoViewOptions | undefined,
    ) => void;

    mockMatchMedia = vi.fn().mockReturnValue({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    });

    window.matchMedia = mockMatchMedia as unknown as ((
      query: string,
    ) => MediaQueryList) &
      ((query: string) => MediaQueryList);

    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("target resolution", () => {
    it("scrolls direct HTMLElement target", () => {
      const element = document.createElement("div");
      document.body.appendChild(element);

      scrollIntoView(element);

      expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    });

    it("scrolls element passed inside a React Ref object", () => {
      const element = document.createElement("div");
      document.body.appendChild(element);
      const ref = { current: element };

      scrollIntoView(ref);

      expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    });

    it("resolves and scrolls element using a CSS selector string", () => {
      const element = document.createElement("div");
      element.id = "target-section";
      document.body.appendChild(element);

      scrollIntoView("#target-section");

      expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
    });

    it("handles CSS selector that matches no element silently without throwing", () => {
      expect(() => scrollIntoView("#missing-element")).not.toThrow();
      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });

    it("handles React Ref with null current value gracefully", () => {
      const ref = { current: null };
      expect(() => scrollIntoView(ref)).not.toThrow();
      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });

    it("handles null, undefined, or empty string target without throwing", () => {
      expect(() => scrollIntoView(null)).not.toThrow();
      expect(() => scrollIntoView(undefined)).not.toThrow();
      expect(() => scrollIntoView("")).not.toThrow();
      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });
  });

  describe("accessibility & prefers-reduced-motion", () => {
    it("uses 'smooth' behavior when prefers-reduced-motion is false", () => {
      const element = document.createElement("div");
      scrollIntoView(element);

      expect(mockScrollIntoView).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: "smooth" }),
      );
    });

    it("switches behavior to 'auto' when user enables prefers-reduced-motion", () => {
      mockMatchMedia.mockReturnValue({ matches: true });

      const element = document.createElement("div");
      scrollIntoView(element);

      expect(mockScrollIntoView).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: "auto" }),
      );
    });
  });

  describe("options merging", () => {
    it("merges custom scroll options while keeping non-overridden defaults", () => {
      const element = document.createElement("div");
      scrollIntoView(element, { block: "start", inline: "center" });

      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "start",
        inline: "center",
      });
    });

    it("allows caller to explicitly override default behavior", () => {
      const element = document.createElement("div");
      scrollIntoView(element, { behavior: "instant" as ScrollBehavior });

      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: "instant",
        block: "center",
        inline: "nearest",
      });
    });
  });

  describe("useAnimationFrame", () => {
    it("defers scroll until next animation frame when useAnimationFrame is true", () => {
      const element = document.createElement("div");
      let rafCallback: FrameRequestCallback | null = null;

      vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
        rafCallback = cb;
        return 1;
      });

      scrollIntoView(element, { useAnimationFrame: true });

      expect(mockScrollIntoView).not.toHaveBeenCalled();

      if (rafCallback) {
        (rafCallback as FrameRequestCallback)(0);
      }

      expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
    });
  });

  describe("SSR environment", () => {
    it("exits silently without throwing when window is undefined", () => {
      const originalWindow = globalThis.window;

      try {
        Object.defineProperty(globalThis, "window", {
          value: undefined,
          configurable: true,
          writable: true,
        });

        expect(() => scrollIntoView("div")).not.toThrow();
      } finally {
        Object.defineProperty(globalThis, "window", {
          value: originalWindow,
          configurable: true,
          writable: true,
        });
      }
    });
  });
});
