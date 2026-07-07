import { act, renderHook } from "@testing-library/react";
import { useScreenSize } from "./handle-screen-size";

describe("use Screen Size", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with current window size", () => {
    const { result } = renderHook(() => useScreenSize());
    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });

  it("should update size on window resize", () => {
    const { result } = renderHook(() => useScreenSize());

    act(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1920,
      });
      Object.defineProperty(window, "innerHeight", {
        writable: true,
        configurable: true,
        value: 1080,
      });
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.width).toBe(1920);
    expect(result.current.height).toBe(1080);
  });

  it("should handle multiple resize events", () => {
    const { result } = renderHook(() => useScreenSize());

    act(() => {
      Object.defineProperty(window, "innerWidth", {
        value: 800,
        writable: true,
      });
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current.width).toBe(800);

    act(() => {
      Object.defineProperty(window, "innerWidth", {
        value: 600,
        writable: true,
      });
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current.width).toBe(600);
  });

  it("should clean up resize listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScreenSize());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
    removeEventListenerSpy.mockRestore();
  });
});
