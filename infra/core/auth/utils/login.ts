/**
 * @fileactor Server Runtime - Auth sign-in handler
 * Server-side helper used as the `signIn` callback in NextAuth. It ensures
 * a Google sign-in is synchronized into the `users` table using an
 * upsert-style insert.
 */

import { db } from "../db/client";
import { users } from "../db/schema";
import { SignInProps } from "../types";

/**
 * Persist or update a user record at sign-in.
 * @param props - `account` and `profile` passed by NextAuth on sign-in.
 * @returns `true` when sign-in should proceed, `false` to reject.
 */
export async function login({
  account,
  profile,
}: SignInProps): Promise<boolean> {
  if (account?.provider !== "google") {
    return true;
  }

  if (!profile?.email) {
    return false;
  }

  try {
    await db
      .insert(users)
      .values({
        email: profile.email,
        name: profile.name ?? profile.email,
        image: profile.picture ?? null,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name: profile.name ?? profile.email,
          image: profile.picture ?? null,
        },
      })
      .returning({ id: users.id });

    return true;
  } catch (error) {
    console.error("Auth signIn DB sync failed", error);
    return false;
  }
}
