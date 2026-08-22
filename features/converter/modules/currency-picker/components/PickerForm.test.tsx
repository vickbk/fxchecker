import { shouldNotSee, shouldSee, userTypes } from "@/tests";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as useCurrencyModule from "../hooks/useCurrencyPicker";
import * as currencyGroupModule from "./CurrencyGroup";
import { PickerForm } from "./PickerForm";

const mockCurrencies = [
  { code: "USD", name: "United States Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
];

const mockFavorites = [
  { code: "USD", name: "United States Dollar", symbol: "$" },
];
const mockOthers = [{ code: "EUR", name: "Euro", symbol: "€" }];

describe("PickerForm Component", () => {
  const mockOpenMenu = vi.fn();
  const mockCloseMenu = vi.fn();
  const mockSetQuery = vi.fn();
  const mockSetChoice = vi.fn();
  const mockSetCurrencyQuery = vi.fn();

  const defaultHookReturn = {
    actualCurr: mockCurrencies[0],
    filterOptions: {
      openMenu: mockOpenMenu,
      isOpen: true,
      closeMenu: mockCloseMenu,
      setQuery: mockSetQuery,
    },
    setChoice: mockSetChoice,
    choice: "USD",
    setCurrencyQuery: mockSetCurrencyQuery,
    filteredCurrencies: mockCurrencies,
    filteredFavorites: mockFavorites,
    otherCurrencies: mockOthers,
  } as unknown as ReturnType<(typeof useCurrencyModule)["useCurrencyPicker"]>;
  let useCurrencyPicker: (typeof useCurrencyModule)["useCurrencyPicker"] =
    useCurrencyModule.useCurrencyPicker;
  const CurrencyGroup = vi.spyOn(currencyGroupModule, "CurrencyGroup");

  beforeEach(() => {
    vi.clearAllMocks();
    useCurrencyPicker = vi.spyOn(useCurrencyModule, "useCurrencyPicker");

    vi.mocked(useCurrencyPicker).mockReturnValue(defaultHookReturn);
  });

  describe("Guard & Null States", () => {
    it("renders null when actualCurr is undefined or null", () => {
      vi.mocked(useCurrencyPicker).mockReturnValue({
        ...defaultHookReturn,
        actualCurr: undefined,
      });

      const { container } = render(
        <PickerForm isSend={true} popover="test-popover" />,
      );

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("Hook Integration & Props Forwarding", () => {
    it("passes isSend prop to useCurrencyPicker hook", () => {
      render(<PickerForm isSend={false} popover="picker-popover" />);

      expect(useCurrencyPicker).toHaveBeenCalledWith({ isSend: false });
    });

    it("attaches popover ID, popover attribute, and aria-live polite to form", () => {
      render(<PickerForm isSend={true} popover="test-popover" />);

      const formElement = document.getElementById("test-popover");

      expect(formElement).toBeInTheDocument();
      expect(formElement).toHaveAttribute("popover", "");
      expect(formElement).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Search Input Behavior", () => {
    it("renders search input with accessibility label and placeholder", () => {
      const { container } = render(
        <PickerForm isSend={true} popover="test-popover" />,
      );

      const input = screen.getByPlaceholderText("Search for currencies...");
      expect(input).toBeInTheDocument();
      shouldSee("Enter the currency you like");
      expect(container.querySelector(".bi-search")).toBeInTheDocument();
    });

    it("triggers setQuery on user text input", async () => {
      render(<PickerForm isSend={true} popover="test-popover" />);

      await userTypes("Search for currencies...", "EUR");

      expect(mockSetQuery).toHaveBeenCalled();
    });
  });

  describe("Popover Toggle Lifecycle (onToggle)", () => {
    it("invokes openMenu when popover toggle state changes to 'open'", () => {
      render(<PickerForm isSend={true} popover="test-popover" />);

      const formElement = document.getElementById("test-popover")!;
      const toggleEvent = Object.assign(new Event("toggle"), {
        newState: "open",
      });

      fireEvent(formElement, toggleEvent);

      expect(mockOpenMenu).toHaveBeenCalledTimes(1);
      expect(mockCloseMenu).not.toHaveBeenCalled();
    });

    it("invokes setCurrencyQuery and closeMenu when popover toggle state changes to 'closed'", () => {
      render(<PickerForm isSend={true} popover="test-popover" />);

      const formElement = document.getElementById("test-popover")!;
      const toggleEvent = Object.assign(new Event("toggle"), {
        newState: "closed",
      });

      fireEvent(formElement, toggleEvent);

      expect(mockSetCurrencyQuery).toHaveBeenCalledWith("USD");
      expect(mockCloseMenu).toHaveBeenCalledTimes(1);
      expect(mockOpenMenu).not.toHaveBeenCalled();
    });
  });

  describe("Menu Loading vs Content State", () => {
    it("renders LoadingPlaceholder when isOpen is false", () => {
      vi.mocked(useCurrencyPicker).mockReturnValue({
        ...defaultHookReturn,
        filterOptions: {
          ...defaultHookReturn.filterOptions,
          isOpen: false,
        },
      });

      const { container } = render(
        <PickerForm isSend={true} popover="test-popover" />,
      );

      expect(container.querySelector(".w-64")).toBeInTheDocument();

      shouldNotSee("Favorites", "Other currencies");
    });

    it("renders scrollable list container when isOpen is true", () => {
      render(<PickerForm isSend={true} popover="test-popover" />);

      shouldSee("Favorites", "Other currencies");
    });
  });

  describe("Currency Group Rendering & Filtering Scenarios", () => {
    it("renders both Favorites and Other currencies groups when items exist in both", () => {
      render(<PickerForm isSend={true} popover="test-popover" />);

      shouldSee("Favorites", "Other currencies");

      expect(CurrencyGroup).toHaveBeenCalledWith(
        {
          actualCurr: mockFavorites[0],
          title: "Favorites",
          currencies: mockFavorites,
          popover: "test-popover",
          setChoice: mockSetChoice,
          choice: "USD",
        },
        undefined,
      );

      expect(CurrencyGroup).toHaveBeenCalledWith(
        {
          actualCurr: mockFavorites[0],
          title: "Other currencies",
          currencies: mockOthers,
          popover: "test-popover",
          setChoice: mockSetChoice,
          choice: "USD",
        },
        undefined,
      );
    });

    it("omits Favorites group when filteredFavorites is empty", () => {
      vi.mocked(useCurrencyPicker).mockReturnValue({
        ...defaultHookReturn,
        filteredFavorites: [],
        otherCurrencies: mockOthers,
        filteredCurrencies: mockOthers,
      });

      render(<PickerForm isSend={true} popover="test-popover" />);

      shouldNotSee("Favorites");
      shouldSee("Other currencies");
    });

    it("omits Other currencies group when otherCurrencies is empty", () => {
      vi.mocked(useCurrencyPicker).mockReturnValue({
        ...defaultHookReturn,
        filteredFavorites: mockFavorites,
        otherCurrencies: [],
        filteredCurrencies: mockFavorites,
      });

      render(<PickerForm isSend={true} popover="test-popover" />);
      shouldSee("Favorites");
      shouldNotSee("Other currencies");
    });

    it("displays 'No results found' message when filteredCurrencies is empty", () => {
      vi.mocked(useCurrencyPicker).mockReturnValue({
        ...defaultHookReturn,
        filteredCurrencies: [],
        filteredFavorites: [],
        otherCurrencies: [],
      });

      render(<PickerForm isSend={true} popover="test-popover" />);

      shouldSee("No results found");
      shouldNotSee("Favorites", "Other currencies");
    });
  });
});
