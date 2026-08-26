import { FrankfurterRate, getRate } from "@/infra/api/frankfurter";
import { shouldNotSee, shouldSee, userClicks, userTypes } from "@/tests";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CHANGE_SEND_TRIGGER,
  CONVERTER_TITLE,
  EXCHANGE_AMOUNT_LABEL,
  INITIAL_SWAP_TEXT,
  RECEIVE_HEADER,
  SEND_HEADER,
  SWAPPER_TEXT,
} from "./__testing__/utils";
import { CurrencyCard } from "./components/CurrencyCard";
import { ConverterCard } from "./index";
import {
  FAVORITES_HEADER,
  NO_RESULTS_FOUND,
  OTHER_CURRENCIES_HEADER,
  SEARCH_BASE_PLACEHOLDER,
  SEARCH_CURRENCY_LABEL,
} from "./modules/currency-picker/__testing__/utils";

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
        { code: "JPY", name: "Japanese Yen" },
        { code: "CAD", name: "Canadian Dollar" },
      ],
      groupCurrencies: (
        currencies: Array<{ code: string; name: string }>,
        favorites: string[],
      ) => ({
        favorites: currencies.filter((c) => favorites.includes(c.code)),
        others: currencies.filter((c) => !favorites.includes(c.code)),
      }),
      favorites: ["USD", "EUR"],
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
  scrollIntoView: vi.fn(),
  SRHidden: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <span className={className}>{children}</span>,
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

describe("CurrencyCard & PickerForm Integration (Popover & Search)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.from = "USD";
    mockState.to = "EUR";

    // Polyfill JSDOM Popover API method if missing
    if (!HTMLElement.prototype.hidePopover) {
      HTMLElement.prototype.hidePopover = vi.fn();
    }
  });

  describe("Popover State & Initial Toggle", () => {
    it("renders loading placeholder when popover menu is initially closed", () => {
      const { container } = render(<CurrencyCard isSend />);

      const form = container.querySelector("form[popover]");
      expect(form).toBeInTheDocument();

      // Menu is closed by default, rendering loading placeholder
      expect(screen.getByTestId("loading-placeholder")).toBeInTheDocument();
      shouldNotSee(FAVORITES_HEADER, OTHER_CURRENCIES_HEADER);
    });

    it("opens menu and renders Favorites and Other currencies groups on toggle open event", () => {
      const { container } = render(<CurrencyCard isSend />);

      const form = container.querySelector("form[popover]")!;

      fireEvent.toggle(form, { newState: "open" });

      expect(
        screen.queryByTestId("loading-placeholder"),
      ).not.toBeInTheDocument();

      shouldSee(
        "Favorites",
        OTHER_CURRENCIES_HEADER,
        // 2 Favorites (USD, EUR)
        "2",
        // 3 Others (GBP, JPY, CAD)
        "3",
      );
    });
  });

  describe("Search & Filtering Flow", () => {
    it("filters currencies dynamically when user types into search input", async () => {
      const { container } = render(<CurrencyCard isSend />);

      const form = container.querySelector("form[popover]")!;
      fireEvent.toggle(form, { newState: "open" });

      await userTypes(SEARCH_CURRENCY_LABEL, "pound");

      shouldSee("British Pound");
      shouldNotSee("US Dollar", "Euro", "Japanese Yen");
    });

    it("filters currencies by currency code (case-insensitive search)", async () => {
      const { container } = render(<CurrencyCard isSend />);

      const form = container.querySelector("form[popover]")!;
      fireEvent.toggle(form, { newState: "open" });

      await userTypes(SEARCH_BASE_PLACEHOLDER, "jpy");

      shouldSee("Japanese Yen");
      shouldNotSee("US Dollar");
    });

    it("renders 'No results found' message when search query matches nothing", async () => {
      const { container } = render(<CurrencyCard isSend />);

      const form = container.querySelector("form[popover]")!;
      fireEvent.toggle(form, { newState: "open" });

      await userTypes(SEARCH_CURRENCY_LABEL, "NON_EXISTENT_CURRENCY");
      shouldSee(NO_RESULTS_FOUND);
      shouldNotSee(FAVORITES_HEADER, OTHER_CURRENCIES_HEADER);
    });
  });

  describe("Currency Selection & State Sync", () => {
    it("selects a new currency radio option and closes popover on click", async () => {
      const user = userEvent.setup();
      const hidePopoverSpy = vi.spyOn(HTMLElement.prototype, "hidePopover");

      const { container } = render(<CurrencyCard isSend />);

      const form = container.querySelector("form[popover]")!;
      fireEvent.toggle(form, { newState: "open" });

      const gbpOption = screen.getByLabelText(/British Pound/i);

      await user.pointer({
        keys: "[MouseLeft]",
        target: gbpOption,
        coords: { screenX: 350, screenY: 450 },
      });

      expect(hidePopoverSpy).toHaveBeenCalled();

      fireEvent.toggle(form, { newState: "closed" });

      expect(mockState.setFrom).toHaveBeenCalledWith("GBP");
    });

    it("updates receive currency ('to' state) when isSend is false", async () => {
      const { container } = render(<CurrencyCard isSend={false} />);

      const form = container.querySelector("form[popover]")!;
      fireEvent.toggle(form, { newState: "open" });

      await userClicks(/Canadian Dollar/i);

      fireEvent.toggle(form, { newState: "closed" });

      expect(mockState.setTo).toHaveBeenCalledWith("CAD");
    });

    it("closes popover via keyboard interaction (Enter key on radio option)", async () => {
      const hidePopoverSpy = vi.spyOn(HTMLElement.prototype, "hidePopover");
      const { container } = render(<CurrencyCard isSend />);

      await userClicks(CHANGE_SEND_TRIGGER);

      const form = container.querySelector("form");

      fireEvent.toggle(form!, { newState: "open" });

      const jpyRadio = screen.getByRole("radio", { name: /Japanese Yen/i });
      fireEvent.keyDown(jpyRadio, { key: "Enter" });

      expect(hidePopoverSpy).toHaveBeenCalled();
    });
  });
});
