# `infra/` Infrastructure Layer Guide

## 📡 Core Philosophy

The `infra/` directory acts as the system backbone. It isolates all third-party integrations, external API wrappers, state persistence engines, and lifecycle authentication engines from the rest of the application.

Think of this directory as the technical foundation: code inside `infra/` should be completely **unaware of our specific UI layouts**. It provides clean, type-safe, asynchronous methods that our `features/` layer or Next.js `app/` routes execute to read or mutate system state.

---

## 🗂️ Directory Blueprint

```text
infra/
├── api/
│   └── frankfurter.ts    # Type-safe client for exchange rates & time-series data
└── core/                 # Coupled state-of-truth engine
    ├── auth/             # Auth.js engine configuration & Google OAuth registration
    └── db/               # Neon serverless client setup & Drizzle ORM schemas

```

---

## 🔒 The Core Consolidation (`infra/core/`)

We intentionally group `auth/` and `db/` together within the `core/` cluster. These two subsystems are intrinsically tied through our data persistence lifecycle: **Auth.js utilizes the Drizzle adapter to securely manage sessions directly inside our Postgres instance.**

### 1. Database Architecture (`infra/core/db/`)

- **Engine:** Neon Serverless PostgreSQL.
- **ORM:** Drizzle ORM.
- **Rules:** All database schemas (`schema.ts`) live here. Mutations should happen via Next.js Server Actions inside individual features, but they must use the database clients exported from this root infrastructure folder.
- **Migrations:** Database updates are managed through schema declarations and applied via migration scripts configured at the project root level.

### 2. Identity & Access (`infra/core/auth/`)

- **Engine:** Auth.js (NextAuth).
- **Provider:** Google OAuth.
- **Rules:** Handles tenant isolation constraints. When evaluating a user’s pinned currency pairs or currency conversion logs, query logic must cross-reference the active auth session ID resolved by this module.

---

## 📈 External FX Gateway (`infra/api/`)

The `api/` folder contains standard HTTP fetch abstraction logic designed to handle data streaming from the Frankfurter engine safely.

- **Type Safety:** Every network endpoint must map to a explicit contract definition detailing both incoming query structures and predictable response schemas.
- **Resiliency & Caching:** The API client includes internal cache flags (Stale-While-Revalidate strategies). This prevents hitting rate limits from rapid real-time typing events in the converter, and builds a fallback layer so the app can show an "out-of-date data" banner if the endpoint drops offline.

---

## 🛡️ Architectural Guardrails

> **The Separation Rule:** Code within `infra/` must **never** import layout assets, React views, or state triggers directly from the `features/` or `app/` modules. It is a provider layer, never a consumer.

- **Fail Gracefully:** External APIs fail. Database connections timeout. All exported primitives from this layer must surface distinct error contracts so that the UI can catch errors and render helpful fallback banners instead of crashing.
- **Keep Subsystems Swappable:** If we decide to swap out the Frankfurter API for another exchange rate engine later, we should only have to modify the files inside `infra/api/` without altering a single line of layout code inside our feature components.
