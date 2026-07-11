import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CustomDetails } from "./CustomDetails";

describe("CustomDetails Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render details element", () => {
    const { container } = render(
      <CustomDetails>
        <summary>Toggle</summary>
        <p>Hidden content</p>
      </CustomDetails>,
    );
    const details = container.querySelector("details");
    expect(details).toBeInTheDocument();
  });

  it("should display children content", () => {
    render(
      <CustomDetails>
        <summary>Toggle</summary>
        <p>Hidden content</p>
      </CustomDetails>,
    );

    expect(screen.getByText("Toggle")).toBeInTheDocument();
    expect(screen.getByText("Hidden content")).toBeInTheDocument();
  });

  it("should close details on outside click", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <CustomDetails>
          <summary>Toggle</summary>
          <p>Content</p>
        </CustomDetails>
        <button>Outside</button>
      </>,
    );

    const details = container.querySelector("details") as HTMLDetailsElement;

    await user.click(await screen.findByText("Toggle"));

    await user.click(await screen.findByText("Outside"));

    await expect(details.hasAttribute("open")).toBe(false);
  });

  it("should keep details open when clicking inside", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CustomDetails>
        <summary>Toggle</summary>
        <button>Inside</button>
      </CustomDetails>,
    );

    const details = container.querySelector("details") as HTMLDetailsElement;

    await user.click(await screen.findByText("Toggle"));
    expect(details.hasAttribute("open")).toBe(true);

    await user.click(await screen.findByText("Inside"));

    expect(details.hasAttribute("open")).toBe(true);
  });

  it("should expose ref to parent", () => {
    const ref = { current: null };
    const { container } = render(
      <CustomDetails ref={ref}>
        <summary>Toggle</summary>
        <p>Content</p>
      </CustomDetails>,
    );

    expect(ref.current).toEqual(container.querySelector("details"));
  });

  it("should support custom className", () => {
    const { container } = render(
      <CustomDetails className="custom-class">
        <summary>Toggle</summary>
        <p>Content</p>
      </CustomDetails>,
    );

    const details = container.querySelector("details");
    expect(details).toHaveClass("custom-class");
  });

  it("should handle click on summary to toggle", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CustomDetails>
        <summary>Click to toggle</summary>
        <p>Details content</p>
      </CustomDetails>,
    );

    const details = container.querySelector("details") as HTMLDetailsElement;

    expect(details.hasAttribute("open")).toBe(false);

    await user.click(await screen.findByText("Click to toggle"));

    await expect(details.hasAttribute("open")).toBe(true);
  });

  it("should cleanup event listeners on unmount", async () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(
      <CustomDetails>
        <summary>Toggle</summary>
        <p>Content</p>
      </CustomDetails>,
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });
});
