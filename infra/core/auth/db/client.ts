/**
 * @fileactor Server Runtime - Auth DB client
 * This module composes the local `users` schema with the core `getDB`
 * factory to produce a typed DB client for the auth subsystem. This file is
 * server-only because it materializes the Drizzle wrapper bound to a schema.
 */

import { getDB } from "../../db";
import { users } from "./schema";

/**
 * `db` - a schema-bound Drizzle client exposing relational query helpers for
 * the `users` table. Import this from server-side auth utilities only.
 */
export const db = getDB({ users });
