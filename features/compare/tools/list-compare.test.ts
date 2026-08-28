import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCompareRates } from "../actions";
import { getCompareList } from "./list-compare";

vi.mock("../actions", () => ({ getCompareRates: vi.fn() }));

describe("getCompareList", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns retrieved compare data", async () => {
    const compareList = [{ quote: "EUR", rate: 1.08 }];
    vi.mocked(getCompareRates).mockResolvedValue(compareList as never);

    await expect(getCompareList({ action: "list" })).resolves.toEqual({
      success: true,
      compareList,
    });
    expect(getCompareRates).toHaveBeenCalledOnce();
  });

  it("propagates retrieval errors", async () => {
    vi.mocked(getCompareRates).mockRejectedValue(new Error("Lookup failed"));
    await expect(getCompareList({ action: "list" })).rejects.toThrow(
      "Lookup failed",
    );
  });

  it("rejects data for another action", async () => {
    await expect(
      getCompareList({ action: "add", currencies: ["USD"] }),
    ).rejects.toThrow("Invalid action provided");
    expect(getCompareRates).not.toHaveBeenCalled();
  });
});
