import { beforeEach, describe, expect, it, vi } from "vitest";
import { addCompareCurrencies } from "../actions";
import { addCompare } from "./add-compare";

vi.mock("../actions", () => ({ addCompareCurrencies: vi.fn() }));

describe("addCompare", () => {
  const data = { action: "add" as const, currencies: ["USD", "EUR"] };
  beforeEach(() => vi.clearAllMocks());

  it("adds currencies successfully", async () => {
    vi.mocked(addCompareCurrencies).mockResolvedValue(true);
    await expect(addCompare(data)).resolves.toEqual({
      success: true,
      revalidate: true,
      action: "add",
      currencies: data.currencies,
      error: undefined,
    });
    expect(addCompareCurrencies).toHaveBeenCalledWith(data.currencies);
  });

  it("returns a failure when the mutation is falsy", async () => {
    vi.mocked(addCompareCurrencies).mockResolvedValue(false);
    await expect(addCompare(data)).rejects.toThrow(
      "Failed to add USD, EUR to the compare list.",
    );
  });

  it.each([undefined, []])(
    "rejects missing or empty currencies: %j",
    async (currencies) => {
      // @ts-expect-error as missing or empty currencies for add is not accepted
      await expect(addCompare({ action: "add", currencies })).rejects.toThrow(
        "At least one valid 3-letter currency code is required to add items.",
      );
      expect(addCompareCurrencies).not.toHaveBeenCalled();
    },
  );

  it("rejects data for another action", async () => {
    await expect(addCompare({ action: "list" })).rejects.toThrow(
      "Invalid action provided",
    );
  });
});
