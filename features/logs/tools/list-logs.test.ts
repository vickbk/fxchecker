import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLogs } from "../utils/logs";
import { getLogList } from "./list-logs";

vi.mock("../utils/logs", () => ({
  getLogs: vi.fn(),
}));

describe("getLogList", () => {
  const mockLogs = [
    { id: "1", data: { base: "USD", quote: "EUR", amount: 100, rate: 1.08 } },
    { id: "2", data: { base: "USD", quote: "GBP", amount: 200, rate: 0.79 } },
    { id: "3", data: { base: "EUR", quote: "GBP", amount: 100, rate: 0.85 } },
    { id: "4", data: { base: "USD", quote: "EUR", amount: 50, rate: 1.08 } },
  ] as Awaited<ReturnType<typeof getLogs>>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all logs up to limit when no filter parameters are supplied", async () => {
    vi.mocked(getLogs).mockResolvedValue(mockLogs);

    const result = await getLogList({ action: "list", limit: 2 });

    expect(getLogs).toHaveBeenCalledOnce();
    expect(result).toEqual({
      success: true,
      count: 2,
      logs: [mockLogs[0], mockLogs[1]],
    });
  });

  it("filters logs accurately by base currency code", async () => {
    vi.mocked(getLogs).mockResolvedValue(mockLogs);

    const result = await getLogList({ action: "list", base: "EUR", limit: 10 });

    expect(result.count).toBe(1);
    expect(result.logs).toEqual([mockLogs[2]]);
  });

  it("filters logs accurately by quote currency code", async () => {
    vi.mocked(getLogs).mockResolvedValue(mockLogs);

    const result = await getLogList({
      action: "list",
      quote: "GBP",
      limit: 10,
    });

    expect(result.count).toBe(2);
    expect(result.logs).toEqual([mockLogs[1], mockLogs[2]]);
  });

  it("filters logs accurately by exact amount", async () => {
    vi.mocked(getLogs).mockResolvedValue(mockLogs);

    const result = await getLogList({ action: "list", amount: 100, limit: 10 });

    expect(result.count).toBe(2);
    expect(result.logs).toEqual([mockLogs[0], mockLogs[2]]);
  });

  it("filters logs accurately by exact rate", async () => {
    vi.mocked(getLogs).mockResolvedValue(mockLogs);

    const result = await getLogList({ action: "list", rate: 1.08, limit: 10 });

    expect(result.count).toBe(2);
    expect(result.logs).toEqual([mockLogs[0], mockLogs[3]]);
  });

  it("filters logs matching all combined filter criteria simultaneously", async () => {
    vi.mocked(getLogs).mockResolvedValue(mockLogs);

    const result = await getLogList({
      action: "list",
      base: "USD",
      quote: "EUR",
      amount: 100,
      rate: 1.08,
      limit: 10,
    });

    expect(result.count).toBe(1);
    expect(result.logs).toEqual([mockLogs[0]]);
  });

  it("returns empty logs array when no logs match the filter criteria", async () => {
    vi.mocked(getLogs).mockResolvedValue(mockLogs);

    const result = await getLogList({ action: "list", base: "CAD", limit: 10 });

    expect(result).toEqual({
      success: true,
      count: 0,
      logs: [],
    });
  });

  it("safely ignores malformed log entries missing data property", async () => {
    const malformedLogs = [
      ...mockLogs,
      { id: "5" } as unknown as (typeof mockLogs)[0],
    ];
    vi.mocked(getLogs).mockResolvedValue(malformedLogs);

    const result = await getLogList({ action: "list", base: "USD", limit: 10 });

    expect(result.count).toBe(3);
  });

  it("propagates unhandled errors directly to the caller when getLogs rejects", async () => {
    const mockError = new Error("Log storage file unreadable");
    vi.mocked(getLogs).mockRejectedValue(mockError);

    await expect(getLogList({ action: "list", limit: 10 })).rejects.toThrow(
      "Log storage file unreadable",
    );
  });
});
