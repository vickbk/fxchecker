import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmptySection } from "./EmptySection";

describe("EmptySection", () => {
  it("renders the heading and text content accurately", () => {
    render(
      <EmptySection
        heading="No conversion history"
        text="Start exchanging currencies to build your transaction log."
      />,
    );

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "No conversion history",
    });
    expect(heading).toBeInTheDocument();

    const text = screen.getByText(
      "Start exchanging currencies to build your transaction log.",
    );
    expect(text).toBeInTheDocument();
  });

  it("establishes accessible ARIA linkage between section and heading via crypto.randomUUID", () => {
    const mockUuid = "12345678-1234-1234-1234-123456789abc";
    vi.spyOn(crypto, "randomUUID").mockReturnValue(mockUuid);

    const { container } = render(
      <EmptySection
        heading="Empty Favorites"
        text="Add currencies to your watch list."
      />,
    );

    const section = container.querySelector("section");
    const heading = screen.getByRole("heading", { level: 2 });

    expect(section).toHaveAttribute("aria-describedby", mockUuid);
    expect(heading).toHaveAttribute("id", mockUuid);

    vi.restoreAllMocks();
  });

  it("renders optional child elements when provided", () => {
    render(
      <EmptySection heading="No Saved Items" text="You have no saved presets.">
        <button type="button">Reset Filters</button>
      </EmptySection>,
    );

    const button = screen.getByRole("button", { name: "Reset Filters" });
    expect(button).toBeInTheDocument();
  });

  it("renders cleanly without throwing or rendering extra DOM nodes when children are omitted", () => {
    const { container } = render(
      <EmptySection heading="Standalone Notice" text="Notice description." />,
    );

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    expect(section?.children).toHaveLength(2); // Only h2 and p
  });
});
