import { shouldHaveTestId } from "@/tests";
import { fireEvent, render, screen } from "@testing-library/react";
import { useFormStatus } from "react-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoadingSubmit } from "./LoadingSubmit";

// Mock react-dom's useFormStatus hook
vi.mock("react-dom", async () => {
  const actual = await vi.importActual<typeof import("react-dom")>("react-dom");
  return {
    ...actual,
    useFormStatus: vi.fn(),
  };
});

describe("LoadingSubmit Component", () => {
  const mockUseFormStatus = vi.mocked(useFormStatus);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Idle State (pending = false)", () => {
    beforeEach(() => {
      mockUseFormStatus.mockReturnValue({
        pending: false,
        data: null,
        method: null,
        action: null,
      });
    });

    it("renders children content and remains enabled", () => {
      render(<LoadingSubmit>Convert Currency</LoadingSubmit>);

      const button = screen.getByRole("button", { name: "Convert Currency" });
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
      expect(button).toHaveAttribute("type", "submit");
    });

    it("does not render loading text or spinner icon when idle", () => {
      render(
        <LoadingSubmit text="Processing..." icon="spinner">
          Save Settings
        </LoadingSubmit>,
      );

      expect(screen.queryByText("Processing...")).not.toBeInTheDocument();
      expect(screen.getByRole("button")).not.toContainHTML("animate-spin");
    });

    it("preserves custom className without appending opacity-50", () => {
      render(
        <LoadingSubmit className="btn-primary px-4">Submit</LoadingSubmit>,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("btn-primary", "px-4");
      expect(button).not.toHaveClass("opacity-50");
    });

    it("handles undefined className gracefully without rendering 'undefined'", () => {
      render(<LoadingSubmit>Submit</LoadingSubmit>);

      const button = screen.getByRole("button");
      expect(button.className.trim()).toBe("");
    });

    it("triggers user interaction events like onClick when enabled", () => {
      const handleClick = vi.fn();
      render(<LoadingSubmit onClick={handleClick}>Click Me</LoadingSubmit>);

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Pending / Loading State (pending = true)", () => {
    beforeEach(() => {
      mockUseFormStatus.mockReturnValue({
        pending: true,
        data: new FormData(),
        method: "POST",
        action: "/api/convert",
      });
    });

    it("disables the button and hides children content", () => {
      render(<LoadingSubmit>Save Profile</LoadingSubmit>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(screen.queryByText("Save Profile")).not.toBeInTheDocument();
    });

    it("renders default loading text ('Submitting...') and default spinner icon ('arrow-repeat')", () => {
      render(<LoadingSubmit>Save Profile</LoadingSubmit>);

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Submitting...");

      const icon = button.querySelector("i");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass(
        "bi",
        "bi-arrow-repeat",
        "inline-block",
        "animate-spin",
      );
    });

    it("renders custom loading text and custom icon prop when provided", () => {
      render(
        <LoadingSubmit text="Calculating FX Rates..." icon="arrow-clockwise">
          Calculate
        </LoadingSubmit>,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Calculating FX Rates...");

      const icon = button.querySelector("i");
      expect(icon).toHaveClass("bi-arrow-clockwise");
    });

    it("appends opacity-50 class to existing custom classes", () => {
      render(
        <LoadingSubmit className="bg-blue-500 text-white">
          Submit
        </LoadingSubmit>,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-blue-500", "text-white", "opacity-50");
    });

    it("applies opacity-50 even if no initial className is provided", () => {
      render(<LoadingSubmit>Submit</LoadingSubmit>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("opacity-50");
    });

    it("prevents onClick user triggers when disabled by form pending state", () => {
      const handleClick = vi.fn();
      render(<LoadingSubmit onClick={handleClick}>Submit</LoadingSubmit>);

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases & Prop Overrides", () => {
    it("ensures pending=true overrides any explicit disabled=false prop passed in props", () => {
      mockUseFormStatus.mockReturnValue({
        pending: true,
        data: null as unknown as FormData,
        method: "null",
        action: "null",
      });

      // Passing disabled={false} in props before disabled={pending} evaluation
      render(<LoadingSubmit>Submit</LoadingSubmit>);

      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("forwards extra HTML attributes (aria-*, data-*, id, etc.) to the button element", () => {
      mockUseFormStatus.mockReturnValue({
        pending: false,
        data: null,
        method: null,
        action: null,
      });

      render(
        <LoadingSubmit
          id="submit-fx-form"
          data-testid="fx-submit-btn"
          aria-label="Submit Currency Exchange Form"
        >
          Exchange
        </LoadingSubmit>,
      );

      const [button] = shouldHaveTestId("fx-submit-btn");
      expect(button).toHaveAttribute("id", "submit-fx-form");
      expect(button).toHaveAttribute(
        "aria-label",
        "Submit Currency Exchange Form",
      );
    });
  });
});
