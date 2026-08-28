import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SRHidden } from "./SRHidden";

describe("SRHidden", () => {
  it("renders a span element with the aria-hidden attribute", () => {
    const { container } = render(<SRHidden>Decorative Icon</SRHidden>);

    const span = container.querySelector("span");
    expect(span).toBeInTheDocument();
    expect(span).toHaveAttribute("aria-hidden", "true");
    expect(span).toHaveTextContent("Decorative Icon");
  });

  it("ensures aria-hidden remains true even if aria-hidden=false is explicitly passed in props", () => {
    const { container } = render(
      <SRHidden aria-hidden={false}>Visually Decorative</SRHidden>,
    );

    const span = container.querySelector("span");
    expect(span).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards standard HTML attributes (className, id, style, data-*) to the span", () => {
    render(
      <SRHidden
        id="decorative-star-icon"
        className="inline-block text-accent opacity-80"
        style={{ cursor: "pointer" }}
        data-testid="decorative-span"
      >
        ★
      </SRHidden>,
    );

    const span = screen.getByTestId("decorative-span");
    expect(span).toHaveAttribute("id", "decorative-star-icon");
    expect(span).toHaveClass("inline-block", "text-accent", "opacity-80");
    expect(span).toHaveStyle({ cursor: "pointer" });
  });

  it("renders complex nested children cleanly", () => {
    render(
      <SRHidden data-testid="nested-container">
        <i className="bi bi-currency-exchange" />
        <span>Sub-label</span>
      </SRHidden>,
    );

    const container = screen.getByTestId("nested-container");
    expect(container.children).toHaveLength(2);
    expect(container.querySelector("i")).toHaveClass(
      "bi",
      "bi-currency-exchange",
    );
  });

  it("forwards event listeners such as onClick", () => {
    const handleClick = vi.fn();
    render(
      <SRHidden data-testid="interactive-span" onClick={handleClick}>
        Interactive Visual
      </SRHidden>,
    );

    fireEvent.click(screen.getByTestId("interactive-span"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
