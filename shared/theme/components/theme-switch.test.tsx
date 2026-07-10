import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "../hooks";
import { ThemeSwitch } from "./theme-switch";

const SWITCH_TO_DARK = /switch to dark theme/i;
const SWITCH_TO_LIGHT = /switch to light theme/i;

// Mock the useTheme hook
vi.mock("../hooks", () => ({
  useTheme: vi.fn(() => ({
    toggleTheme: vi.fn(),
    isDark: false,
  })),
}));

describe("ThemeSwitch Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.removeAttribute("theme");
  });

  it("should render theme switch button", () => {
    render(<ThemeSwitch />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should display correct icon for light theme", () => {
    render(<ThemeSwitch />);
    const icon = screen.getByRole("button").querySelector("i");
    expect(icon).toHaveClass("bi-moon-fill");
  });

  it("should display sr-only text for accessibility", () => {
    render(<ThemeSwitch />);
    const srText = screen.getByText(SWITCH_TO_DARK);
    expect(srText).toHaveClass("sr-only");
  });

  it("should render button with click handler", async () => {
    const mockToggleTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      toggleTheme: mockToggleTheme,
      isDark: false,
      isLight: true,
      theme: "light",
      changeTheme: vi.fn(),
    });

    render(<ThemeSwitch />);
    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it("should update aria label when theme changes", async () => {
    const { rerender } = render(<ThemeSwitch />);

    expect(screen.getByText(SWITCH_TO_DARK)).toBeInTheDocument();

    vi.mocked(useTheme).mockReturnValue({
      toggleTheme: vi.fn(),
      isDark: true,
      isLight: false,
      theme: "dark",
      changeTheme: vi.fn(),
    });

    rerender(<ThemeSwitch />);
    await expect(screen.getByText(SWITCH_TO_LIGHT)).toBeInTheDocument();
  });
});

describe("ThemeSwitch with Dark Mode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show sun icon for dark theme", async () => {
    vi.mocked(useTheme).mockReturnValue({
      toggleTheme: vi.fn(),
      isDark: true,
      isLight: false,
      theme: "dark",
      changeTheme: vi.fn(),
    });

    render(<ThemeSwitch />);

    const icon = screen.getByRole("button").querySelector("i");
    expect(icon).toHaveClass("bi-sun-fill");
  });
});
