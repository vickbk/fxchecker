import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./client", () => ({
  getDB: vi.fn(() => ({ $client: { end: vi.fn(async () => undefined) } })),
}));

vi.mock("drizzle-orm/node-postgres/migrator", () => ({
  migrate: vi.fn(async () => undefined),
}));

import { migrate } from "drizzle-orm/node-postgres/migrator";
import { getDB } from "./client";
import { runMigrations } from "./migrate";

const getDBMock = vi.mocked(getDB, true);
const migrateMock = vi.mocked(migrate, true);

describe("infrastructure/core/db/migrate", () => {
  it("runs migrations against the core database with the correct folder", async () => {
    await runMigrations();

    expect(getDBMock).toHaveBeenCalledTimes(1);
    expect(migrateMock).toHaveBeenCalledTimes(1);

    const [receivedDb, options] = migrateMock.mock.calls[0];
    expect(receivedDb).toHaveProperty("$client");
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

    // Force Vitest to drop the module cache for 'migrate.ts'
    // so it re-evaluates top-level code fresh on every single test
    vi.resetModules();
  });

  afterEach(() => {
    // Restore mutation states
    process.argv[1] = originalArgv1!;
    vi.restoreAllMocks();
  });

  it("should capture errors, print diagnostics, and invoke process.exit(1) when a migration fails via CLI", async () => {
    // Arrange: Stub argv to satisfy your alternative check condition
    process.argv[1] = "/usr/src/app/src/infrastructure/core/db/migrate.ts";

    const operationalError = new Error(
      "Database network connection pool rejected.",
    );
    migrateMock.mockRejectedValueOnce(operationalError);

    // Act: Dynamically import the module to trigger the immediate execution block
    await import("./migrate");

    // Wait: Allow the unawaited dangling promise chain (.catch) to flush through the event loop
    await new Promise((resolve) => setImmediate(resolve));

    // Assert: Verify the boundary catch statement was invoked
    expect(consoleLogSpy).toHaveBeenCalledWith("Migration starting...");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Migration failed. Error:",
      operationalError,
    );
    expect(exitSpy).toHaveBeenCalledTimes(1);
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("should complete successfully without executing process.exit when a migration passes via CLI", async () => {
    // Arrange
    process.argv[1] = "/usr/src/app/src/infrastructure/core/db/migrate.ts";
    migrateMock.mockResolvedValueOnce(undefined);

    // Act
    await import("./migrate");
    await new Promise((resolve) => setImmediate(resolve));

    // Assert
    expect(consoleLogSpy).toHaveBeenCalledWith("Migration starting...");
    expect(consoleLogSpy).toHaveBeenCalledWith("Migration completed");
    expect(exitSpy).not.toHaveBeenCalled();
  });
});
