/**
 * @fileactor Server Runtime - DB types
 * Type utilities used by the core DB factory. These types model the shape of
 * the database object returned by `getDB`.
 */

import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * DBSignature<T>
 *
 * A convenience type representing a Drizzle `NodePgDatabase<T>` extended with
 * the underlying `Pool` instance available as `$client` for raw SQL
 * operations or migration helpers.
 *
 * @template T - The local schema mapping type supplied to `getDB`.
 */
export type DBSignature<T extends Record<string, unknown>> =
  NodePgDatabase<T> & {
    $client: Pool;
  };
