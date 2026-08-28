import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { revalidateAllPaths } from "./next-cache";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const mockedRevalidate = vi.mocked(revalidatePath);
beforeEach(() => {
  vi.resetAllMocks();
});
describe("Revalidate All paths", () => {
  test("should revalidate 4 paths", () => {
    revalidateAllPaths();
    expect(mockedRevalidate).toHaveBeenCalledTimes(4);
  });

  test("should have called with valid paths", () => {
    revalidateAllPaths();
    expect(mockedRevalidate).toHaveBeenCalledWith("/");
    expect(mockedRevalidate).toHaveBeenCalledWith("/compare");
    expect(mockedRevalidate).toHaveBeenCalledWith("/favorites");
    expect(mockedRevalidate).toHaveBeenCalledWith("/logs");
  });
});
