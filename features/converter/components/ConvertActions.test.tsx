import { shouldSee } from "@/tests";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRate } from "../hooks/useRate";
import { ConverterActions } from "./ConvertActions";

vi.mock("../hooks/useRate", () => ({
  useRate: vi.fn(),
}));

describe("ConverterActions Component", () => {
  const placeholderSelector = ".px-8.bg-card.mr-2";
  const defaultHookState = {
    from: "USD",
    to: "EUR",
    rate: 0.92,
    amount: 100,
    loading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRate).mockReturnValue(defaultHookState);
  });

  describe("Rendering & Accessibility", () => {
    it("renders container div with mandatory layout and typography classes", () => {
      const { container } = render(
        <ConverterActions>
          <button>Submit</button>
        </ConverterActions>,
      );

      const rootDiv = container.firstChild as HTMLElement;
      expect(rootDiv).toBeInTheDocument();
      expect(rootDiv).toHaveClass(
        "flex",
        "flex-col",
        "gap-4",
        "sm:flex-row",
        "items-center",
        "p-4",
        "border-t",
        "border-dashed",
        "border-card",
        "text-center",
        "uppercase",
      );
    });

    it("renders description list markup (<dl>, <dt>, <dd>) with accessible hidden text", () => {
      render(
        <ConverterActions>
          <span>Child Action</span>
        </ConverterActions>,
      );

      const dt = screen.getByText("Current rate for USD to EUR");
      expect(dt).toBeInTheDocument();
      expect(dt.tagName).toBe("DT");
      expect(dt).toHaveClass("sr-only");
    });
  });

  describe("Loading vs Loaded Rate Display", () => {
    it("displays the formatted rate when loading is false", () => {
      const { container } = render(
        <ConverterActions>
          <button>Convert</button>
        </ConverterActions>,
      );

      expect(
        container.querySelector(placeholderSelector),
      ).not.toBeInTheDocument();

      shouldSee("1USD = 0.92EUR");
    });

    it("renders LoadingPlaceholder with proper inline styling when loading is true", () => {
      vi.mocked(useRate).mockReturnValue({
        ...defaultHookState,
        loading: true,
      });

      const { container } = render(
        <ConverterActions>
          <button>Convert</button>
        </ConverterActions>,
      );

      const placeholder = container.querySelector(placeholderSelector);
      expect(placeholder).toBeInTheDocument();
      expect(placeholder).toHaveClass("inline", "px-8", "bg-card", "mr-2");
      expect(screen.queryByText("0.92")).not.toBeInTheDocument();
    });
  });

  describe("Children Slot Capabilities", () => {
    it("renders child elements passed into the component slot", () => {
      render(
        <ConverterActions>
          <button data-testid="action-btn">Convert Now</button>
        </ConverterActions>,
      );

      const button = screen.getByTestId("action-btn");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Convert Now");
    });

    it("renders multiple children while preserving DOM order", () => {
      render(
        <ConverterActions>
          <button data-testid="btn-1">Button 1</button>
          <button data-testid="btn-2">Button 2</button>
        </ConverterActions>,
      );

      expect(screen.getByTestId("btn-1")).toBeInTheDocument();
      expect(screen.getByTestId("btn-2")).toBeInTheDocument();
    });

    it("handles null or conditional children without throwing errors", () => {
      render(
        <ConverterActions>
          {null}
          {undefined}
          {false}
        </ConverterActions>,
      );

      shouldSee("1USD = 0.92EUR");
    });
  });

  describe("Edge Cases & State Variations", () => {
    it("renders correctly when rate is zero (0)", () => {
      vi.mocked(useRate).mockReturnValue({
        ...defaultHookState,
        rate: 0,
      });

      render(
        <ConverterActions>
          <span>Action</span>
        </ConverterActions>,
      );

      shouldSee("1USD = 0EUR");
    });

    it("updates screen reader description and display rate when currencies change", () => {
      const { rerender } = render(
        <ConverterActions>
          <span>Action</span>
        </ConverterActions>,
      );

      expect(
        screen.getByText("Current rate for USD to EUR"),
      ).toBeInTheDocument();

      vi.mocked(useRate).mockReturnValue({
        from: "GBP",
        to: "JPY",
        rate: 185.4,
        amount: 1,
        loading: false,
      });

      rerender(
        <ConverterActions>
          <span>Action</span>
        </ConverterActions>,
      );

      shouldSee("Current rate for GBP to JPY", "1GBP = 185.4JPY");
    });

    it("handles identical 'from' and 'to' currencies", () => {
      vi.mocked(useRate).mockReturnValue({
        from: "EUR",
        to: "EUR",
        rate: 1,
        amount: 10,
        loading: false,
      });

      render(
        <ConverterActions>
          <span>Action</span>
        </ConverterActions>,
      );

      shouldSee("Current rate for EUR to EUR", "1EUR = 1EUR");
    });
  });
});
