# 🏛️ Core Infrastructure Migration Task List: DB & Auth Refactoring

This document outlines the complete tracking sequence required to refactor both the database infrastructure and the authentication engine into a centralized core infrastructure directory (`infrastructure/core`).

This plan ensures clean architecture boundaries:

1. Core database configuration remains entirely agnostic of authentication schemas.
2. The `users` table schema is strictly co-located within the `auth` infrastructure folder.
3. Next.js 16 Edge runtime compiler boundaries are preserved by splitting edge-safe and server-only modules.
4. Application-wide features consume these core primitives via clean, unidirectional dependency flows.

---

## 🗄️ Phase 1: Database Infrastructure Relocation (`infrastructure/core/db`)

_Migrate the database engine, client initialization, connection configurations, and existing tracking migrations to the core infrastructure folder._

- [x] **Relocate Core Database Files**:
  - **Status**: ✅ Completed (2026-06-07)
  - **Description**: Migrate the physical database initialization files, driver imports, and connection configurations to the central infrastructure folder.
  - [x] Move the database client configuration file (e.g., Neon/Postgres initialization code) to `src/infrastructure/core/db/client.ts`.
  - [x] Ensure the core client initialization remains decoupled from any specific feature schemas; it should only initialize the connection pool and export the `db` instance.
- [x] **Migrate Existing SQL Migration Files**:
  - **Status**: ✅ Completed (2026-06-07)
  - **Description**: Safely move the history of generated migration files without disrupting local or production deployment schema checks.
  - [x] Move the `migrations` directory containing the historical generated SQL files to `src/infrastructure/core/db/migrations`.
- [x] **Update Universal Application Database Imports**:
  - **Status**: ✅ Completed (2026-06-07)
  - **Description**: Bulk refactor references to the database client across all existing vertical features and application route handlers.
  - [x] Update all references importing the `db` instance across feature layers to use the centralized path alias (e.g., `@/infrastructure/core/db/client`).
  - [x] Validate that no feature layer retains broken relative paths pointing to the old database location.

---

## 💾 Phase 2: Database Schema & Migration Multi-Path Setup

_Isolate the user table schema inside the new infrastructure location and update the Drizzle compilation settings to scan both core directories._

- [x] **Relocate and Adapt the User Database Schema**:
  - **Status**: ✅ Completed (2026-06-07)
  - **Description**: Establish the user table model inside the core authentication infrastructure directory, ensuring it remains isolated from global database initializations.
  - [x] Move your existing user table model file to `infrastructure/core/auth/db/schema.ts`.
  - [x] Ensure that this schema file does _not_ import any database client drivers or external feature layer models. It should only import primitive column definitions from `drizzle-orm/pg-core`.
- [x] **Configure Multi-Path Schema and Migration Output in Drizzle Kit**:
  - **Status**: ✅ Completed (2026-06-07)
  - **Description**: Update the central database synchronization configuration file to map the new database output path and scan both schemas.
  - [x] Open the root `drizzle.config.ts` configuration file.
  - [x] Update the `out` parameter to target the new location: `"./infrastructure/core/db/migrations"`.
  - [x] Modify the `schema` parameter to accept an array of target patterns matching both directories: `["./infrastructure/core/**/db/schema.ts", "./features/**/db/schema.ts"]`.
  - [x] Run a test introspection or dry-run command (`pnpm drizzle-kit check`) to ensure the schema migration tool pathing resolves perfectly without errors.

---

## ⚙️ Phase 3: Core Authentication Engine Splitting (Edge vs. Node)

_Divide your NextAuth engine configurations into an edge-compatible runtime file and an extended server runtime file to prevent compilation breaks._

- [x] **Author the Edge-Safe Core Configurations**:
  - **Status**: ✅ Completed (2026-06-07)
  - **Description**: Establish the base runtime-agnostic parameters for Auth.js that can safely execute inside the isolated Next.js Middleware edge container.
  - [x] Create `config.ts`.
  - [x] Configure the base options: specify the stateless `jwt` session strategy, custom page paths, and initialize the Google Provider using variables imported exclusively from `@shared/config`.
  - [x] **CRITICAL**: Do _not_ introduce any database operations, schema references, or file system imports into this file.

---

## 🛣️ Phase 4: Routing, Middleware, and Context Re-Mapping

_Update global interception layers and catch-all endpoint handlers to hook into the newly centralized infrastructure boundaries._

- [ ] **Re-Map the Global Security Middleware Guard**:
  - **Status**: ⏳ Pending
  - **Description**: Bind your edge-level navigation interceptor to the newly isolated, edge-safe infrastructure configuration file.
  - [ ] Open the project root `src/middleware.ts` file.
  - [ ] Remove all historical references to feature-level auth modules.
  - [ ] Import NextAuth from your new `src/infrastructure/core/auth/auth.config.ts` configuration to validate session tokens across layout views.
- [ ] **Refactor Catch-All OAuth API Routing**:
  - **Status**: ⏳ Pending
  - **Description**: Point your dynamic backend router handlers directly to the newly extended server engine execution layers.
  - [ ] Open `src/app/api/auth/[...nextauth]/route.ts`.
  - [ ] Cleanly re-route exports to inherit HTTP handlers (`GET`, `POST`) directly from your server-side engine configuration at `src/infrastructure/core/auth/auth.ts`.
- [ ] **Verify Ambient TypeScript Type Augmentation**:
  - **Status**: ⏳ Pending
  - **Description**: Ensure that your runtime session properties remain fully recognized by the TypeScript compiler globally.
  - [ ] Relocate your `next-auth.d.ts` declaration file to `src/infrastructure/core/auth/types.ts` or leave it in the root workspace.
  - [ ] Double-check your root `tsconfig.json` array file parameters to verify that the path containing this module augmentation is completely visible during build compilation tasks.

---

## 🖥️ Phase 5: Presentation Isolation (Authentication UI)

_Enforce clean presentation separation by isolating visual components away from core system infrastructure boundaries._

- [x] **Extract and Relocate Cinematic Dialog UI Components**:
  - **Status**: ✅ Completed (2026-06-07)
  - **Description**: Isolate the polished, cinematic sign-in and sign-out components within an appropriate presentation feature layer or global components space.
  - [x] Move the visual login/logout modal components entirely out of the infrastructure folder. Place them within a clean feature boundary (e.g., `features/auth-ui`).
  - [x] Verify that these components interact with authentication state purely by calling standard framework runtime triggers (`signIn()`, `signOut()`, or reading from an explicit session layout wrap).

---

## 📝 Phase 6: TSDoc Documentation & Architectural Mapping

_Document the architecture constraints, edge runtime conditions, and module dependencies for future workspace reference._

- [x] **Add TSDoc Blocks to Core Infrastructure Entry Points**:
  - **Status**: ✅ Completed (2026-06-07)
  - **Description**: Formulate clear, structural JSDoc/TSDoc metadata summaries across your new infrastructure blocks explaining deployment restrictions.
  - [x] Document `infrastructure/core/db/client.ts` emphasizing its role as a pure, schema-agnostic connection broker pool.
  - [x] Document `auth.config.ts` with explicit warnings detailing why database-level actions must never breach this edge runtime isolation file boundary.
  - [x] Document `auth.ts` outlining the decoupling relationship, noting that the database client is imported via relative parameters (`../db/client`) and that type safety is inferred entirely at the query call site through table-driven operations.
  - [x] Document the `schema.ts` file within `infrastructure/core/auth` to declare its unidirectional contract—explicitly mapping that external modules may import this user table schema downstream, but it must never import from them.
