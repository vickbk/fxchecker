import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./client", () => {
  const mockEnd = vi.fn(async () => undefined);
  const mockDB = {
    $client: {
      end: mockEnd,
    },
  };
  return {
    getDB: vi.fn(() => mockDB),
  };
});

vi.mock("drizzle-orm/node-postgres/migrator", () => ({
  migrate: vi.fn(async () => undefined),
}));

import { migrate } from "drizzle-orm/node-postgres/migrator";
import { getDB } from "./client";
import { runMigrations } from "./migrate";

const getDBMock = vi.mocked(getDB, true);
const migrateMock = vi.mocked(migrate, true);

describe("infrastructure/core/db/migrate", () => {
  beforeEach(() => {
    migrateMock.mockClear();
    getDBMock.mockClear();
    vi.mocked(getDB().$client.end).mockClear();
  });

  it("runs migrations against the core database with the correct folder", async () => {
    await runMigrations();

    expect(getDBMock).toHaveBeenCalledTimes(1);
    expect(migrateMock).toHaveBeenCalledTimes(1);

    const [receivedDb, options] = migrateMock.mock.calls[0];
    expect(receivedDb).toBe(getDB());
    expect(options).toBeDefined();
    expect(options.migrationsFolder).toEqual(expect.any(String));
    expect(options.migrationsFolder).toContain("migrations");
  });

  it("propagates errors from the migration runner", async () => {
    const error = new Error("migration failed");
    migrateMock.mockRejectedValueOnce(error);

    await expect(runMigrations()).rejects.toThrow("migration failed");
  });
});

describe("infrastructure/core/db/migrate — CLI Script Execution & process.exit(1)", () => {
  let originalArgv1: string | undefined;
  let exitSpy: import("vitest").MockInstance<typeof process.exit>;
  let consoleErrorSpy: import("vitest").MockInstance<typeof console.error>;
  let consoleLogSpy: import("vitest").MockInstance<typeof console.log>;

  beforeEach(() => {
    // Preserve environment state to avoid test isolation pollution
    originalArgv1 = process.argv[1];

    // Stub environment functions to prevent crashing the test runner or messy logs
    exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Reset standard migration mocks from previous tests
    migrateMock.mockClear();
    getDBMock.mockClear();
    vi.mocked(getDB().$client.end).mockClear();

    // Force Vitest to drop the module cache for 'migrate.ts'
    // so it re-evaluates top-level code fresh on every single test
    vi.resetModules();
  });

  afterEach(() => {
    // Restore mutation states
    process.argv[1] = originalArgv1!;
    vi.restoreAllMocks();
  });

  it("should complete successfully without executing process.exit when a migration passes via CLI", async () => {
    // Arrange
    process.argv[1] = "migrate.ts";
    migrateMock.mockResolvedValueOnce(undefined);

    // Act
    const { migrationPromise } = await import("./migrate");
    await migrationPromise;

    // Assert
    expect(consoleLogSpy).toHaveBeenCalledWith("Migration starting...");
    expect(consoleLogSpy).toHaveBeenCalledWith("Migration completed");
    expect(migrateMock).toHaveBeenCalledTimes(1);
    expect(vi.mocked(getDB().$client.end)).toHaveBeenCalledTimes(1);
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("should capture errors, print diagnostics, invoke process.exit(1), and close the connection pool when a migration fails via CLI", async () => {
    // Arrange
    process.argv[1] = "migrate.ts";
    const operationalError = new Error("Database network connection pool rejected.");
    migrateMock.mockRejectedValueOnce(operationalError);

    // Act
    const { migrationPromise } = await import("./migrate");
    await migrationPromise;

    // Assert: Verify the boundary catch statement was invoked
    expect(consoleLogSpy).toHaveBeenCalledWith("Migration starting...");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Migration failed. Error:",
      operationalError,
    );
    expect(exitSpy).toHaveBeenCalledTimes(1);
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(vi.mocked(getDB().$client.end)).toHaveBeenCalledTimes(1);
  });
});
