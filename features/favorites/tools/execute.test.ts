import { beforeEach, describe, expect, it, vi } from "vitest";
import { execute } from "./execute";
import { handleFavoriteToggle } from "./handle-favorite-toggle";
import { listFavorites } from "./list-favorites";

vi.mock("./list-favorites", () => ({
  listFavorites: vi.fn(),
}));

vi.mock("./handle-favorite-toggle", () => ({
  handleFavoriteToggle: vi.fn(),
}));

describe("execute orchestrator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("action: 'list'", () => {
    it("invokes listFavorites and returns result without requiring base/quote", async () => {
      const mockListResult = {
        success: true,
        favorites: ["USD-EUR" as `${string}-${string}`],
      };
      vi.mocked(listFavorites).mockResolvedValue(mockListResult);

      const result = await execute({ action: "list" });

      expect(listFavorites).toHaveBeenCalledOnce();
      expect(handleFavoriteToggle).not.toHaveBeenCalled();
      expect(result).toEqual(mockListResult);
    });

    it("catches errors thrown by listFavorites and returns structured error object", async () => {
      vi.mocked(listFavorites).mockRejectedValue(
        new Error("Storage unavailable"),
      );

      const result = await execute({ action: "list" });

      expect(result).toEqual({
        success: false,
        error: "Storage unavailable",
      });
    });
  });

  describe("action: 'add' and 'remove'", () => {
    it("invokes handleFavoriteToggle with base and quote for 'add'", async () => {
      const mockToggleResult = {
        revalidate: true,
        success: true,
        message: "Toggled USD/EUR to favorites.",
        error: undefined,
      };
      vi.mocked(handleFavoriteToggle).mockResolvedValue(mockToggleResult);

      const result = await execute({
        action: "add",
        base: "USD",
        quote: "EUR",
      });

      expect(handleFavoriteToggle).toHaveBeenCalledOnce();
      expect(handleFavoriteToggle).toHaveBeenCalledWith({
        base: "USD",
        quote: "EUR",
      });
      expect(listFavorites).not.toHaveBeenCalled();
      expect(result).toEqual(mockToggleResult);
    });

    it("invokes handleFavoriteToggle with base and quote for 'remove'", async () => {
      const mockToggleResult = {
        revalidate: true,
        success: true,
        message: "Toggled GBP/JPY to favorites.",
        error: undefined,
      };
      vi.mocked(handleFavoriteToggle).mockResolvedValue(mockToggleResult);

      const result = await execute({
        action: "remove",
        base: "GBP",
        quote: "JPY",
      });

      expect(handleFavoriteToggle).toHaveBeenCalledOnce();
      expect(handleFavoriteToggle).toHaveBeenCalledWith({
        base: "GBP",
        quote: "JPY",
      });
      expect(result).toEqual(mockToggleResult);
    });

    it.each([
      { action: "add", base: "", quote: "EUR", desc: "empty base" },
      { action: "add", base: "USD", quote: "", desc: "empty quote" },
      {
        action: "remove",
        base: undefined,
        quote: "JPY",
        desc: "undefined base",
      },
      {
        action: "remove",
        base: "GBP",
        quote: undefined,
        desc: "undefined quote",
      },
    ])(
      "returns error response when $desc for action $action",
      async ({ action, base, quote }) => {
        const result = await execute({
          action: action as "add" | "remove",
          base: base as unknown as string,
          quote: quote as unknown as string,
        });

        expect(handleFavoriteToggle).not.toHaveBeenCalled();
        expect(result).toEqual({
          success: false,
          error:
            "Both base and quote currency codes are required to add or remove a favorite.",
        });
      },
    );

    it("catches errors thrown by handleFavoriteToggle and formats error message", async () => {
      vi.mocked(handleFavoriteToggle).mockImplementation(async () => {
        throw new Error("Network timeout");
      });

      const result = await execute({
        action: "add",
        base: "USD",
        quote: "EUR",
      });

      expect(result).toEqual({
        success: false,
        error: "Network timeout",
      });
    });
  });

  describe("invalid actions and fallback error handling", () => {
    it("returns 'Invalid Action' error when action is unrecognized", async () => {
      const result = await execute({
        action: "unknown_action" as unknown as "add",
        base: "USD",
        quote: "EUR",
      });

      expect(result).toEqual({
        success: false,
        error: "Invalid Action",
      });
    });

    it("returns default fallback error message when thrown value is not an Error instance", async () => {
      vi.mocked(listFavorites).mockRejectedValue("String exception throwing");

      const result = await execute({ action: "list" });

      expect(result).toEqual({
        success: false,
        error: "Failed to execute favorites action.",
      });
    });
  });
});
