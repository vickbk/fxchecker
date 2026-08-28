import { beforeEach, describe, expect, it, vi } from "vitest";
import { logConversion } from "../actions";
import { LogsAIToolSchema } from "../types";
import { addLogs } from "./add-log";

vi.mock("../actions", () => ({
  logConversion: vi.fn(),
}));

describe("addLogs", () => {
  const validAddData: LogsAIToolSchema = {
    action: "add",
    base: "USD",
    quote: "EUR",
    amount: 100,
    rate: 1.08,
    limit: 10,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws an error when data.action is not 'add'", async () => {
    const invalidData = {
      action: "list",
      limit: 10,
    } as unknown as LogsAIToolSchema;

    await expect(addLogs(invalidData)).rejects.toThrow(
      "Invalid action provided",
    );
    expect(logConversion).not.toHaveBeenCalled();
  });

  it("successfully calls logConversion and returns formatted success output", async () => {
    vi.mocked(logConversion).mockResolvedValue({ success: true });

    const result = await addLogs(validAddData);

    expect(logConversion).toHaveBeenCalledOnce();
    expect(logConversion).toHaveBeenCalledWith(validAddData);
    expect(result).toEqual({
      revalidate: true,
      success: true,
      message: "Logged conversion of 100 USD to EUR at rate 1.08.",
    });
  });

  it("throws an error with the message from result.error when logConversion fails", async () => {
    const mockError = new Error("Database transaction failed");
    vi.mocked(logConversion).mockResolvedValue({
      success: false,
      error: mockError,
    });

    await expect(addLogs(validAddData)).rejects.toThrow(
      "Database transaction failed",
    );
    expect(logConversion).toHaveBeenCalledOnce();
    expect(logConversion).toHaveBeenCalledWith(validAddData);
  });

  it("throws an error when result.success is false and error object is undefined", async () => {
    vi.mocked(logConversion).mockResolvedValue({
      success: false,
      error: undefined,
    });

    await expect(addLogs(validAddData)).rejects.toThrow();
  });

  it("propagates unexpected rejection if logConversion throws", async () => {
    vi.mocked(logConversion).mockRejectedValue(new Error("Network timeout"));

    await expect(addLogs(validAddData)).rejects.toThrow("Network timeout");
  });
});
