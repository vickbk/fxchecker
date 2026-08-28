import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteCompareCurrencies } from "../actions";
import { removeCompare } from "./remove-compare";

vi.mock("../actions", () => ({ deleteCompareCurrencies: vi.fn() }));

describe("removeCompare", () => {
  const data = { action: "remove" as const, currencies: ["USD", "EUR"] };
  beforeEach(() => vi.clearAllMocks());

  it("removes currencies successfully", async () => {
    vi.mocked(deleteCompareCurrencies).mockResolvedValue(true);
    await expect(removeCompare(data)).resolves.toEqual({
      success: true,
      revalidate: true,
      action: "remove",
      currencies: data.currencies,
      error: undefined,
    });
    expect(deleteCompareCurrencies).toHaveBeenCalledWith(data.currencies);
  });

  it("returns a failure when the mutation is falsy", async () => {
    vi.mocked(deleteCompareCurrencies).mockResolvedValue(false);
    await expect(removeCompare(data)).rejects.toThrow(
      "Failed to remove USD, EUR from the compare list.",
    );
  });

  it.each([undefined, []])(
    "rejects missing or empty currencies: %j",
    async (currencies) => {
      await expect(
        // @ts-expect-error as missing or empty currencies for remove action is not accepted
        removeCompare({ action: "remove", currencies }),
      ).rejects.toThrow(
        "At least one valid 3-letter currency code is required to remove items.",
      );
      expect(deleteCompareCurrencies).not.toHaveBeenCalled();
    },
  );

  it("rejects data for another action", async () => {
    await expect(removeCompare({ action: "list" })).rejects.toThrow(
      "Invalid action provided",
    );
  });
});
