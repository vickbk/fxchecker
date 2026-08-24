import { useURLState } from "@/shared/url/hooks";
import { shouldSee, userClicks } from "@/tests";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Swapper } from "./Swapper";

vi.mock("@/shared/url/hooks", () => ({
  useURLState: vi.fn(),
}));

describe("Swapper Component", () => {
  const mockSwapCurrencies = vi.fn();
  const mockUseURLState = vi.mocked(useURLState);

  const defaultHookState = {
    from: "USD",
    to: "EUR",
    amount: 100,
    setFrom: vi.fn(),
    setTo: vi.fn(),
    setAmount: vi.fn(),
    swapCurrencies: mockSwapCurrencies,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseURLState.mockReturnValue(defaultHookState);
  });

  describe("Markup & Styling", () => {
    it("renders an HTML button with explicit type='button'", () => {
      render(<Swapper />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("type", "button");
    });

    it("applies mandatory CSS classes for layout, responsiveness, and hover scaling", () => {
      render(<Swapper />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "bg-card",
        "self-center",
        "p-4",
        "rounded-lg",
        "font-medium",
        "hover:scale-105",
        "action-btn",
        "sm:rotate-90",
      );
    });

    it("renders the arrow-down-up icon inside the button", () => {
      const { container } = render(<Swapper />);

      const icon = container.querySelector(".bi-arrow-down-up");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass("bi", "bi-arrow-down-up");
    });
  });

  describe("Accessibility & Screen Reader Content", () => {
    it("renders accessible label with active 'from' and 'to' currency codes", () => {
      render(<Swapper />);

      shouldSee("Swap send (USD) and receive (EUR) currencies");
    });

    it("dynamically reflects updated currency pairs in the accessible label", () => {
      mockUseURLState.mockReturnValue({
        ...defaultHookState,
        from: "GBP",
        to: "JPY",
      });

      render(<Swapper />);

      shouldSee("Swap send (GBP) and receive (JPY) currencies");
    });

    it("handles identical from and to currencies correctly without breaking", () => {
      mockUseURLState.mockReturnValue({
        ...defaultHookState,
        from: "USD",
        to: "USD",
      });

      render(<Swapper />);

      shouldSee("Swap send (USD) and receive (USD) currencies");
    });
  });

  describe("User Interactions", () => {
    it("calls swapCurrencies when clicked with a mouse", async () => {
      render(<Swapper />);

      await userClicks("Swap send");

      expect(mockSwapCurrencies).toHaveBeenCalledTimes(1);
    });

    it("calls swapCurrencies on keyboard activation (Enter and Space)", async () => {
      const user = userEvent.setup();
      render(<Swapper />);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(mockSwapCurrencies).toHaveBeenCalledTimes(1);

      await user.keyboard(" ");
      expect(mockSwapCurrencies).toHaveBeenCalledTimes(2);
    });

    it("handles rapid consecutive clicks correctly", async () => {
      const user = userEvent.setup();
      render(<Swapper />);

      const button = screen.getByRole("button");
      await user.dblClick(button);

      expect(mockSwapCurrencies).toHaveBeenCalledTimes(2);
    });
  });
});
