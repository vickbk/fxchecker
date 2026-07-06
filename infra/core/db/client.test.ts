import type { Pool as PgPool } from "pg";
import { describe, expect, it, vi } from "vitest";
import type { DBSignature } from "./types";

vi.mock("@/shared/config", () => ({
  config: {
    DATABASE_URL: "postgres://test-db",
    DATABASE_MAX_CONNECTIONS: 3,
  },
}));

vi.mock("pg", () => {
  const Pool = vi.fn(function () {
    return {
      query: vi.fn(),
      end: vi.fn(),
    } as unknown as PgPool;
  });

  return { Pool };
});

vi.mock("drizzle-orm/node-postgres", () => ({
  drizzle: vi.fn(
    (client: unknown, options?: { schema?: Record<string, unknown> }) => ({
      $client: client,
      schema: options?.schema,
      query: vi.fn(),
      end: vi.fn(),
    }),
  ),
}));

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getDB } from "./client";

const mockPoolConstructor = vi.mocked(Pool, true);
const mockDrizzle = vi.mocked(drizzle, true);

const createdPool = mockPoolConstructor.mock.instances[0] as PgPool;

describe("infra/core/db/client", () => {
  it("creates a single Pool with the configured connection settings", () => {
    expect(mockPoolConstructor).toHaveBeenCalledTimes(1);
    expect(mockPoolConstructor).toHaveBeenCalledWith({
      connectionString: "postgres://test-db",
      max: 3,
    });
    expect(mockDrizzle).toHaveBeenCalledTimes(1);
    expect(mockDrizzle.mock.calls[0][0]).toBe(createdPool);
    expect(mockDrizzle.mock.calls[0][1]).toBeUndefined();
  });

  it("returns the base DB instance when no schema is supplied", () => {
    const db = getDB();

    expect(db).toBeDefined();
    expect(db.$client).toBe(createdPool);

    const typed: DBSignature<Record<string, unknown>> = db;
    expect(typed).toBe(db);
  });

  it("returns a schema-bound wrapper when a schema is supplied", () => {
    const schema = { users: { id: "uuid" } };
    const typedDb = getDB(schema);

    expect(mockDrizzle).toHaveBeenLastCalledWith(createdPool, { schema });
    expect(typedDb).toBeDefined();
    expect(typedDb.$client).toBe(createdPool);
    expect((typedDb as unknown as { schema: typeof schema }).schema).toBe(
      schema,
    );
  });

  it("returns the same base DB instance across repeated no-schema calls", () => {
    const first = getDB();
    const second = getDB();

    expect(first).toBe(second);
  });

  it("reuses the same underlying Pool for schema-bound wrappers", () => {
    const schemaA = { movies: { id: "integer" } };
    const schemaB = { reviews: { id: "uuid" } };

    const dbA = getDB(schemaA);
    const dbB = getDB(schemaB);

    expect(dbA.$client).toBe(createdPool);
    expect(dbB.$client).toBe(createdPool);
    expect(dbA).not.toBe(dbB);
    expect(mockDrizzle).toHaveBeenCalledWith(createdPool, { schema: schemaA });
    expect(mockDrizzle).toHaveBeenCalledWith(createdPool, { schema: schemaB });
  });
});
