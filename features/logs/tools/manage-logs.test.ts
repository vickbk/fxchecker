import { ResolveType } from "@/shared/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addLogs } from "./add-log";
import { deleteLogs } from "./delete-log";
import { getLogList } from "./list-logs";
import { manage_conversion_logs } from "./manage-logs";
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

describe("manage_conversion_logs tool integration", () => {
  const mockAddLogs = vi.mocked(addLogs);
  const mockDeleteLogs = vi.mocked(deleteLogs);
  const mockGetLogList = vi.mocked(getLogList);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Tool Metadata", () => {
    it("exposes the correct tool description", () => {
      expect(manage_conversion_logs.description).toBe(
        "Retrieve past conversion history logs or record a new conversion in the local log store.",
      );
    });

    it("attaches inputSchema to the tool definition", () => {
      expect(manage_conversion_logs.inputSchema).toBeDefined();
    });
  });

  describe("Integration: Tool Execution Flow", () => {
    it("executes 'list' action successfully through the tool pipeline", async () => {
      const mockListResponse = {
        logs: [
          { id: "log-1", base: "USD", quote: "EUR", amount: 100 },
          { id: "log-2", base: "GBP", quote: "USD", amount: 200 },
        ],
        count: 2,
      };
      mockGetLogList.mockResolvedValueOnce(
        mockListResponse as unknown as ResolveType<typeof mockGetLogList>,
      );

      const payload = getLogSchemaPayload({
        action: "list",
        limit: 10,
      });

      const result = await manage_conversion_logs.execute(payload, {
        toolCallId: "ca context:{ll_list_01",
        messages: [],
        context: {},
      });

      expect(mockGetLogList).toHaveBeenCalledWith(
        expect.objectContaining(payload),
      );
      expect(result).toEqual(mockListResponse);
    });

    it("executes 'add' action successfully through the tool pipeline", async () => {
      const mockAddResponse = {
        success: true,
        message: "Logged conversion USD to EUR.",
      };
      mockAddLogs.mockResolvedValueOnce(
        mockAddResponse as ResolveType<typeof mockAddLogs>,
      );

      const payload = getLogSchemaPayload({
        action: "add",
        base: "USD",
        quote: "EUR",
        amount: 150,
        rate: 0.98,
      });

      const result = await manage_conversion_logs.execute(payload, {
        toolCallId: "call_add_02",
        messages: [],
        context: {},
      });

      expect(mockAddLogs).toHaveBeenCalledWith(
        expect.objectContaining(payload),
      );
      expect(result).toEqual(mockAddResponse);
    });

    it("executes 'delete' action successfully through the tool pipeline", async () => {
      const mockDeleteResponse = {
        revalidate: true,
        success: true,
        message: "Successfully deleted log entry log-target-1.",
      };
      mockDeleteLogs.mockResolvedValueOnce(mockDeleteResponse);

      const payload = getLogSchemaPayload({
        action: "delete",
        id: "log-target-1",
      });

      const result = await manage_conversion_logs.execute(payload, {
        toolCallId: "call_delete_03",
        messages: [],
        context: {},
      });

      expect(mockDeleteLogs).toHaveBeenCalledWith(
        expect.objectContaining(payload),
      );
      expect(result).toEqual(mockDeleteResponse);
    });
  });

  describe("Integration: Error Boundary & Edge Cases", () => {
    it("returns formatted error response when input schema validation fails", async () => {
      const invalidPayload = {
        action: "invalid_action",
      } as unknown as Parameters<
        NonNullable<typeof manage_conversion_logs.execute>
      >[0];

      const result = await manage_conversion_logs.execute(invalidPayload, {
        toolCallId: "call_invalid_schema",
        messages: [],
        context: {},
      });

      expect(result).toEqual({
        success: false,
        error: expect.any(String),
      });
      expect(mockGetLogList).not.toHaveBeenCalled();
      expect(mockAddLogs).not.toHaveBeenCalled();
      expect(mockDeleteLogs).not.toHaveBeenCalled();
    });

    it("handles throw statements from log handlers gracefully without crashing execution", async () => {
      mockDeleteLogs.mockRejectedValueOnce(
        new Error("No logs found matching the provided criteria."),
      );

      const payload = getLogSchemaPayload({
        action: "delete",
        base: "JPY",
      });

      const result = await manage_conversion_logs.execute(payload, {
        toolCallId: "call context:{_error_handler",
        messages: [],
        context: {},
      });

      expect(result).toEqual({
        success: false,
        error: "No logs found matching the provided criteria.",
      });
    });

    it("safely handles non-standard thrown objects during execution", async () => {
      mockGetLogList.mockImplementationOnce(() => {
        throw { customError: "Network connection lost" };
      });

      const payload = getLogSchemaPayload({
        action: "list",
      });

      const result = await manage_conversion_logs.execute(payload, {
        toolCallId: "call_non_error_thrown",
        messages: [],
        context: {},
      });

      expect(result).toEqual({
        success: false,
        error: "Failed to execute conversion log action.",
      });
    });
  });
});
