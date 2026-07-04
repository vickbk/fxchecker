/**
 * @fileactor Server Runtime - Core DB client initializer
 * Explicit runtime: Node (server). This module initializes the connection
 * pool and exposes a schema-aware factory `getDB(schema?)` that returns a
 * typed Drizzle `NodePgDatabase` instance extended with the raw `$client`.
 *
 * IMPORTANT: Do NOT import this module inside Edge runtime files (e.g. Next.js
 * middleware). Edge runtimes must only import the Edge-safe configuration entry
 * points under `infrastructure/core/auth` (see README.md for details).
 */

import { config } from "@/shared/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DBSignature } from "./types";

// Internal base DB instance. This is intentionally created once and kept
// internal to this module so we never leak an un-typed client to consumers.
const db: DBSignature<Record<string, unknown>> = drizzle(
  new Pool({
    connectionString: config.DATABASE_URL,
    max: config.DATABASE_MAX_CONNECTIONS,
  }),
);

/**
 * Returns a typed Drizzle database instance for the provided local `schema`.
 *
 * This factory intentionally does the following:
 * - Keeps a single underlying `Pool` instance created in this module.
 * - When `schema` is provided, it creates a fresh Drizzle wrapper using the
 *   existing connection client (`db.$client`) and the provided schema. This
 *   produces a fully-typed `NodePgDatabase<T>` bound to the call-site schema.
 * - When `schema` is omitted, it returns the base, schema-agnostic `db` value
 *   typed as `DBSignature<T>` to preserve compatibility for callers that do
 *   not require a compile-time schema mapping.
 *
 * Rationale: copying the Drizzle wrapper with `drizzle(db.$client, { schema })`
 * prevents the core pool initializer from needing to import downstream schema
 * definitions. Downstream modules supply local schemas on demand which unlocks
 * Drizzle's relational query features without introducing circular imports.
 *
 * @template T - Local schema mapping type (record of table definitions).
 *                 Example: `{ users: typeof users }` where `users` is a
 *                 `pgTable(...)` export from a feature or infra schema file.
 * @param schema - Optional local schema to map into the returned DB client.
 * @returns A `DBSignature<T>` instance: a `NodePgDatabase<T>` extended with
 *          a `$client: Pool` property for raw access when necessary.
 * @see DBSignature in `./types` for the composed return shape.
 * @example
 * ```ts
 * import { getDB } from "@/infrastructure/core/db";
 * import * as authSchema from "@/infrastructure/core/auth/db/schema";
 * const db = getDB({ users: authSchema.users });
 * const u = await db.query.users.findMany();
 * ```
 */
export function getDB<T extends Record<string, unknown>>(
  schema?: T,
): DBSignature<T> {
  return schema ? drizzle(db.$client, { schema }) : (db as DBSignature<T>);
}
