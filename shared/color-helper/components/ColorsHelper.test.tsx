import { render, screen } from "@testing-library/react";
import { shouldNotSee, shouldSee } from "@tests/vitest";

import userEvent from "@testing-library/user-event";
import { ColorsHelper } from "./ColorsHelper";

const user = userEvent.setup();
describe("ColorsHelper Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockStyleGuideInput = `Neutral 900: hsl(0, 0%, 7%)
Neutral 800: hsl(0, 0%, 15%)
Blue 600: hsl(214, 100%, 55%)`;

  const mockStyleGuideInputWithAsterisk = `*Neutral 900: hsl(0, 0%, 7%)
Neutral 800: hsl(0, 0%, 15%)`;

  it("should render textarea for color input", () => {
    render(<ColorsHelper />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should render textarea with correct attributes", () => {
    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("required");
    expect(textarea).toHaveAttribute("rows", "5");
  });

  it("should parse style guide format colors correctly", async () => {
    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, mockStyleGuideInput);

    await shouldSee(
      /neutral-900:0 0% 7%/,
      /neutral-800:0 0% 15%/,
      /blue-600:214 100% 55%/,
    );
  });

  it("should handle colors with asterisk prefix", async () => {
    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, mockStyleGuideInputWithAsterisk);

    await shouldSee(/neutral-900:0 0% 7%/, /neutral-800:0 0% 15%/);
  });

  it("should handle empty lines gracefully", async () => {
    const inputWithEmptyLines = `Neutral 900: hsl(0, 0%, 7%)

Neutral 800: hsl(0, 0%, 15%)`;
    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, inputWithEmptyLines);

    await shouldSee(/neutral-900:0 0% 7%/, /neutral-800:0 0% 15%/);
  });

  it("should convert spaces to hyphens in color names", async () => {
    const input = "Light Blue: hsl(210, 100%, 65%)";
    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, input);

    await shouldSee(/light-blue:210 100% 65%/);
  });

  it("should convert color names to lowercase", async () => {
    const input = "NEUTRAL 900: hsl(0, 0%, 7%)";
    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, input);
    await shouldSee(/neutral-900:0 0% 7%/);
  });

  it("should remove parenthetical details from color names", async () => {
    const input = "Neutral 900 (some detail): hsl(0, 0%, 7%)";
    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, input);

    await shouldSee(/neutral-900:0 0% 7%/);
  });

  it("should render SASS output section when colors are entered", async () => {
    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, mockStyleGuideInput);
    await shouldSee(/SASS Variables/);
  });

  it("should render Tailwind output section when colors are entered", async () => {
    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, mockStyleGuideInput);

    await shouldSee(/Tailwind CSS v4/);
  });

  it("should generate correct Tailwind CSS v4 output", async () => {
    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, mockStyleGuideInput);

    await shouldSee(/Tailwind CSS v4/);

    const preElements = document.querySelectorAll("pre");
    const tailwindPre = preElements[1];

    expect(tailwindPre).toHaveTextContent(/@theme/);
    expect(tailwindPre).toHaveTextContent(/--color-neutral-900:/);
    expect(tailwindPre).toHaveTextContent(/--color-blue-600:/);
  });

  it("should have copy buttons for each output format", async () => {
    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, mockStyleGuideInput);

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("should copy SASS output to clipboard when copy button is clicked", async () => {
    vi.stubGlobal("navigator", {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");
    await user.type(textarea, mockStyleGuideInput);

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("should copy Tailwind output to clipboard when copy button is clicked", async () => {
    vi.stubGlobal("navigator", {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, mockStyleGuideInput);

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[1]);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("should show copied feedback after copying", async () => {
    vi.stubGlobal("navigator", {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, mockStyleGuideInput);

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);

    await shouldSee(/copied!/i);
    vi.unstubAllGlobals();
  });

  it("should handle invalid input gracefully", async () => {
    const invalidInput = "not a valid color format";
    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, invalidInput);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should handle colors with complex hsl values", async () => {
    const complexInput = "Yellow 400: hsl(49, 85%, 70%)";
    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, complexInput);

    await shouldSee(/yellow-400:49 85% 70%/);
  });

  it("should not render output sections when input is empty", async () => {
    render(<ColorsHelper />);

    await shouldNotSee(/SASS Variables/, /Tailwind CSS v4/);
  });

  it("should display color preview with visual swatches", async () => {
    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, mockStyleGuideInput);

    const swatches = screen.getAllByText(/neutral-900:/);
    expect(swatches.length).toBeGreaterThan(0);
  });

  it("should handle multiple colors with various formats", async () => {
    const multiFormatInput = `Red 500: hsl(354, 63%, 57%)
Green 500: hsl(140, 63%, 57%)
Yellow 400: hsl(49, 85%, 70%)`;
    render(<ColorsHelper />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, multiFormatInput);

    await shouldSee(
      /red-500:354 63% 57%/,
      /green-500:140 63% 57%/,
      /yellow-400:49 85% 70%/,
    );
  });
});
