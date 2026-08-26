import { Currency } from "@/infra/api/frankfurter";
import { useCurrencies } from "@/shared/currencies";
import { useURLState } from "@/shared/url/hooks";
import { shouldHaveTestId, shouldSee } from "@/tests";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CurrencyCard } from "./CurrencyCard";

vi.mock("@/shared/url/hooks", () => ({
  useURLState: vi.fn(),
}));

vi.mock("@/shared/currencies", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/shared/currencies")>();
  return {
    ...actual,
    useCurrencies: vi.fn(),
  };
});

vi.mock("../modules/currency-picker", () => ({
  PickerForm: ({ isSend, popover }: { isSend: boolean; popover: string }) => (
    <div
      data-testid="picker-form"
      data-issend={String(isSend)}
      data-popover={popover}
    />
  ),
}));

describe("CurrencyCard Component", () => {
  const mockCurrencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
  ] as Currency[];

  const defaultURLState = {
    from: "USD",
    to: "EUR",
    amount: 100,
    setFrom: vi.fn(),
    setTo: vi.fn(),
    setAmount: vi.fn(),
    swapCurrencies: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useURLState).mockReturnValue(defaultURLState);
    vi.mocked(useCurrencies).mockReturnValue({
      currencies: mockCurrencies,
      isLoading: false,
      error: null,
      favorites: [],
    });
  });

  describe("Send Currency Variant (isSend = true)", () => {
    it("renders currency button for active 'from' currency (USD)", () => {
      render(<CurrencyCard isSend={true} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();

      const flag = screen.getByAltText("US Dollar flag");
      expect(flag).toBeInTheDocument();

      shouldSee("Change send currency(", "USD");
    });

    it("passes isSend={true} to PickerForm", () => {
      render(<CurrencyCard isSend={true} />);

      const [pickerForm] = shouldHaveTestId("picker-form");
      expect(pickerForm).toHaveAttribute("data-issend", "true");
    });
  });

  describe("Receive Currency Variant (isSend = false)", () => {
    it("renders currency button for active 'to' currency (EUR)", () => {
      render(<CurrencyCard isSend={false} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();

      const flag = screen.getByAltText("Euro flag");
      expect(flag).toBeInTheDocument();

      expect(
        screen.getByText((content) =>
          content.includes("Change receive currency("),
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("EUR")).toBeInTheDocument();
    });

    it("passes isSend={false} to PickerForm", () => {
      render(<CurrencyCard isSend={false} />);

      const [pickerForm] = shouldHaveTestId("picker-form");
      expect(pickerForm).toHaveAttribute("data-issend", "false");
    });
  });

  describe("Fallback Currencies", () => {
    it("falls back to USD when active 'from' currency is not found in currencies list", () => {
      vi.mocked(useURLState).mockReturnValue({
        ...defaultURLState,
        from: "UNKNOWN",
      });

      render(<CurrencyCard isSend={true} />);

      expect(screen.getByAltText("US Dollar flag")).toBeInTheDocument();
      expect(screen.getByText("USD")).toBeInTheDocument();
    });

    it("falls back to EUR when active 'to' currency is not found in currencies list", () => {
      vi.mocked(useURLState).mockReturnValue({
        ...defaultURLState,
        to: "INVALID",
      });

      render(<CurrencyCard isSend={false} />);

      expect(screen.getByAltText("Euro flag")).toBeInTheDocument();
      expect(screen.getByText("EUR")).toBeInTheDocument();
    });
  });

  describe("Null Guard / Render Protection", () => {
    it("returns null when neither target nor fallback currency exists in currencies list", () => {
      vi.mocked(useCurrencies).mockReturnValue({
        currencies: [],
        favorites: [],
        isLoading: false,
        error: null,
      });

      const { container } = render(<CurrencyCard isSend={true} />);
      expect(container.firstChild).toBeNull();
    });

    it("returns null when currencies list contains no matching fallback currency", () => {
      vi.mocked(useCurrencies).mockReturnValue({
        currencies: [{ code: "CAD", name: "Canadian Dollar" } as Currency],
        favorites: [],
        isLoading: false,
        error: null,
      });

      const { container } = render(<CurrencyCard isSend={true} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Popover Attributes & Styling", () => {
    it("links button popoverTarget attribute to PickerForm popover ID", () => {
      render(<CurrencyCard isSend={true} />);

      const button = screen.getByRole("button");
      const [pickerForm] = shouldHaveTestId("picker-form");

      expect(button).toHaveAttribute("popovertarget");
      expect(pickerForm).toHaveAttribute("data-popover");
    });

    it("applies popover anchor name", () => {
      render(<CurrencyCard isSend={true} />);

      const button = screen.getByRole("button");
      const [pickerForm] = shouldHaveTestId("picker-form");
      const popoverId = pickerForm.getAttribute("data-popover");

      expect(button.className).toContain(`[anchor-name:--${popoverId}]`);
    });
  });

  describe("Dynamic Reactivity", () => {
    it("updates displayed currency dynamically when URL state changes", () => {
      const { rerender } = render(<CurrencyCard isSend={true} />);

      shouldSee("USD");

      vi.mocked(useURLState).mockReturnValue({
        ...defaultURLState,
        from: "GBP",
      });

      rerender(<CurrencyCard isSend={true} />);

      shouldSee("GBP");

      expect(screen.getByAltText("British Pound flag")).toBeInTheDocument();
    });
  });
});
