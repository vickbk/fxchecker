import { shouldNotSee, shouldSee } from "@/tests";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRate } from "../hooks/useRate";
import { ConvertDisplay } from "./ConvertDisplay";

vi.mock("../hooks/useRate", () => ({
  useRate: vi.fn(),
}));

describe("ConvertDisplay Component", () => {
  const placeholderSelector = ".px-16.bg-btn.mr-2";
  const defaultHookState = {
    amount: 100,
    rate: 0.92,
    loading: false,
    from: "USD",
    to: "EUR",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRate).mockReturnValue(defaultHookState);
  });

  describe("Rendering & Accessibility", () => {
    it("renders definition list element containing dt and dd tags", () => {
      const { container } = render(<ConvertDisplay />);

      const dl = container.querySelector("dl");
      const dt = container.querySelector("dt");
      const dd = container.querySelector("dd");

      expect(dl).toBeInTheDocument();
      expect(dt).toBeInTheDocument();
      expect(dd).toBeInTheDocument();
    });
  });

  describe("Calculations & Display Formatting", () => {
    it("renders amount * rate formatted to 2 decimal places in dt", () => {
      render(<ConvertDisplay />);

      shouldSee("92.00");
    });

    it("rounds floating point multiplication using toFixed(2)", () => {
      vi.mocked(useRate).mockReturnValue({
        ...defaultHookState,
        amount: 10.5,
        rate: 0.9234,
      });

      render(<ConvertDisplay />);

      // 10.5 * 0.9234 = 9.6957 -> rounds to "9.70"
      shouldSee("9.70");
    });

    it("renders full unrounded multiplication in screen reader dd element", () => {
      vi.mocked(useRate).mockReturnValue({
        ...defaultHookState,
        amount: 10.5,
        rate: 0.9234,
        from: "USD",
        to: "EUR",
      });

      render(<ConvertDisplay />);

      // 10.5 * 0.9234 = 9.6957
      shouldSee("10.5 in USD is equivalent to 9.6957 in EUR");
    });
  });

  describe("Loading State", () => {
    it("renders LoadingPlaceholder inside dt when loading is true", () => {
      vi.mocked(useRate).mockReturnValue({
        ...defaultHookState,
        loading: true,
      });

      const { container } = render(<ConvertDisplay />);

      const placeholder = container.querySelector(placeholderSelector);
      expect(placeholder).toBeInTheDocument();
      expect(placeholder).toHaveClass("inline", "px-16", "bg-btn", "mr-2");

      shouldNotSee("92.00");
    });

    it("renders 'loading rate' inside screen reader dd element when loading is true", () => {
      vi.mocked(useRate).mockReturnValue({
        ...defaultHookState,
        loading: true,
      });

      render(<ConvertDisplay />);

      shouldSee("loading rate");
      shouldNotSee("is equivalent to");
    });
  });

  describe("Edge Cases & Numeric Boundaries", () => {
    it("handles zero amount (amount = 0)", () => {
      vi.mocked(useRate).mockReturnValue({
        ...defaultHookState,
        amount: 0,
        rate: 0.92,
      });

      render(<ConvertDisplay />);

      shouldSee("0.00", "0 in USD is equivalent to 0 in EUR");
    });

    it("handles zero exchange rate (rate = 0)", () => {
      vi.mocked(useRate).mockReturnValue({
        ...defaultHookState,
        amount: 100,
        rate: 0,
      });

      render(<ConvertDisplay />);

      shouldSee("0.00", "100 in USD is equivalent to 0 in EUR");
    });

    it("handles large values without throwing range errors", () => {
      vi.mocked(useRate).mockReturnValue({
        ...defaultHookState,
        amount: 1000000,
        rate: 155.42,
        from: "USD",
        to: "JPY",
      });

      render(<ConvertDisplay />);

      shouldSee(
        "155420000.00",
        "1000000 in USD is equivalent to 155420000 in JPY",
      );
    });

    it("updates displayed values dynamically when hook state re-renders", () => {
      const { rerender } = render(<ConvertDisplay />);

      shouldSee("92.00");

      vi.mocked(useRate).mockReturnValue({
        amount: 50,
        rate: 0.85,
        loading: false,
        from: "GBP",
        to: "EUR",
      });

      rerender(<ConvertDisplay />);

      shouldSee("42.50", "50 in GBP is equivalent to 42.5 in EUR");
    });
  });
});
