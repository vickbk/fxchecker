import { beforeEach, describe, expect, it, vi } from "vitest";
import { getFavorites } from "../actions";
import { listFavorites } from "./list-favorites";

vi.mock("../actions", () => {
  return {
    getFavorites: vi.fn(),
  };
});

describe("listFavorites", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns success: true and the list when getFavorites returns populated pairs", async () => {
    const mockData: Array<`${string}-${string}`> = ["USD-EUR", "GBP-JPY"];
    const spy = vi.mocked(getFavorites).mockResolvedValue(mockData);

    const result = await listFavorites();

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith();
    expect(result).toEqual({
      success: true,
      favorites: mockData,
    });
  });

  it("returns success: true and empty array when getFavorites returns []", async () => {
    // Boolean([]) evaluates to true in JS/TS
    const spy = vi.mocked(getFavorites).mockResolvedValue([]);

    const result = await listFavorites();

    expect(spy).toHaveBeenCalledOnce();
    expect(result).toEqual({
      success: true,
      favorites: [],
    });
  });

  it("returns success: false and undefined when getFavorites returns undefined", async () => {
    vi.mocked(getFavorites).mockResolvedValue(undefined);

    const result = await listFavorites();

    expect(getFavorites).toHaveBeenCalledOnce();
    expect(result).toEqual({
      success: false,
      favorites: undefined,
    });
  });

  it("propagates unhandled promise rejections if getFavorites fails", async () => {
    const mockError = new Error("Failed to read storage");
    vi.mocked(getFavorites).mockRejectedValue(mockError);

    await expect(listFavorites()).rejects.toThrow("Failed to read storage");
  });
});
