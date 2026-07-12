import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CurrencyPicker } from "./CurrencyPicker";

const currencies: CurrencyOption[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
];

describe("CurrencyPicker", () => {
  it("filters visible options as the user types into the search field", async () => {
    const user = userEvent.setup();

    render(<CurrencyPicker currencies={currencies} onSelect={vi.fn()} />);

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    const searchInput = screen.getByPlaceholderText(/search currencies/i);
    await user.type(searchInput, "ch");

    expect(screen.getByText("CHF")).toBeInTheDocument();
    expect(screen.queryByText("USD")).not.toBeInTheDocument();
    expect(screen.queryByText("EUR")).not.toBeInTheDocument();
  });

  it("supports keyboard navigation, selection, and dismissal semantics", async () => {
    const user = userEvent.setup();

    render(<CurrencyPicker currencies={currencies} onSelect={vi.fn()} />);

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    expect(combobox).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(screen.getAllByRole("option")[1]).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await user.keyboard("{ArrowUp}");
    expect(screen.getAllByRole("option")[0]).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await user.keyboard("{Enter}");
    expect(combobox).toHaveAttribute("aria-expanded", "false");

    await user.click(combobox);
    await user.keyboard("{Escape}");
    expect(combobox).toHaveAttribute("aria-expanded", "false");
  });

  it("shows a stable empty state when no currencies match the search", async () => {
    const user = userEvent.setup();

    render(<CurrencyPicker currencies={currencies} onSelect={vi.fn()} />);

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    const searchInput = screen.getByPlaceholderText(/search currencies/i);
    await user.type(searchInput, "zzz");

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    expect(screen.getByTestId("currency-picker-options")).toHaveClass(
      "min-h-48",
    );
  });
});
