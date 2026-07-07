import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SROnly } from "./SROnly";

describe("SROnly Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render sr-only span", () => {
    const { container } = render(<SROnly>Screen reader only text</SROnly>);
    const span = container.querySelector("span.sr-only");

    expect(span).toBeInTheDocument();
  });

  it("should display text content", async () => {
    render(<SROnly>Accessible text</SROnly>);
    await expect(
      await screen.findByText("Accessible text"),
    ).toBeInTheDocument();
  });

  it("should have sr-only class", () => {
    const { container } = render(<SROnly>Test</SROnly>);
    const span = container.querySelector("span");

    expect(span).toHaveClass("sr-only");
  });

  it("should support react nodes as children", async () => {
    render(
      <SROnly>
        <span>Nested</span> content
      </SROnly>,
    );

    expect(await screen.findByText("Nested")).toBeInTheDocument();
    expect(await screen.findByText(/content/)).toBeInTheDocument();
  });

  it("should render with multiple text nodes", () => {
    const { container } = render(<SROnly>Go to Page 2</SROnly>);

    const text = container.querySelector(".sr-only")?.textContent;
    expect(text).toContain("Go to Page");
    expect(text).toContain("2");
  });
});
