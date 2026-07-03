/**
 * @fileactor Server Runtime - JWT callback
 * JWT callback that resolves the application `id` claim using the users
 * table. Server-only since it queries the DB.
 */

import { JWT } from "next-auth/jwt";
import { JWTProps } from "../types";
import { getUserByEmail } from "./user";

/**
 * Enrich the token with `id` from the DB when available.
 * @param params - NextAuth jwt callback parameters.
 * @returns The enriched JWT token.
 */
export async function jwt({ token, user, profile }: JWTProps): Promise<JWT> {
  if (token.id) {
    return token;
  }

  const email = profile?.email ?? user?.email;
  if (!email) {
    return token;
  }

  try {
    const dbUser = await getUserByEmail(email);

    if (dbUser?.id) {
      return { ...token, id: dbUser.id };
    }
  } catch (error) {
    console.error("Failed to resolve user ID for JWT", error);
  }

  return token;
}
