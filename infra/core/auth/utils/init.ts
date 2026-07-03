/**
 * @fileactor Server Runtime - Auth initialization
 * Server-only composition of the NextAuth runtime. This module imports the
 * Edge-safe `authOptions` but extends it with server callbacks that may call
 * into database-bound helpers. Import this module only from server contexts
 * (API routes, server actions, etc.).
 */

import NextAuth from "next-auth";
import { authOptions } from "./config";
import { jwt } from "./jwt";
import { login } from "./login";
import { session } from "./session";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authOptions,
  callbacks: {
    signIn: login,
    jwt,
    session,
  },
});
