# `features/` Domain Layer Architecture Guide

## 🧩 Core Philosophy

The `features/` directory houses the core business logic, domain models, and contextual UI layout patterns of the FX Checker application. Every folder within this directory represents a completely **isolated, self-contained business capability**.

By restricting our feature modules from talking directly to one another, we prevent spaghetti dependencies, ensure dead-simple code deletion, and guarantee that our build system stays incredibly fast.

---

## 🛑 The Golden Rules of Feature Isolation

### 1. Strict Monodirectional Dependencies

- **Allowed:** Features can import primitives, types, and constants from `shared/*`.
- **Allowed:** Features can consume technical clients, database utilities, and auth actions from `infra/*`.
- **Strictly Forbidden ❌:** A feature **must never** import anything from another feature.
- _Bad:_ `import { FavoriteButton } from 'features/favorites/components/FavoriteButton'` inside `features/converter`.

### 2. What Happens When Features Need to Share Data?

If two distinct features need to collaborate, do not breach the boundary. Instead, choose one of these architectural escape hatches:

- **Lift to `shared/`:** If it is a generic utility or presentation token, extract it and move it into the global `shared/` context.
- **Unify via Page Route (`app/`):** If the data needs to be passed down dynamically, let the wrapper file inside `app/` read the data from one domain (e.g., `infra/core/db`) and pass it as explicit props into the feature layout containers.
- **Use the Native URL Engine:** For user selection synchronization (like clicking a pinned currency pair in the favorites panel to update the main interactive converter calculator), communicate decoupled state changes through URL Query Parameters (`?from=USD&to=EUR`).

---

## 📁 Recommended Internal Feature Anatomy

To maintain standard layouts across the development team, organize individual feature modules using this flat, intuitive folder system. (Do not over-engineer; only create folders as the feature expands).

```text
features/your-feature-name/
├── components/          # UI elements exclusive to this feature domain
├── hooks/               # Domain-specific React hooks (e.g., query wrappers, math calculators)
├── actions.ts           # Next.js Server Actions handling mutations for this specific feature
├── types.ts             # TypeScript definitions unique to this domain boundary
└── index.ts             # Clear public API contract surface exporting only what app/ needs

```

---

## 🗺️ Current Domain Map

| Feature Folder   | Responsibility Cluster                                                                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`converter/`** | Manages currency inputs, real-time calculation triggers, deep-linked URL synchronization states, and the interactive currency picker lookup combobox.                               |
| **`market/`**    | Renders live market pricing ticker panels and parses time-series data to feed the historical SVG/Canvas rate charts.                                                                |
| **`favorites/`** | Orchestrates the side-by-side comparison matrix layouts and coordinates user pin lists. Handles graceful fallback parsing between Guest LocalStorage and Authenticated DB profiles. |
| **`log/`**       | Handles local and persistent audit logs tracking historical operations, handling single/bulk entry purges, and parsing arrays into client-side CSV downloads.                       |

---

## 🛠️ Public API Boundary (`index.ts`)

To keep imports pristine inside the `app/` folder, each feature folder should expose a clean public entry point. Only export the master container views, specialized context managers, or main initialization elements that the Next.js framework layer needs to render the screen.

```typescript
// features/converter/index.ts
export { CurrencyConverterContainer } from "./components/CurrencyConverterContainer";
export { useUrlStateSync } from "./hooks/useUrlStateSync";
```
