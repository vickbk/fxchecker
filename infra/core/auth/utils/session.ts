/**
 * @fileactor Server Runtime - Session callback
 * Adjusts the NextAuth session object to include the application `id` claim.
 */

import { SessionProps } from "../types";

/**
 * Session callback used by NextAuth to build the client-visible session.
 * @param params - `{ session, token }` passed by NextAuth.
 * @returns Session augmented with `user.id` when available.
 */
export async function session({ session, token }: SessionProps) {
  return {
    ...session,
    user: {
      ...session.user,
      id: token.id ?? session.user?.id,
    },
  };
}
