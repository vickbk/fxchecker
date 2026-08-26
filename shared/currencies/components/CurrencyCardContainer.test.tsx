import { shouldHaveTestId } from "@/tests";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CurrencyCardContainer } from "./CurrencyCardContainer";

describe("CurrencyCardContainer Component", () => {
  describe("Semantic Structure & HTML Markup", () => {
    it("renders an unordered list (<ul>) as the root container", () => {
      render(
        <CurrencyCardContainer>
          <li>Card Item</li>
        </CurrencyCardContainer>,
      );

      const listElement = screen.getByRole("list");
      expect(listElement).toBeInTheDocument();
      expect(listElement.tagName).toBe("UL");
    });
  });

  describe("Styling & CSS Classes", () => {
    it("applies mandatory layout and sizing Tailwind classes", () => {
      render(
        <CurrencyCardContainer>
          <li>Card Item</li>
        </CurrencyCardContainer>,
      );

      const listElement = screen.getByRole("list");
      expect(listElement).toHaveClass(
        "w-full",
        "flex",
        "flex-col",
        "gap-4",
        "min-h-100",
      );
    });
  });

  describe("Children Rendering Capabilities", () => {
    it("renders a single child correctly", () => {
      render(
        <CurrencyCardContainer>
          <li data-testid="currency-card">USD Currency Card</li>
        </CurrencyCardContainer>,
      );

      const [card] = shouldHaveTestId("currency-card");
      expect(card).toHaveTextContent("USD Currency Card");
    });

    it("renders multiple children maintaining DOM order", () => {
      render(
        <CurrencyCardContainer>
          <li>USD Card</li>
          <li>EUR Card</li>
          <li>GBP Card</li>
        </CurrencyCardContainer>,
      );

      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(3);
      expect(items[0]).toHaveTextContent("USD Card");
      expect(items[1]).toHaveTextContent("EUR Card");
      expect(items[2]).toHaveTextContent("GBP Card");
    });

    it("handles primitive text nodes as children", () => {
      render(<CurrencyCardContainer>Raw text content</CurrencyCardContainer>);

      const listElement = screen.getByRole("list");
      expect(listElement).toHaveTextContent("Raw text content");
    });

    it("handles conditional or empty children (null, undefined, boolean) without crashing", () => {
      render(
        <CurrencyCardContainer>
          {null}
          {undefined}
          {false}
        </CurrencyCardContainer>,
      );

      const listElement = screen.getByRole("list");
      expect(listElement).toBeInTheDocument();
      expect(listElement).toBeEmptyDOMElement();
    });
  });
});
