import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CustomDialog from "./CustomDialog";

describe("CustomDialog Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render dialog element", () => {
    const { container } = render(
      <CustomDialog isOpen={true}>
        <p>Dialog content</p>
      </CustomDialog>,
    );
    const dialog = container.querySelector("dialog");
    expect(dialog).toBeInTheDocument();
  });

  it("should display dialog content when open", async () => {
    render(
      <CustomDialog isOpen={true}>
        <p>Dialog content</p>
      </CustomDialog>,
    );

    const content = await screen.findByText("Dialog content");
    expect(content).toBeInTheDocument();
  });

  it("should call onClose when dialog close button clicked", async () => {
    const mockOnClose = vi.fn();
    const { container } = render(
      <CustomDialog isOpen={true} onClose={mockOnClose}>
        <p>Dialog content</p>
      </CustomDialog>,
    );

    const dialog = container.querySelector("dialog") as HTMLDialogElement;

    const closeEvent = new Event("close");
    dialog?.dispatchEvent(closeEvent);

    await expect(mockOnClose).toHaveBeenCalled();
  });

  it("should close dialog when isOpen becomes false", async () => {
    const { rerender, container } = render(
      <CustomDialog isOpen={true}>
        <p>Dialog content</p>
      </CustomDialog>,
    );

    const dialog = container.querySelector("dialog") as HTMLDialogElement;
    expect(dialog).toBeInTheDocument();

    rerender(
      <CustomDialog isOpen={false}>
        <p>Dialog content</p>
      </CustomDialog>,
    );

    await expect(dialog.open).toBe(false);
  });

  it("should show dialog when isOpen becomes true", async () => {
    const { rerender, container } = render(
      <CustomDialog isOpen={false}>
        <p>Dialog content</p>
      </CustomDialog>,
    );

    const dialog = container.querySelector("dialog") as HTMLDialogElement;

    rerender(
      <CustomDialog isOpen={true}>
        <p>Dialog content</p>
      </CustomDialog>,
    );

    await expect(dialog.open).toBe(true);
  });

  it("should support custom className", () => {
    const { container } = render(
      <CustomDialog isOpen={true} className="custom-class">
        <p>Content</p>
      </CustomDialog>,
    );

    const dialog = container.querySelector("dialog");
    expect(dialog).toHaveClass("custom-class");
  });

  it("should render children correctly", () => {
    render(
      <CustomDialog isOpen={true}>
        <h1>Title</h1>
        <p>Content</p>
        <button>Action</button>
      </CustomDialog>,
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("should expose dialog ref", () => {
    const ref = { current: null };
    const { container } = render(
      <CustomDialog ref={ref} isOpen={true}>
        <p>Content</p>
      </CustomDialog>,
    );

    expect(ref.current).toEqual(container.querySelector("dialog"));
  });
});
