/**
 * @fileactor Server Runtime - Auth actions
 * Small server-side helpers that wrap `signIn`/`signOut` for usage in UI
 * components. These are `server` actions and call into NextAuth server
 * helpers.
 */

import { signIn, signOut } from "./utils/init";

export async function loginWithGoogle() {
  "use server";
  await signIn("google");
}

export async function LogOut() {
  "use server";
  await signOut();
}
