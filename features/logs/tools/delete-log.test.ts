import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteLogItem } from "../actions";
import { LogsAIToolSchema } from "../types";
import { deleteLogs } from "./delete-log";
import { findTargetLogId } from "./find-target-log";
import { getLogList } from "./list-logs";

vi.mock("../actions", () => ({
  deleteLogItem: vi.fn(),
}));

vi.mock("./list-logs", () => ({
  getLogList: vi.fn(),
}));

vi.mock("./find-target-log", () => ({
  findTargetLogId: vi.fn(),
}));

type GetLogListReturn = Awaited<ReturnType<typeof getLogList>>;

export function getLogSchemaPayload(
  overWrite: Partial<LogsAIToolSchema> = {},
): LogsAIToolSchema {
  return {
    action: "delete",
    limit: 10,
    id: "log-target-123",
    ...overWrite,
  } as LogsAIToolSchema;
}
describe("deleteLogs", () => {
  const mockDeleteLogItem = vi.mocked(deleteLogItem);
  const mockGetLogList = vi.mocked(getLogList);
  const mockFindTargetLogId = vi.mocked(findTargetLogId);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Action Validation", () => {
    it.each([
      { action: "list" },
      { action: "add" },
      { action: "invalid_action" },
    ])("throws an error if action is '$action'", async ({ action }) => {
      const payload = { action } as unknown as LogsAIToolSchema;

      await expect(deleteLogs(payload)).rejects.toThrow(
        "Invalid action provided",
      );
      expect(mockDeleteLogItem).not.toHaveBeenCalled();
      expect(mockGetLogList).not.toHaveBeenCalled();
    });
  });

  describe("Direct Deletion by ID", () => {
    it("deletes directly when 'id' is provided and bypasses log search", async () => {
      mockDeleteLogItem.mockResolvedValueOnce({ success: true });

      const payload = getLogSchemaPayload();

      const result = await deleteLogs(payload);

      expect(mockGetLogList).not.toHaveBeenCalled();
      expect(mockFindTargetLogId).not.toHaveBeenCalled();
      expect(mockDeleteLogItem).toHaveBeenCalledWith("log-target-123");
      expect(result).toEqual({
        revalidate: true,
        success: true,
        message: "Successfully deleted log entry log-target-123.",
      });
    });

    it("throws specific error message returned by deleteLogItem on failure", async () => {
      mockDeleteLogItem.mockResolvedValueOnce({
        success: false,
        error: new Error("Log item does not exist or was already deleted."),
      });

      const payload = getLogSchemaPayload();

      await expect(deleteLogs(payload)).rejects.toThrow(
        "Log item does not exist or was already deleted.",
      );
    });

    it("throws default error message when deleteLogItem fails without an error message", async () => {
      mockDeleteLogItem.mockResolvedValueOnce({
        success: false,
      });

      const payload = getLogSchemaPayload();

      await expect(deleteLogs(payload)).rejects.toThrow(
        "Failed to delete log entry.",
      );
    });
  });

  describe("Lookup and Delete (Without Direct ID)", () => {
    it("queries log list with filter attributes, action = 'list', and limit = 100", async () => {
      mockGetLogList.mockResolvedValueOnce({
        logs: [{ id: "log-1" }],
      } as GetLogListReturn);
      mockFindTargetLogId.mockReturnValueOnce("log-1");
      mockDeleteLogItem.mockResolvedValueOnce({ success: true });

      const payload = getLogSchemaPayload({
        id: undefined,
        base: "USD",
        quote: "EUR",
      });

      await deleteLogs(payload);

      expect(mockGetLogList).toHaveBeenCalledWith({
        action: "list",
        base: "USD",
        quote: "EUR",
        limit: 100,
      });
    });

    it("throws error when query returns no logs or empty log array", async () => {
      mockGetLogList.mockResolvedValueOnce({
        logs: [] as GetLogListReturn["logs"],
      } as GetLogListReturn);

      const payload = getLogSchemaPayload({
        id: undefined,
        base: "USD",
      });

      await expect(deleteLogs(payload)).rejects.toThrow(
        "No logs found matching the provided criteria.",
      );
      expect(mockFindTargetLogId).not.toHaveBeenCalled();
      expect(mockDeleteLogItem).not.toHaveBeenCalled();
    });

    it("throws vague query error when multiple logs are found and position is undefined", async () => {
      mockGetLogList.mockResolvedValueOnce({
        logs: [{ id: "log-1" }, { id: "log-2" }, { id: "log-3" }],
      } as GetLogListReturn);

      const payload = getLogSchemaPayload({
        base: "USD",
        id: undefined,
        position: undefined,
      });

      await expect(deleteLogs(payload)).rejects.toThrow(
        "Query is vague: found 3 matching logs. Please specify a position ('latest', 'oldest', 'first', 'last' or index) or log ID.",
      );
      expect(mockFindTargetLogId).not.toHaveBeenCalled();
      expect(mockDeleteLogItem).not.toHaveBeenCalled();
    });

    it("proceeds with single log match when position is undefined", async () => {
      const mockLogs = [{ id: "single-log-id" }];
      mockGetLogList.mockResolvedValueOnce({
        logs: mockLogs,
      } as GetLogListReturn);
      mockFindTargetLogId.mockReturnValueOnce("single-log-id");
      mockDeleteLogItem.mockResolvedValueOnce({ success: true });

      const payload = getLogSchemaPayload({
        base: "USD",
        position: undefined,
        id: undefined,
      });

      const result = await deleteLogs(payload);

      expect(mockFindTargetLogId).toHaveBeenCalledWith(mockLogs, undefined);
      expect(mockDeleteLogItem).toHaveBeenCalledWith("single-log-id");
      expect(result.success).toBe(true);
    });

    it.each([
      { position: "latest" as const },
      { position: "oldest" as const },
      { position: "first" as const },
      { position: "last" as const },
      { position: 0 },
      { position: 1 },
    ])(
      "resolves target log when position is '$position'",
      async ({ position }) => {
        const mockLogs = [{ id: "log-1" }, { id: "log-2" }];
        mockGetLogList.mockResolvedValueOnce({
          logs: mockLogs,
        } as GetLogListReturn);
        mockFindTargetLogId.mockReturnValueOnce("log-2");
        mockDeleteLogItem.mockResolvedValueOnce({ success: true });

        const payload = getLogSchemaPayload({
          position,
          id: undefined,
        });

        const result = await deleteLogs(payload);

        expect(mockFindTargetLogId).toHaveBeenCalledWith(mockLogs, position);
        expect(mockDeleteLogItem).toHaveBeenCalledWith("log-2");
        expect(result).toEqual({
          revalidate: true,
          success: true,
          message: "Successfully deleted log entry log-2.",
        });
      },
    );

    it("propagates errors thrown by findTargetLogId", async () => {
      mockGetLogList.mockResolvedValueOnce({
        logs: [{ id: "log-1" }],
      } as GetLogListReturn);
      mockFindTargetLogId.mockImplementationOnce(() => {
        throw new Error("Invalid position index 5.");
      });

      const payload = getLogSchemaPayload({
        id: undefined,
        position: 5,
      });

      await expect(deleteLogs(payload)).rejects.toThrow(
        "Invalid position index 5.",
      );
      expect(mockDeleteLogItem).not.toHaveBeenCalled();
    });
  });
});
