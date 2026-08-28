import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { addCompare } from "./add-compare";
import { execute } from "./execute";
import { getCompareList } from "./list-compare";
import { removeCompare } from "./remove-compare";
import { inputSchema } from "./schema";

vi.mock("./add-compare", () => ({ addCompare: vi.fn() }));
vi.mock("./list-compare", () => ({ getCompareList: vi.fn() }));
vi.mock("./remove-compare", () => ({ removeCompare: vi.fn() }));
vi.mock("zod", async (actual) => {
  const implementation = await actual<typeof import("zod")>();
  return {
    z: { ...implementation.z, parse: vi.fn((_schema, props) => props) },
  };
});

describe("execute", () => {
  const mockParse = vi.mocked(z.parse);

  beforeEach(() => {
    vi.clearAllMocks();
    mockParse.mockImplementation((_schema, props) => props);
  });

  it.each([
    ["list", getCompareList, { action: "list" }],
    ["add", addCompare, { action: "add", currencies: ["USD"] }],
    ["remove", removeCompare, { action: "remove", currencies: ["USD"] }],
  ])("routes %s to its handler", async (_action, handler, payload) => {
    const result = { success: true };
    vi.mocked(handler).mockResolvedValue(result as never);
    await expect(execute(payload as never)).resolves.toBe(result);
    expect(handler).toHaveBeenCalledWith(payload);
  });

  it("passes the input schema to z.parse", async () => {
    vi.mocked(getCompareList).mockResolvedValue({
      success: true,
      compareList: [],
    } as never);
    await execute({ action: "list" });
    expect(mockParse).toHaveBeenCalledWith(inputSchema, { action: "list" });
  });

  it("returns schema validation errors", async () => {
    mockParse.mockImplementationOnce(() => {
      throw new Error("Invalid action");
    });
    await expect(execute({ action: "bad" } as never)).resolves.toEqual({
      success: false,
      error: "Invalid action",
    });
  });

  it("returns an error for unsupported actions that pass parsing", async () => {
    await expect(execute({ action: "unsupported" } as never)).resolves.toEqual({
      success: false,
      error: "Unsupported action specified (unsupported).",
    });
  });

  it("catches Error instances from handlers", async () => {
    vi.mocked(getCompareList).mockRejectedValue(new Error("Storage failed"));
    await expect(execute({ action: "list" })).resolves.toEqual({
      success: false,
      error: "Storage failed",
    });
  });

  it("uses the fallback message for unknown throws", async () => {
    vi.mocked(getCompareList).mockImplementationOnce(() => {
      throw "unexpected failure";
    });
    await expect(execute({ action: "list" })).resolves.toEqual({
      success: false,
      error: "Failed to execute compare action.",
    });
  });
});
