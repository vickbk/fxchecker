import { beforeEach, describe, expect, it, vi } from "vitest";
import { toggleFavorite } from "../actions";
import { handleFavoriteToggle } from "./handle-favorite-toggle";

vi.mock("../actions", () => ({
  toggleFavorite: vi.fn(),
}));

describe("handleFavoriteToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success, revalidate: true, and formatted message when toggle succeeds", async () => {
    vi.mocked(toggleFavorite).mockResolvedValue({ success: true });

    const input = { base: "USD", quote: "EUR" };
    const result = await handleFavoriteToggle(input);

    expect(toggleFavorite).toHaveBeenCalledOnce();
    expect(toggleFavorite).toHaveBeenCalledWith({ base: "USD", quote: "EUR" });
    expect(result).toEqual({
      revalidate: true,
      success: true,
      message: "Toggled USD/EUR to favorites.",
      error: undefined,
    });
  });

  it("returns success: false, revalidate: false, and error message when toggle fails", async () => {
    const mockError = new Error("Failed to persist favorite pair in database.");
    vi.mocked(toggleFavorite).mockResolvedValue({
      success: false,
      error: mockError,
    });

    const input = { base: "GBP", quote: "JPY" };
    const result = await handleFavoriteToggle(input);

    expect(toggleFavorite).toHaveBeenCalledOnce();
    expect(toggleFavorite).toHaveBeenCalledWith({ base: "GBP", quote: "JPY" });
    expect(result).toEqual({
      revalidate: false,
      success: false,
      message: undefined,
      error: "Failed to persist favorite pair in database.",
    });
  });

  it("handles failure result safely if error property is undefined", async () => {
    vi.mocked(toggleFavorite).mockResolvedValue({
      success: false,
      error: undefined as unknown as Error,
    });

    const result = await handleFavoriteToggle({ base: "CAD", quote: "CHF" });

    expect(result).toEqual({
      revalidate: false,
      success: false,
      message: undefined,
      error: undefined,
    });
  });

  it("propagates unexpected action rejections directly to caller", async () => {
    vi.mocked(toggleFavorite).mockRejectedValue(
      new Error("Server action unreachable"),
    );

    await expect(
      handleFavoriteToggle({ base: "USD", quote: "EUR" }),
    ).rejects.toThrow("Server action unreachable");
  });
});
