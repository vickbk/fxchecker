import { shouldHaveTestId, shouldNotHaveTestId, shouldSee } from "@/tests";
import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConverterCard } from "./ConverterCard";

vi.mock("./RateCard", () => ({
  RateCard: ({ isSend }: { isSend?: boolean }) => (
    <div data-testid="rate-card" data-issend={String(!!isSend)} />
  ),
}));

vi.mock("./Swapper", () => ({
  Swapper: () => <div data-testid="swapper" />,
}));

vi.mock("./ConvertActions", () => ({
  ConverterActions: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="converter-actions">{children}</div>
  ),
}));

describe("ConverterCard Component (Async Server Component)", () => {
  const mockFavoriteToggle = (
    <button data-testid="favorite-toggle">Favorite</button>
  );
  const mockConversionLogger = (
    <button data-testid="conversion-logger">Log</button>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering & Markup Structure", () => {
    it("renders top-level heading 'Check the rate' with correct typography classes", async () => {
      const jsx = await ConverterCard({
        favoriteToggle: mockFavoriteToggle,
        conversionLogger: mockConversionLogger,
      });
      render(jsx);

      shouldSee("Check the rate");
    });

    it("applies container layout classes to outer and inner wrappers", async () => {
      const jsx = await ConverterCard({
        favoriteToggle: mockFavoriteToggle,
        conversionLogger: mockConversionLogger,
      });
      const { container } = render(jsx);

      const outerCard = container.querySelector("article");
      expect(outerCard).toHaveClass("p-4");

      const cardBody = container.querySelector(".bg-background-secondary");
      expect(cardBody).toBeInTheDocument();
      expect(cardBody).toHaveClass(
        "flex",
        "flex-col",
        "gap-4",
        "bg-background-secondary",
        "rounded-2xl",
        "mt-4",
      );

      const gridContainer = container.querySelector(
        ".grid-cols-\\[1fr_auto_1fr\\]",
      );
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass(
        "p-4",
        "flex",
        "flex-col",
        "sm:grid",
        "gap-4",
        "pb-0",
      );
    });
  });

  describe("Sub-component Composition", () => {
    it("renders Send and Receive RateCards in correct order", async () => {
      const jsx = await ConverterCard({
        favoriteToggle: mockFavoriteToggle,
        conversionLogger: mockConversionLogger,
      });
      render(jsx);

      const rateCards = screen.getAllByTestId("rate-card");
      expect(rateCards).toHaveLength(2);

      // First RateCard has isSend = true
      expect(rateCards[0]).toHaveAttribute("data-issend", "true");
      // Second RateCard has isSend = false (undefined default)
      expect(rateCards[1]).toHaveAttribute("data-issend", "false");
    });

    it("renders Swapper component between RateCard instances", async () => {
      const jsx = await ConverterCard({
        favoriteToggle: mockFavoriteToggle,
        conversionLogger: mockConversionLogger,
      });
      render(jsx);

      shouldHaveTestId("swapper");
    });

    it("renders ConverterActions wrapper component", async () => {
      const jsx = await ConverterCard({
        favoriteToggle: mockFavoriteToggle,
        conversionLogger: mockConversionLogger,
      });
      render(jsx);

      shouldHaveTestId("converter-actions");
    });
  });

  describe("Slots & Prop Injection", () => {
    it("renders favoriteToggle and conversionLogger inside unordered list items", async () => {
      const jsx = await ConverterCard({
        favoriteToggle: mockFavoriteToggle,
        conversionLogger: mockConversionLogger,
      });
      render(jsx);

      const [favToggle, convLogger] = shouldHaveTestId(
        "favorite-toggle",
        "conversion-logger",
      );

      const list = favToggle.closest("ul");
      expect(list).toBeInTheDocument();
      expect(list).toHaveClass(
        "uppercase",
        "flex",
        "justify-center",
        "items-center",
        "flex-wrap",
        "gap-4",
        "sm:ml-auto",
      );

      expect(favToggle.parentElement?.tagName).toBe("LI");
      expect(convLogger.parentElement?.tagName).toBe("LI");
    });

    it("handles null or optional ReactNode values for slots gracefully", async () => {
      const jsx = await ConverterCard({
        favoriteToggle: null,
        conversionLogger: <span data-testid="custom-node">Custom Node</span>,
      });
      render(jsx);

      shouldNotHaveTestId("favorite-toggle");
      shouldHaveTestId("custom-node");
    });
  });
});
