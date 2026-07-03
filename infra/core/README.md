# Core Infrastructure (infrastructure/core)

## Architecture Overview

`infrastructure/core` centralizes low-level, cross-cutting infrastructure for the
application: database initialization and authentication primitives. Its goals:

- Provide a schema-agnostic, server-only DB factory that other layers can
  supply local schemas to at call-site, enabling clean relational queries.
- Expose Edge-safe and Server-only entry points for authentication so Next.js
  middleware and API handlers can import only what they need.
- Enforce unidirectional dependencies: downstream features may import from
  `infrastructure/core`, but core must never import presentation or feature code.

This directory is intentionally small and opinionated to preserve clear
boundaries and avoid circular imports across the codebase.

## Directory Topology

Top-level layout (files shown with purpose):

- db/
  - client.ts — Server-only: initializes connection pool and exposes `getDB(schema?)`.
  - index.ts — Server-only re-exports: `getDB` and `DBSignature`.
  - types.ts — Server-only: type alias `DBSignature<T>`.
  - migrate.ts — Server-only migration runner using `getDB()`.
  - migrations/ — SQL migration files produced by Drizzle Kit.

- auth/
  - index.ts — Auth surface re-exports (mixed runtime: some exports are Edge-safe).
  - actions.ts — Server-only server actions wrapping `signIn`/`signOut`.
  - types.ts — Auth-specific TypeScript types and callback shapes.
  - db/
    - client.ts — Server-only: composes local `users` schema with `getDB`.
    - schema.ts — Schema-only: `users` table definition using `drizzle-orm/pg-core`.
  - utils/
    - config.ts — EDGE-SAFE: pure NextAuth configuration (no DB imports).
    - init.ts — SERVER-ONLY: composes NextAuth with server callbacks.
    - jwt.ts — SERVER-ONLY: NextAuth `jwt` callback (may query DB).
    - login.ts — SERVER-ONLY: `signIn` callback that upserts the user.
    - session.ts — SERVER-ONLY: `session` callback that augments the session.
    - user.ts — SERVER-ONLY: helper to query `users` table.

Refer to each file's header comment for explicit runtime designation.

## Edge vs. Server Separation Manifest

The repository strictly separates Edge-compatible configuration from server-only
runtime code to satisfy Next.js App Router compilation and middleware constraints.

- Edge-safe modules (importable from middleware and Edge runtimes):
  - `auth/utils/config.ts` — Contains only serializable configuration and provider
    initializers. No DB clients, no async runtime initialization.

- Server-only modules (must not be imported in Edge runtimes):
  - `db/*` (client.ts, index.ts, types.ts, migrate.ts)
  - `auth/db/*` (client.ts)
  - `auth/utils/init.ts`, `auth/utils/jwt.ts`, `auth/utils/login.ts`, `auth/utils/session.ts`, `auth/utils/user.ts`
  - `auth/actions.ts`

Why this matters: Edge runtimes cannot import native Node APIs (like `pg`) or
perform arbitrary async initialization. Keeping `auth/utils/config.ts` pure
permits safe usage in middleware while all DB-bound logic remains server-only.

## Usage Blueprints

Example: Using `getDB` with a local schema to enable Relational Query features
within a server-only module (auth subsystem):

```ts
// Example: Using the encapsulated client inside infrastructure/core/auth/db/client.ts
import { getDB } from "../db/client";
import * as authSchema from "./schema";

// Pass local schema to get a dynamically mapped, fully typed DB client instance
const db = getDB(authSchema);

// Relational Query features are fully unlocked here!
const user = await db.query.users.findFirst({
  where: (users, { eq }) => eq(users.email, emailValue),
});
```

Notes:

- Always call `getDB` from server runtime code only.
- Prefer passing the minimal local schema needed for the operation to keep
  call-sites explicit and prevent accidental global schema coupling.

## Modification Guardrails (Do / Don't)

- Do: Import `getDB` and pass a local schema in server code when you need
  typed, relational queries.
- Do: Keep schema definitions (e.g. `auth/db/schema.ts`) free of runtime side-effects.
- Don't: Export the raw `db` (the connection `Pool`) from `infrastructure/core/db`.
  Always go through `getDB` so downstream code supplies schemas explicitly.
- Don't: Import feature-layer modules into `infrastructure/core` — this breaks
  the unidirectional dependency rule.
- Don't: Move DB connection code into Edge-safe files (such as
  `auth/utils/config.ts`) — that file must remain pure.

## Quick References

- Core DB factory: `infrastructure/core/db/client.ts`
- Auth Edge configuration: `infrastructure/core/auth/utils/config.ts`
- Auth server init: `infrastructure/core/auth/utils/init.ts`

For more details, inspect each file's TSDoc header which documents its exact
runtime affinity and exported primitives.
