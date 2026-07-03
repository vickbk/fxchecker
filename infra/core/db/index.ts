/**
 * @fileactor Server Runtime - DB exports
 * Re-exports the `getDB` factory and `DBSignature` types. This entrypoint is
 * server-only and safe for imports from downstream feature layers that run on
 * the server. Do NOT import this module from Edge runtime code.
 */

export { getDB } from "./client";
export type { DBSignature } from "./types";
