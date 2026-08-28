import { ResolveType } from "@/shared/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addCompareCurrencies,
  deleteCompareCurrencies,
  getCompareRates,
} from "../actions";
import { manage_compare } from "./manage-compare";

vi.mock("../actions", () => ({
  addCompareCurrencies: vi.fn(),
  deleteCompareCurrencies: vi.fn(),
  getCompareRates: vi.fn(),
}));

describe("manage_compare tool integration", () => {
  const mockAddCompareCurrencies = vi.mocked(addCompareCurrencies);
  const mockDeleteCompareCurrencies = vi.mocked(deleteCompareCurrencies);
  const mockGetCompareRates = vi.mocked(getCompareRates);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Tool Metadata", () => {
    it("exposes the correct tool description", () => {
      expect(manage_compare.description).toBe(
        "Manage the user's currency comparison list. Can list current currencies, or add/remove 3-letter ISO currency codes (e.g., USD, EUR, JPY).",
      );
    });

    it("attaches inputSchema to the tool definition", () => {
      expect(manage_compare.inputSchema).toBeDefined();
    });
  });

  describe("Integration: Tool Execution Flow", () => {
    it("executes 'list' action successfully through the tool pipeline", async () => {
      const mockRates = [
        { code: "USD", rate: 1.0 },
        { code: "EUR", rate: 0.92 },
      ];
      mockGetCompareRates.mockResolvedValueOnce(
        mockRates as unknown as ResolveType<typeof mockGetCompareRates>,
      );

      const payload = { action: "list" as const };
      const result = await manage_compare.execute!(payload, {
        toolCallId: "call_list_01",
        messages: [],
        context: {},
      });

      expect(mockGetCompareRates).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ success: true, compareList: mockRates });
    });

    it("executes 'add' action with schema transformation through the tool pipeline", async () => {
      mockAddCompareCurrencies.mockResolvedValueOnce(true);

      const payload = {
        action: "add" as const,
        currencies: [" usd ", "eur"],
      };

      const result = await manage_compare.execute!(payload, {
        toolCallId: "call_add_01",
        messages: [],
        context: {},
      });

      expect(mockAddCompareCurrencies).toHaveBeenCalledWith(["USD", "EUR"]);
      expect(result).toEqual({
        success: true,
        revalidate: true,
        action: "add",
        currencies: ["USD", "EUR"],
      });
    });

    it("executes 'remove' action successfully through the tool pipeline", async () => {
      mockDeleteCompareCurrencies.mockResolvedValueOnce(true);

      const payload = {
        action: "remove" as const,
        currencies: ["jpy"],
      };

      const result = await manage_compare.execute!(payload, {
        toolCallId: "call_remove_01",
        messages: [],
        context: {},
      });

      expect(mockDeleteCompareCurrencies).toHaveBeenCalledWith(["JPY"]);
      expect(result).toEqual({
        success: true,
        revalidate: true,
        action: "remove",
        currencies: ["JPY"],
      });
    });
  });

  describe("Integration: Error Boundary & Edge Cases", () => {
    it("returns formatted error response when Zod schema validation fails", async () => {
      const invalidPayload = {
        action: "add",
        currencies: ["INVALID_CODE"],
      } as unknown as Parameters<NonNullable<typeof manage_compare.execute>>[0];

      const result = await manage_compare.execute!(invalidPayload, {
        toolCallId: "call_invalid_schema",
        messages: [],
        context: {},
      });

      expect(result).toEqual({
        success: false,
        error: expect.any(String),
      });
      expect(mockAddCompareCurrencies).not.toHaveBeenCalled();
    });

    it("returns formatted error response when 'add' action receives an empty array", async () => {
      const payload = {
        action: "add" as const,
        currencies: [],
      };

      const result = await manage_compare.execute!(payload, {
        toolCallId: "call_empty_add",
        messages: [],
        context: {},
      });

      expect(result).toEqual({
        success: false,
        error:
          "At least one valid 3-letter currency code is required to add items.",
      });
      expect(mockAddCompareCurrencies).not.toHaveBeenCalled();
    });

    it("handles action failure when underlying mutation returns falsy", async () => {
      mockAddCompareCurrencies.mockResolvedValueOnce(false);

      const payload = {
        action: "add" as const,
        currencies: ["CAD"],
      };

      const result = await manage_compare.execute!(payload, {
        toolCallId: "call_failed_mutation",
        messages: [],
        context: {},
      });

      expect(result).toEqual({
        success: false,
        error: "Failed to add CAD to the compare list.",
      });
    });

    it("catches thrown exceptions from action handlers cleanly", async () => {
      mockGetCompareRates.mockRejectedValueOnce(
        new Error("Database connection timed out"),
      );

      const payload = { action: "list" as const };
      const result = await manage_compare.execute!(payload, {
        toolCallId: "call_exception",
        messages: [],
        context: {},
      });

      expect(result).toEqual({
        success: false,
        error: "Database connection timed out",
      });
    });

    it("safely handles non-Error objects thrown during execution", async () => {
      mockGetCompareRates.mockImplementationOnce(() => {
        throw "Unhandled string throw";
      });

      const payload = { action: "list" as const };
      const result = await manage_compare.execute!(payload, {
        toolCallId: "call_non_error_thrown",
        messages: [],
        context: {},
      });

      expect(result).toEqual({
        success: false,
        error: "Failed to execute compare action.",
      });
    });
  });
});
