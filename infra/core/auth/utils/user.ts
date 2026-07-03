/**
 * @fileactor Server Runtime - Auth user helpers
 * Server-side helpers that query the `users` table. These functions use the
 * schema-bound `db` client from `../db/client` and therefore are server-only.
 */

import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { users } from "../db/schema";
import { auth } from "./init";

/**
 * Fetch a user row by email.
 * @param email - The user's email address to look up.
 * @returns The DB user row or `null` if not found or on error.
 */
export async function getUserByEmail(email: string) {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user;
  } catch (error) {
    console.error("Failed to get user by email", error);
    return null;
  }
}

/**
 * Helper utility to enforce session authentication across actions.
 * Throws a predictable error context if the call is anonymous.
 */
export async function assertAuthenticated(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error(
      "Unauthorized: You must be logged in to perform this action.",
    );
  }

  return userId;
}
