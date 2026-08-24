import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AmountSetter } from "./AmountSetter";

describe("AmountSetter Component", () => {
  const mockSetAmount = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering & Accessibility", () => {
    it("renders input element associated with screen reader label via htmlFor/id", () => {
      render(<AmountSetter amount={100} setAmount={mockSetAmount} />);

      const input = screen.getByLabelText("Exchange amount");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "number");
      expect(input).toHaveAttribute("id", "exchange-amount");
    });

    it("renders label with sr-only class for accessibility compliance", () => {
      render(<AmountSetter amount={100} setAmount={mockSetAmount} />);

      const label = screen.getByText("Exchange amount");
      expect(label.tagName).toBe("LABEL");
      expect(label).toHaveClass("sr-only");
      expect(label).toHaveAttribute("for", "exchange-amount");
    });

    it("displays placeholder attribute with value '100'", () => {
      render(<AmountSetter amount={100} setAmount={mockSetAmount} />);

      const input = screen.getByPlaceholderText("100");
      expect(input).toBeInTheDocument();
    });

    it("applies mandatory Tailwind utility classes for layout, typography, and hiding webkit spin buttons", () => {
      render(<AmountSetter amount={100} setAmount={mockSetAmount} />);

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveClass(
        "max-w-30",
        "outline-none",
        "focus-visible:underline",
        "selection:bg-btn",
        "hover:underline",
        "shrink",
        "text-4xl",
        "[appearance:textfield]",
        "[&::-webkit-outer-spin-button]:appearance-none",
        "[&::-webkit-inner-spin-button]:appearance-none",
      );
    });
  });

  describe("Initial State & Props Parsing", () => {
    it("populates defaultValue attribute with the initial amount prop", () => {
      render(<AmountSetter amount={250} setAmount={mockSetAmount} />);

      const input = screen.getByRole("spinbutton") as HTMLInputElement;
      expect(input.value).toBe("250");
    });

    it("supports zero (0) as a valid initial amount", () => {
      render(<AmountSetter amount={0} setAmount={mockSetAmount} />);

      const input = screen.getByRole("spinbutton") as HTMLInputElement;
      expect(input.value).toBe("0");
    });
  });

  describe("User Interaction & Value Conversion", () => {
    it("invokes setAmount with typed numbers using userEvent", async () => {
      const user = userEvent.setup();
      render(<AmountSetter amount={100} setAmount={mockSetAmount} />);

      const input = screen.getByRole("spinbutton");
      await user.clear(input);
      await user.type(input, "500");

      expect(mockSetAmount).toHaveBeenLastCalledWith(500);
    });

    it("converts input string value to number type using unary plus operator", () => {
      render(<AmountSetter amount={100} setAmount={mockSetAmount} />);

      const input = screen.getByRole("spinbutton");
      fireEvent.change(input, { target: { value: "42.5" } });

      expect(mockSetAmount).toHaveBeenCalledWith(42.5);
      expect(typeof mockSetAmount.mock.calls[0][0]).toBe("number");
    });

    it("converts empty input string to 0 when input is cleared (+'' === 0)", () => {
      render(<AmountSetter amount={100} setAmount={mockSetAmount} />);

      const input = screen.getByRole("spinbutton");
      fireEvent.change(input, { target: { value: "" } });

      expect(mockSetAmount).toHaveBeenCalledWith(0);
      expect(typeof mockSetAmount.mock.calls[0][0]).toBe("number");
    });
  });
});
