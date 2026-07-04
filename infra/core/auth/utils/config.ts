/**
 * @fileactor Edge Runtime - Auth configuration
 * Edge-safe NextAuth options. This module is deliberately free of any DB
 * imports and side-effects so it can be consumed from Next.js middleware or
 * other Edge runtime entry points. Keep this file pure and configuration-only.
 */

import { config } from "@/shared/config";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * `authOptions` - Minimal NextAuth configuration that is safe to import in
 * Edge runtimes. DO NOT add database operations, schema imports, or async
 * runtime initialization here.
 */
export const authOptions: NextAuthConfig = {
  secret: config.AUTH_SECRET,
  providers: [
    Google({
      clientId: config.AUTH_GOOGLE_ID,
      clientSecret: config.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  trustHost: true,
};
