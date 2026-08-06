/**
 * @fileactor Server Runtime - Auth user helpers
 * Server-side helpers that query the `users` table. These functions use the
 * schema-bound `db` client from `../db/client` and therefore are server-only.
 */

import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { users } from "../db/schema";

/**
 * Fetch a user row by email.
 * @param email - The user's email address to look up.
 * @returns The DB user row or `null` if not found or on error.
 */
export async function getUserByEmail(email: string) {
  try {
    return (
      (await db.query.users.findFirst({
        where: eq(users.email, email),
      })) ?? null
    );
  } catch (error) {
    console.error("Failed to get user by email", error);
    return null;
  }
}
