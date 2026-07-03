/**
 * @fileactor Server Runtime - Auth utilities entry
 * Re-exports server-bound auth utilities. Import these only in server
 * environments (API routes, server actions, server components).
 */

export { auth, handlers } from "./init";
export { assertAuthenticated, getUserByEmail } from "./user";
