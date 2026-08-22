import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CurrencyCard } from "./CurrencyCard";

describe("CurrencyCard Component", () => {
  describe("Semantic Structure & HTML Markup", () => {
    it("renders an HTML list item (<li>) element", () => {
      render(
        <ul>
          <CurrencyCard>
            <span>USD Card Content</span>
          </CurrencyCard>
        </ul>,
      );

      const listItem = screen.getByRole("listitem");
      expect(listItem).toBeInTheDocument();
      expect(listItem.tagName).toBe("LI");
    });
  });

  describe("Styling & CSS Classes", () => {
    it("applies mandatory layout, outline, focus, and background Tailwind classes", () => {
      render(
        <ul>
          <CurrencyCard>
            <span>Content</span>
          </CurrencyCard>
        </ul>,
      );

      const listItem = screen.getByRole("listitem");
      expect(listItem).toHaveClass(
        "flex",
        "gap-4",
        "p-4",
        "bg-card",
        "hover:outline",
        "hover:outline-foreground-secondary",
        "has-focus-visible:outline",
        "has-focus-visible:outline-lime-500",
        "rounded-lg",
        "justify-between",
        "items-center",
        "relative",
      );
    });
  });

  describe("Children Rendering Capabilities", () => {
    it("renders a single JSX child element correctly", () => {
      render(
        <ul>
          <CurrencyCard>
            <div data-testid="card-child">USD - United States Dollar</div>
          </CurrencyCard>
        </ul>,
      );

      const child = screen.getByTestId("card-child");
      expect(child).toBeInTheDocument();
      expect(child).toHaveTextContent("USD - United States Dollar");
    });

    it("renders multiple child elements while maintaining DOM hierarchy", () => {
      render(
        <ul>
          <CurrencyCard>
            <span data-testid="flag">🇺🇸</span>
            <span data-testid="code">USD</span>
            <span data-testid="rate">1.00</span>
          </CurrencyCard>
        </ul>,
      );

      const listItem = screen.getByRole("listitem");
      expect(listItem.children).toHaveLength(3);
      expect(screen.getByTestId("flag")).toHaveTextContent("🇺🇸");
      expect(screen.getByTestId("code")).toHaveTextContent("USD");
      expect(screen.getByTestId("rate")).toHaveTextContent("1.00");
    });

    it("renders raw text nodes as children", () => {
      render(
        <ul>
          <CurrencyCard>Raw text content</CurrencyCard>
        </ul>,
      );

      const listItem = screen.getByRole("listitem");
      expect(listItem).toHaveTextContent("Raw text content");
    });

    it("handles conditional or falsy children without throwing an error", () => {
      render(
        <ul>
          <CurrencyCard>
            {null}
            {undefined}
            {false}
          </CurrencyCard>
        </ul>,
      );

      const listItem = screen.getByRole("listitem");
      expect(listItem).toBeInTheDocument();
      expect(listItem).toBeEmptyDOMElement();
    });
  });
});
