/**
 * @fileactor Mixed - Auth surface
 * This module exposes authentication primitives from the core auth
 * infrastructure. Note: the `config.ts` file under `utils` is Edge-safe
 * (no DB). The remaining exports under `utils` and `db` require server
 * runtime.
 */

export { LogOut, loginWithGoogle } from "./actions";
export { users } from "./db/schema";
export { assertAuthenticated, auth, handlers } from "./utils";
export { isAuthError } from "./utils/errors";
