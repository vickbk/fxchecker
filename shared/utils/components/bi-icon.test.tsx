import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BiIcon } from "./bi-icon";

describe("Icon Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render icon element with correct class", () => {
    const { container } = render(<BiIcon name="heart" />);
    const icon = container.querySelector("i");

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("bi");
    expect(icon).toHaveClass("bi-heart");
  });

  it("should apply bootstrap icon class prefix", () => {
    const { container } = render(<BiIcon name="search" />);
    const icon = container.querySelector("i");

    expect(icon).toHaveClass("bi-search");
  });

  it("should handle icon names with modifiers", () => {
    const { container } = render(<BiIcon name="sun-fill c-yellow-400" />);
    const icon = container.querySelector("i");

    expect(icon).toHaveClass("bi-sun-fill");
    expect(icon).toHaveClass("c-yellow-400");
  });

  it("should render multiple class names", () => {
    const { container } = render(
      <BiIcon name="check-circle-fill c-green-500 text-lg" />,
    );
    const icon = container.querySelector("i");

    expect(icon).toHaveClass("bi-check-circle-fill");
    expect(icon).toHaveClass("c-green-500");
    expect(icon).toHaveClass("text-lg");
  });

  it("should support custom icon names", () => {
    const { container } = render(<BiIcon name="star" />);
    const icon = container.querySelector("i");

    expect(icon).toHaveClass("bi-star");
  });
});
