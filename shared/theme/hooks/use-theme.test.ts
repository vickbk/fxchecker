import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "./use-theme";

// Mock the theme scripts
vi.mock("../scripts", () => ({
  applyTheme: vi.fn(),
  getSavedTheme: vi.fn(() => "light"),
  saveTheme: vi.fn(),
}));

// Mock memorization
vi.mock("@/shared", async () => {
  const actual = await vi.importActual("@/shared");
  return {
    ...actual,
    setMemoItem: vi.fn(),
    getMemoItem: vi.fn(),
  };
});

describe("use Theme", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.documentElement.removeAttribute("theme");
  });

  it("should initialize with light theme", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
    expect(result.current.isLight).toBe(true);
    expect(result.current.isDark).toBe(false);
  });

  it("should change theme", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.changeTheme("dark");
    });

    expect(result.current.theme).toBe("dark");
    expect(result.current.isDark).toBe(true);
    expect(result.current.isLight).toBe(false);
  });

  it("should toggle theme from light to dark", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
  });

  it("should toggle theme from dark to light", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.changeTheme("dark");
    });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
  });

  it("should have correct flags for each theme", async () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.isLight).toBe(true);
    expect(result.current.isDark).toBe(false);

    act(() => {
      result.current.changeTheme("dark");
    });

    expect(result.current.isLight).toBe(false);
    expect(result.current.isDark).toBe(true);
  });
});
