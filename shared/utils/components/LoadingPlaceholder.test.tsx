import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingPlaceholder } from "./LoadingPlaceholder";

describe("LoadingPlaceholder", () => {
  it("renders with default py-10 padding and animate-pulse class", () => {
    const { container } = render(<LoadingPlaceholder />);

    const wrapper = container.firstChild as HTMLDivElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass("py-10", "animate-pulse");
  });

  it("combines custom className with the mandatory animate-pulse animation class", () => {
    const { container } = render(
      <LoadingPlaceholder className="h-32 w-full my-4" />,
    );

    const wrapper = container.firstChild as HTMLDivElement;
    expect(wrapper).toHaveClass("h-32", "w-full", "my-4", "animate-pulse");
  });

  it("renders accessible screen-reader text within the sr-only span when text prop is provided", () => {
    render(<LoadingPlaceholder text="Loading historical currency data..." />);

    const srText = screen.getByText("Loading historical currency data...");
    expect(srText).toBeInTheDocument();
    expect(srText.tagName).toBe("SPAN");
    expect(srText).toHaveClass("sr-only");
  });

  it("renders an empty sr-only span safely when text prop is omitted", () => {
    const { container } = render(<LoadingPlaceholder />);

    const span = container.querySelector("span");
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass("sr-only");
    expect(span?.textContent).toBe("");
  });
});
