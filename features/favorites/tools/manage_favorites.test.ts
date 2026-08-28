import { beforeEach, describe, expect, it, vi } from "vitest";
import { getFavorites, toggleFavorite } from "../actions";
import { manage_favorites } from "./manage_favorites";

vi.mock("../actions", () => ({
  getFavorites: vi.fn(),
  toggleFavorite: vi.fn(),
}));

describe("manage_favorites AI Tool Integration Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Metadata & Definition", () => {
    it("has correct description and tool structure", () => {
      expect(manage_favorites.description).toBe(
        "Manage the user's favorite currency pairs. Can list, add, or remove currency pairs.",
      );
      expect(manage_favorites.execute).toBeDefined();
    });
  });

  describe("Execution Flow: 'list'", () => {
    it("executes list flow and returns favorites from actions", async () => {
      const mockPairs: Array<`${string}-${string}`> = ["USD-EUR", "GBP-JPY"];
      vi.mocked(getFavorites).mockResolvedValue(mockPairs);

      // AI SDK tools expose .execute(input, options)
      const result = await manage_favorites.execute(
        { action: "list" },
        { toolCallId: "test-call-1", messages: [], context: {} },
      );

      expect(getFavorites).toHaveBeenCalledOnce();
      expect(toggleFavorite).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        favorites: mockPairs,
      });
    });

    it("handles empty favorites list gracefully", async () => {
      vi.mocked(getFavorites).mockResolvedValue([]);

      const result = await manage_favorites.execute(
        { action: "list" },
        { toolCallId: "test-call-2", messages: [], context: {} },
      );

      expect(result).toEqual({
        success: true,
        favorites: [],
      });
    });
  });

  describe("Execution Flow: 'add' and 'remove'", () => {
    it("transforms input (trim/uppercase) and triggers toggleFavorite for 'add'", async () => {
      vi.mocked(toggleFavorite).mockResolvedValue({ success: true });

      const result = await manage_favorites.execute(
        { action: "add", base: " usd  ", quote: "eur " },
        { toolCallId: "test-call-3", messages: [], context: {} },
      );

      expect(toggleFavorite).toHaveBeenCalledOnce();
      expect(toggleFavorite).toHaveBeenCalledWith({
        base: "USD",
        quote: "EUR",
      });
      expect(result).toEqual({
        revalidate: true,
        success: true,
        message: "Toggled USD/EUR to favorites.",
        error: undefined,
      });
    });

    it("triggers toggleFavorite for 'remove'", async () => {
      vi.mocked(toggleFavorite).mockResolvedValue({ success: true });

      const result = await manage_favorites.execute(
        { action: "remove", base: "GBP", quote: "JPY" },
        { toolCallId: "test-call-4", messages: [], context: {} },
      );

      expect(toggleFavorite).toHaveBeenCalledWith({
        base: "GBP",
        quote: "JPY",
      });
      expect(result).toEqual({
        revalidate: true,
        success: true,
        message: "Toggled GBP/JPY to favorites.",
        error: undefined,
      });
    });
  });

  describe("Error propagation & failure handling", () => {
    it("returns error response when underlying storage action fails", async () => {
      vi.mocked(getFavorites).mockRejectedValue(
        new Error("Database connection lost"),
      );

      const result = await manage_favorites.execute(
        { action: "list" },
        { toolCallId: "test-call-5", messages: [], context: {} },
      );

      expect(result).toEqual({
        success: false,
        error: "Database connection lost",
      });
    });

    it("returns failure output when toggleFavorite returns success: false", async () => {
      vi.mocked(toggleFavorite).mockResolvedValue({
        success: false,
        error: new Error("Rate limit exceeded"),
      });

      const result = await manage_favorites.execute(
        { action: "add", base: "USD", quote: "EUR" },
        { toolCallId: "test-call-6", messages: [], context: {} },
      );

      expect(result).toEqual({
        revalidate: false,
        success: false,
        message: undefined,
        error: "Rate limit exceeded",
      });
    });
  });
});
