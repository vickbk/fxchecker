import { Currency } from "@/infra/api/frankfurter";
import * as scrollModule from "@/shared/utils";
import { isChecked, userClicks } from "@/tests";
import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CurrencyGroup } from "./CurrencyGroup";

const mockCurrencies: Currency[] = [
  { code: "USD", name: "United States Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
];

const user = userEvent.setup();

describe("CurrencyGroup Component", () => {
  const defaultProps = {
    title: "Popular Currencies",
    currencies: mockCurrencies,
    popover: "currency-popover-id",
    actualCurr: mockCurrencies[0], // USD
    choice: "USD",
    setChoice: vi.fn(),
  };

  let mockPopoverElement: HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();

    const element = document.createElement("div");
    element.id = "currency-popover-id";
    element.hidePopover = vi.fn();
    document.body.appendChild(element);
    mockPopoverElement = document.getElementById(element.id)!;
  });

  describe("Rendering & Structure", () => {
    it("renders fieldset legend with title and currency count", () => {
      render(<CurrencyGroup {...defaultProps} />);

      expect(screen.getByRole("group")).toBeInTheDocument();
      expect(screen.getByText("Popular Currencies")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("renders empty group when currencies array is empty", () => {
      render(<CurrencyGroup {...defaultProps} currencies={[]} />);

      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.queryAllByRole("radio")).toHaveLength(0);
    });

    it("renders all currency flags, codes, names, and check icons", () => {
      const { container } = render(<CurrencyGroup {...defaultProps} />);

      mockCurrencies.forEach(({ code, name }, index) => {
        expect(screen.getAllByAltText(``)[index]).toBeInTheDocument();
        expect(screen.getByText(code)).toBeInTheDocument();
        expect(screen.getByText(name)).toBeInTheDocument();
      });

      expect(container.querySelectorAll(".bi-check")).toHaveLength(
        mockCurrencies.length,
      );
    });
  });

  describe("Radio Selection & Choice Handlers", () => {
    it("marks radio checked if it matches choice or actualCurr", () => {
      render(
        <CurrencyGroup
          {...defaultProps}
          choice="EUR"
          actualCurr={mockCurrencies[0]}
        />,
      );

      const radios = screen.getAllByRole("radio") as HTMLInputElement[];

      expect(radios[0].defaultChecked).toBe(true); // USD (actualCurr)
      expect(radios[1].defaultChecked).toBe(true); // EUR (choice)
      expect(radios[2].defaultChecked).toBe(false); // GBP
    });

    it("invokes setChoice with currency code when selected", async () => {
      const setChoiceMock = vi.fn();
      render(<CurrencyGroup {...defaultProps} setChoice={setChoiceMock} />);

      const eurRadio = screen.getAllByRole("radio")[1]; // EUR
      fireEvent.click(eurRadio);

      expect(setChoiceMock).toHaveBeenCalledWith("EUR");
    });
  });

  describe("Scroll Ref Attachment", () => {
    it("attaches scrollIntoView ref function to the label matching actualCurr", () => {
      vi.spyOn(scrollModule, "scrollIntoView");
      render(
        <CurrencyGroup {...defaultProps} actualCurr={mockCurrencies[1]} />,
      ); // EUR

      expect(scrollModule.scrollIntoView).toHaveBeenCalled();
      expect(scrollModule.scrollIntoView).toHaveBeenCalledWith(
        expect.any(HTMLLabelElement),
      );
    });
  });

  describe("Popover Dismissal Interaction", () => {
    it("hides popover when clicking a currency option with a mouse (screen coordinates > 0)", () => {
      render(<CurrencyGroup {...defaultProps} />);

      const usdRadio = screen.getAllByRole("radio")[0];

      fireEvent.click(usdRadio, { screenX: 100, screenY: 200 });

      expect(mockPopoverElement.hidePopover).toHaveBeenCalledTimes(1);
    });

    it("does not hide popover via onClick if triggered by keyboard (screenX === 0 && screenY === 0)", () => {
      render(<CurrencyGroup {...defaultProps} />);

      const usdRadio = screen.getAllByRole("radio")[0];

      fireEvent.click(usdRadio, { screenX: 0, screenY: 0 });

      expect(mockPopoverElement.hidePopover).not.toHaveBeenCalled();
    });

    it("hides popover on KeyDown with 'Enter' or Space (' ')", async () => {
      const { container } = render(<CurrencyGroup {...defaultProps} />);

      await userClicks("USD", container);
      isChecked("USD");

      await user.keyboard("{Enter}");
      expect(mockPopoverElement.hidePopover).toHaveBeenCalledTimes(1);

      await user.keyboard(" ");
      expect(mockPopoverElement.hidePopover).toHaveBeenCalledTimes(2);
    });

    it("ignores keydown event for unhandled keys like ArrowDown or Tab", () => {
      render(<CurrencyGroup {...defaultProps} />);

      const usdRadio = screen.getAllByRole("radio")[0];

      fireEvent.keyDown(usdRadio, { key: "ArrowDown" });
      fireEvent.keyDown(usdRadio, { key: "Tab" });

      expect(mockPopoverElement.hidePopover).not.toHaveBeenCalled();
    });

    it("handles missing popover element in DOM gracefully without crashing", () => {
      document.body.removeChild(mockPopoverElement); // Remove element from DOM

      render(<CurrencyGroup {...defaultProps} />);

      const usdRadio = screen.getAllByRole("radio")[0];

      expect(() => {
        fireEvent.click(usdRadio, { screenX: 10, screenY: 10 });
        fireEvent.keyDown(usdRadio, { key: "Enter" });
      }).not.toThrow();
    });
  });
});
