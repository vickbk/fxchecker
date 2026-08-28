import { ResolveType } from "@/shared/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { LogsAIToolSchema } from "../types";
import { addLogs } from "./add-log";
import { deleteLogs } from "./delete-log";
import { execute } from "./execute";
import { getLogList } from "./list-logs";
import { getLogSchemaPayload } from "./schema.test";

vi.mock("./add-log", () => ({
  addLogs: vi.fn(),
}));

vi.mock("./delete-log", () => ({
  deleteLogs: vi.fn(),
}));

vi.mock("./list-logs", () => ({
  getLogList: vi.fn(),
}));

// Mock zod parsing behavior to simulate both standard parsing and custom z.parse wrappers
vi.mock("zod", async (actual) => {
  const implementation = await actual<typeof import("zod")>();
  return {
    z: {
      ...implementation.z,
      parse: vi.fn((_schema, props) => props),
    },
  };
});

describe("execute", () => {
  const mockAddLogs = vi.mocked(addLogs);
  const mockDeleteLogs = vi.mocked(deleteLogs);
  const mockGetLogList = vi.mocked(getLogList);
  const mockZParse = vi.mocked(z.parse);

  beforeEach(() => {
    vi.clearAllMocks();
    // Default pass-through behavior for z.parse
    mockZParse.mockImplementation((_schema, props) => props);
  });

  describe("Action Dispatching", () => {
    it("routes 'list' action to getLogList and returns the result directly", async () => {
      const mockListResult = { logs: [{ id: "log-1" }], count: 1 };
      mockGetLogList.mockResolvedValueOnce(
        mockListResult as ResolveType<typeof getLogList>,
      );

      const payload: LogsAIToolSchema = { action: "list", limit: 10 };
      const result = await execute(payload);

      expect(mockGetLogList).toHaveBeenCalledWith(payload);
      expect(mockAddLogs).not.toHaveBeenCalled();
      expect(mockDeleteLogs).not.toHaveBeenCalled();
      expect(result).toBe(mockListResult);
    });

    it("routes 'add' action to addLogs and returns the result directly", async () => {
      const mockAddResult = {
        success: true,
        id: "new-log-id",
        message: "",
        revalidate: true,
      };
      mockAddLogs.mockResolvedValueOnce(mockAddResult);

      const payload = getLogSchemaPayload({
        action: "add",
        base: "USD",
        quote: "EUR",
      });
      const result = await execute(payload);

      expect(mockAddLogs).toHaveBeenCalledWith(payload);
      expect(mockGetLogList).not.toHaveBeenCalled();
      expect(mockDeleteLogs).not.toHaveBeenCalled();
      expect(result).toBe(mockAddResult);
    });

    it("routes 'delete' action to deleteLogs and returns the result directly", async () => {
      const mockDeleteResult = {
        revalidate: true,
        success: true,
        message: "Successfully deleted log entry log-1.",
      };
      mockDeleteLogs.mockResolvedValueOnce(mockDeleteResult);

      const payload = getLogSchemaPayload({ action: "delete", id: "log-1" });
      const result = await execute(payload);

      expect(mockDeleteLogs).toHaveBeenCalledWith(payload);
      expect(mockGetLogList).not.toHaveBeenCalled();
      expect(mockAddLogs).not.toHaveBeenCalled();
      expect(result).toBe(mockDeleteResult);
    });
  });

  describe("Validation & Schema Edge Cases", () => {
    it("catches schema validation errors and returns formatted error response", async () => {
      mockZParse.mockImplementationOnce(() => {
        throw new Error("Invalid enum value for 'action'");
      });

      const payload = {
        action: "invalid_action",
      } as unknown as LogsAIToolSchema;
      const result = await execute(payload);

      expect(result).toEqual({
        success: false,
        error: "Invalid enum value for 'action'",
      });
      expect(mockGetLogList).not.toHaveBeenCalled();
      expect(mockAddLogs).not.toHaveBeenCalled();
      expect(mockDeleteLogs).not.toHaveBeenCalled();
    });

    it("handles unsupported actions that pass schema parsing", async () => {
      const payload = {
        action: "unsupported_action",
      } as unknown as LogsAIToolSchema;

      const result = await execute(payload);

      expect(result).toEqual({
        success: false,
        error: "Unsupported action specified (unsupported_action).",
      });
    });
  });

  describe("Handler Execution & Error Boundaries", () => {
    it("catches thrown errors from getLogList and returns formatted error object", async () => {
      mockGetLogList.mockRejectedValueOnce(new Error("Database lookup failed"));

      const payload = getLogSchemaPayload({ action: "list" });
      const result = await execute(payload);

      expect(result).toEqual({
        success: false,
        error: "Database lookup failed",
      });
    });

    it("catches thrown errors from addLogs and returns formatted error object", async () => {
      mockAddLogs.mockRejectedValueOnce(
        new Error("Failed to write to database"),
      );

      const payload = getLogSchemaPayload({ action: "add" });
      const result = await execute(payload);

      expect(result).toEqual({
        success: false,
        error: "Failed to write to database",
      });
    });

    it("catches thrown errors from deleteLogs and returns formatted error object", async () => {
      mockDeleteLogs.mockRejectedValueOnce(
        new Error("Query is vague: found 3 matching logs."),
      );

      const payload = getLogSchemaPayload({ action: "delete" });
      const result = await execute(payload);

      expect(result).toEqual({
        success: false,
        error: "Query is vague: found 3 matching logs.",
      });
    });

    it("falls back to default error message when thrown error is not an Error instance", async () => {
      mockGetLogList.mockImplementationOnce(() => {
        throw "String exception failure"; // Non-Error instance throw
      });

      const payload = getLogSchemaPayload({ action: "list" });
      const result = await execute(payload);

      expect(result).toEqual({
        success: false,
        error: "Failed to execute conversion log action.",
      });
    });
  });
});
