import { FrankfurterRate, getRate } from "@/infra/api/frankfurter";
import { shouldSee, userClicks, userTypes } from "@/tests";
import { act, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONVERTER_TITLE,
  EXCHANGE_AMOUNT_LABEL,
  INITIAL_SWAP_TEXT,
  RECEIVE_HEADER,
  SEND_HEADER,
  SWAPPER_TEXT,
} from "./__testing__/utils";
import { ConverterCard } from "./index";

// 1. Mock External API Boundary
vi.mock("@/infra/api/frankfurter", () => ({
  getRate: vi.fn(),
}));

// 2. Mock Shared Currencies Context Boundary
vi.mock("@/shared/currencies", async (original) => {
  const originals = await original<typeof import("@/shared/currencies")>();
  return {
    ...originals,
    useCurrencies: () => ({
      currencies: [
        { code: "USD", name: "US Dollar" },
        { code: "EUR", name: "Euro" },
        { code: "GBP", name: "British Pound" },
      ],
      loading: false,
      error: null,
    }),
    Flag: ({ currency, alt }: { currency: string; alt: string }) => (
      <span data-testid={`flag-${currency}`} aria-label={alt} />
    ),
  };
});

// 3. Mock Shared Utils (Icons & UI placeholders)
vi.mock("@/shared/utils", () => ({
  BiIcon: ({ name }: { name: string }) => <i data-testid={`icon-${name}`} />,
  SROnly: ({ children }: { children: React.ReactNode }) => (
    <span className="sr-only">{children}</span>
  ),
  LoadingPlaceholder: ({ className }: { className?: string }) => (
    <span data-testid="loading-placeholder" className={className} />
  ),
}));

// 4. Reactive In-Memory URL State Store for Component-Level Integration
const mockState = {
  from: "USD",
  to: "EUR",
  amount: 250,
  setAmount: vi.fn((val: number) => {
    mockState.amount = val;
  }),
  setFrom: vi.fn((val: string) => {
    mockState.from = val;
  }),
  setTo: vi.fn((val: string) => {
    mockState.to = val;
  }),
  swapCurrencies: vi.fn(() => {
    const prevFrom = mockState.from;
    mockState.from = mockState.to;
    mockState.to = prevFrom;
  }),
};

vi.mock("@/shared/url/hooks", () => ({
  useURLState: vi.fn(() => mockState),
}));

describe("ConverterCard Integration Suite (Unmocked Converter Sub-Tree)", () => {
  const favoriteToggleSlot = <button data-testid="fav-btn">★ Favorite</button>;
  const conversionLoggerSlot = <button data-testid="log-btn">Log Rate</button>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset URL State Store
    mockState.from = "USD";
    mockState.to = "EUR";
    mockState.amount = 250;

    // Default Frankfurter API Resolution
    vi.mocked(getRate).mockImplementation(async (from, to) => {
      let rate = 1.0;
      if (from === "USD" && to === "EUR") rate = 0.92;
      if (from === "EUR" && to === "USD") rate = 1.08;
      return { rate } as FrankfurterRate;
    });
  });

  describe("Initial Rendering & Unmocked Hierarchy", () => {
    it("renders the entire converter tree with RateCards, Swapper, and ConverterActions", async () => {
      const jsx = await ConverterCard({
        favoriteToggle: favoriteToggleSlot,
        conversionLogger: conversionLoggerSlot,
      });

      act(() => render(jsx));

      shouldSee(CONVERTER_TITLE);

      // Outer Heading

      // Send & Receive RateCard Headings
      expect(
        screen.getByRole("heading", { name: SEND_HEADER }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: RECEIVE_HEADER }),
      ).toBeInTheDocument();

      // Swapper Control Button
      shouldSee(SWAPPER_TEXT);
      // Currency Cards with Flags
      expect(screen.getByTestId("flag-USD")).toBeInTheDocument();
      expect(screen.getByTestId("flag-EUR")).toBeInTheDocument();

      // Injected Action Slots
      expect(screen.getByTestId("fav-btn")).toBeInTheDocument();
      expect(screen.getByTestId("log-btn")).toBeInTheDocument();
    });

    it("displays initial exchange input value in AmountSetter", async () => {
      const jsx = await ConverterCard({
        favoriteToggle: favoriteToggleSlot,
        conversionLogger: conversionLoggerSlot,
      });
      render(jsx);

      const amountInput = screen.getByLabelText(
        EXCHANGE_AMOUNT_LABEL,
      ) as HTMLInputElement;
      expect(amountInput).toBeInTheDocument();
      expect(amountInput.value).toBe("250");
    });
  });

  describe("Server Action Data Flow & Asynchronous Auto-Dispatch", () => {
    it("auto-dispatches loadRate server action on mount and displays resolved rate", async () => {
      const jsx = await ConverterCard({
        favoriteToggle: favoriteToggleSlot,
        conversionLogger: conversionLoggerSlot,
      });
      render(jsx);

      // Verify server action was called via useAutoDispatch
      expect(getRate).toHaveBeenCalledWith("USD", "EUR");

      // Wait for async Server Action transition to complete in useActionState
      await waitFor(() => {
        shouldSee("1USD = 0.92EUR");
      });
    });

    it("displays loading placeholder while loadRate server action is pending", async () => {
      let resolveRatePromise: (value: FrankfurterRate) => void;
      const pendingPromise = new Promise<FrankfurterRate>((resolve) => {
        resolveRatePromise = resolve;
      });

      vi.mocked(getRate).mockReturnValue(pendingPromise);

      const jsx = await ConverterCard({
        favoriteToggle: favoriteToggleSlot,
        conversionLogger: conversionLoggerSlot,
      });
      render(jsx);

      expect(
        screen.getAllByTestId("loading-placeholder").length,
      ).toBeGreaterThan(1);

      // Resolve pending rate
      resolveRatePromise!({ rate: 0.92 } as FrankfurterRate);

      await waitFor(() => {
        shouldSee("1USD = 0.92EUR");
      });
    });
  });

  describe("User Interactions & End-to-End Integration", () => {
    it("updates amount state when typing into exchange amount input", async () => {
      const jsx = await ConverterCard({
        favoriteToggle: favoriteToggleSlot,
        conversionLogger: conversionLoggerSlot,
      });
      render(jsx);

      await userTypes(EXCHANGE_AMOUNT_LABEL, "500");

      expect(mockState.setAmount).toHaveBeenCalledWith(500);
    });

    it("swaps currencies when clicking Swapper button and re-fetches exchange rate", async () => {
      const jsx = await ConverterCard({
        favoriteToggle: favoriteToggleSlot,
        conversionLogger: conversionLoggerSlot,
      });

      const { rerender } = render(jsx);

      // Initial Rate Resolution
      await waitFor(() => {
        shouldSee("1USD = 0.92EUR");
      });

      await userClicks(INITIAL_SWAP_TEXT);

      expect(mockState.swapCurrencies).toHaveBeenCalledTimes(1);
      expect(mockState.from).toBe("EUR");
      expect(mockState.to).toBe("USD");

      // Re-render component tree with updated URL state
      const updatedJsx = await ConverterCard({
        favoriteToggle: favoriteToggleSlot,
        conversionLogger: conversionLoggerSlot,
      });
      rerender(updatedJsx);

      expect(getRate).toHaveBeenLastCalledWith("EUR", "USD");

      await waitFor(() => {
        shouldSee("1EUR = 1.08USD");
      });
    });
  });

  describe("Accessibility & Screen Reader Linkage", () => {
    it("links RateCard sections with respective headers via aria-describedby", async () => {
      const jsx = await ConverterCard({
        favoriteToggle: favoriteToggleSlot,
        conversionLogger: conversionLoggerSlot,
      });
      const { container } = render(jsx);

      const sections = container.querySelectorAll("section");
      expect(sections).toHaveLength(2);

      expect(sections[0]).toHaveAttribute(
        "aria-describedby",
        "send-rate-header",
      );
      expect(sections[1]).toHaveAttribute(
        "aria-describedby",
        "receive-rate-header",
      );
    });

    it("renders definition list accessibility structure for exchange rate announcement", async () => {
      const jsx = await ConverterCard({
        favoriteToggle: favoriteToggleSlot,
        conversionLogger: conversionLoggerSlot,
      });
      render(jsx);

      const rateDescriptionTerm = screen.getByText(
        /Current rate for USD to EUR/i,
      );
      expect(rateDescriptionTerm).toBeInTheDocument();
      expect(rateDescriptionTerm.tagName).toBe("DT");
      expect(rateDescriptionTerm).toHaveClass("sr-only");
    });
  });
});
