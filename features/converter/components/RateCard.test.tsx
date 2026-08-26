import { useURLState } from "@/shared/url/hooks";
import { shouldHaveTestId, shouldNotHaveTestId, shouldSee } from "@/tests";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RateCard } from "./RateCard";

vi.mock("@/shared/url/hooks", () => ({
  useURLState: vi.fn(),
}));

vi.mock("./AmountSetter", () => ({
  AmountSetter: ({ amount }: { amount: number }) => (
    <div data-testid="amount-setter" data-amount={amount} />
  ),
}));

vi.mock("./ConvertDisplay", () => ({
  ConvertDisplay: () => <div data-testid="convert-display" />,
}));

vi.mock("./CurrencyCard", () => ({
  CurrencyCard: ({ isSend }: { isSend?: boolean }) => (
    <div data-testid="currency-card" data-issend={String(isSend)} />
  ),
}));

describe("RateCard Component", () => {
  const mockSetAmount = vi.fn();
  const defaultURLState = {
    from: "USD",
    to: "EUR",
    amount: 250,
    setAmount: mockSetAmount,
    setFrom: vi.fn(),
    setTo: vi.fn(),
    swapCurrencies: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useURLState).mockReturnValue(defaultURLState);
  });

  describe("Default / Receive Variant (isSend = false)", () => {
    it("renders Receive heading with correct id and accessibility aria-describedby linkage", () => {
      const { container } = render(<RateCard />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute(
        "aria-describedby",
        "receive-rate-header",
      );

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id", "receive-rate-header");
      expect(heading).toHaveTextContent("Receive rate (EUR)");
    });

    it("renders text referencing the 'to' currency parameter", () => {
      render(<RateCard isSend={false} />);

      shouldSee("rate (EUR)");
    });

    it("renders ConvertDisplay component and omits AmountSetter", () => {
      render(<RateCard isSend={false} />);

      shouldHaveTestId("convert-display");
      shouldNotHaveTestId("amount-setter");
    });

    it("passes isSend={false} prop down to CurrencyCard", () => {
      render(<RateCard isSend={false} />);

      const [currencyCard] = shouldHaveTestId("currency-card");
      expect(currencyCard).toHaveAttribute("data-issend", "false");
    });
  });

  describe("Send Variant (isSend = true)", () => {
    it("renders Send heading with send-rate-header id and aria-describedby linkage", () => {
      const { container } = render(<RateCard isSend />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute("aria-describedby", "send-rate-header");

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id", "send-rate-header");
      expect(heading).toHaveTextContent("Send rate (USD)");
    });

    it("renders SROnly text referencing the 'from' currency parameter", () => {
      render(<RateCard isSend />);

      shouldSee("rate (USD)");
    });

    it("renders AmountSetter component with URL state props and omits ConvertDisplay", () => {
      render(<RateCard isSend />);

      const [amountSetter] = shouldHaveTestId("amount-setter");
      expect(amountSetter).toHaveAttribute("data-amount", "250");
      shouldNotHaveTestId("convert-display");
    });

    it("passes isSend prop down to CurrencyCard", () => {
      render(<RateCard isSend />);

      const [currencyCard] = shouldHaveTestId("currency-card");
      expect(currencyCard).toHaveAttribute("data-issend", "true");
    });
  });

  describe("Dynamic State Updates", () => {
    it("reacts dynamically when URL state currencies update", () => {
      const { rerender } = render(<RateCard isSend />);

      expect(screen.getByText("rate (USD)")).toBeInTheDocument();

      vi.mocked(useURLState).mockReturnValue({
        ...defaultURLState,
        from: "CAD",
        to: "GBP",
      });

      rerender(<RateCard isSend />);

      shouldSee("rate (CAD)");
    });
  });
});
