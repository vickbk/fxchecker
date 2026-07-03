# FX Checker Tasks planning

## 1. Project Scaffolding & Core Configuration

- [x] **Repository Initialization & Tooling Setup**
- **Status:** ✅ Completed (Target: 2026-07-03)
- **Description:** Initialize the project workspace ensuring correct toolchain versions and performance boundaries for the workspace ecosystem.
- [x] Initialize repository with `pnpm init` configuration.
- [x] Configure `package.json` with strict engine enforcement for Node.js and pnpm v11.
- [x] Initialize a Next.js App Router application using TypeScript in the root directory.

- [x] **Modular Directory Architecture Scaffolding**
- **Status:** ✅ Completed (Target: 2026-07-03)
- **Description:** Scaffold the clean, feature-driven directory layout to completely decouple your domain logic from Next.js routing patterns.
- [x] Build the `/infra` directory for global shared subsystems (database, auth engine, API clients).
- [x] Build the `/shared` directory for cross-cutting layout primitives, design tokens, UI components, and basic utils.
- [x] Build the `/features` directory to house domain isolation folders (`converter`, `market`, `favorites`, `log`).
- [x] Clean out `/app` to serve purely as the routing configuration shell that imports view containers from the features layer.

- [ ] **Styling, Theme System, & Test Harness Configuration**
- **Status:** ⏳ In progress (Target: 2026-07-03)
- **Description:** Establish Tailwind CSS dark-first theme systems and seed runtime validation frameworks.
- [ ] Set up Tailwind CSS configuration supporting utility classes and dark mode toggling.
- [ ] Install and configure Vitest for structural unit tests and Playwright for core end-to-end integration flows.
- [ ] Wire up global typography scales and basic CSS variables inside `shared/styles`.

---

## 2. Infrastructure Layer (`src/infra`)

- [ ] **Database Core Setup with Neon & Drizzle ORM**
- **Status:** ⏳ Pending (Target: 2026-07-10)
- **Description:** Establish data persistence schemas for user synchronization, favorites tracking, and logging with migration validation.
- [ ] Provision the Neon serverless Postgres database instance.
- [ ] Create `infra/db/schema.ts` defining user profiles, `pinned_pairs`, and `conversion_history` tables.
- [ ] Set up Drizzle config scripts and configure automated migration pipelines for runtime synchronization.

- [ ] **Authentication Engine with Auth.js & Google OAuth**
- **Status:** ⏳ Pending (Target: 2026-07-12)
- **Description:** Construct the identity boundary providing optional device sync via Google accounts while isolating multi-tenant data sets.
- [ ] Configure the NextAuth handler inside `infra/auth` injecting the Drizzle adapter mapping.
- [ ] Register Google OAuth credentials and secure environment variables.
- [ ] Construct custom React hooks within `infra/auth/hooks` to safely resolve global session status across the architecture layers.

- [ ] **Resilient Frankfurter API Client Suite**
- **Status:** ⏳ Pending (Target: 2026-07-14)
- **Description:** Develop a type-safe, performant client interface interacting with the Frankfurter API endpoints.
- [ ] Build the HTTP fetch wrapper inside `infra/api/frankfurter.ts` with strict TypeScript definition maps for live, historical, and time-series payloads.
- [ ] Incorporate an internal stale-while-revalidate or client-cache engine to protect against rate limits and server drops.
- [ ] Add explicit error handling structures to catch connection failures, preparing for offline fallback handling.

---

## 3. Feature Architecture (`src/features`)

- [ ] **Converter Feature Subsystem**
- **Status:** ⏳ Pending (Target: 2026-07-18)
- **Description:** Deliver real-time conversions, searchable pickers, and live URL state mapping.
- [ ] Build the primary conversion interface inside `features/converter/components`.
- [ ] Create an accessible, searchable combo-box dropdown component to filter currencies.
- [ ] Implement URL persistence logic (`?from=USD&to=EUR&amount=250`) keeping state fully bookmarkable.
- [ ] Write one-click currency reversal hooks with zero layout shifting.

- [ ] **Market Ticker & Chronological Chart Feature**
- **Status:** ⏳ Pending (Target: 2026-07-22)
- **Description:** Implement real-time pair overview tickers and interactive historical time-series canvas graphs.
- [ ] Structure the currency pairs grid showing baseline 24-hour pricing shifts.
- [ ] Integrate a performant charting approach (SVG or canvas layout) rendering data windows from 1 day up to 5 years.
- [ ] Develop the interactive crosshair feature overlay tracking coordinates to surface dates and exact rates on mouse hover.

- [ ] **Favorites Tracking & Comparison Engine**
- **Status:** ⏳ Pending (Target: 2026-07-25)
- **Description:** Track high-priority currency pairs side by side and load contexts back into the converter.
- [ ] Build the cross-currency matrix showing a single target base converted against multiple currencies simultaneously.
- [ ] Implement toggle workflows enabling local storage tracking for guests, automatically upgrading to the Neon cloud datastore upon Google sign-in.
- [ ] Create navigation hooks that swap the primary converter state instantly when a user clicks a favorite card.

- [ ] **Conversion Log & Data Portability**
- **Status:** ⏳ Pending (Target: 2026-07-27)
- **Description:** Manage a running sequence of calculations and provide clean data export pathways.
- [ ] Design the dynamic logging stream layout showing chronological conversions with individual drop buttons.
- [ ] Program total history wipe actions that clean out the database or local states.
- [ ] Write the frontend parser mapping history data arrays into an unstyled CSV download stream.

---

## 4. System Integration & Global Polish

- [ ] **Application View Routing & Hybrid State Bridge**
- **Status:** ⏳ Pending (Target: 2026-07-30)
- **Description:** Wire up the clean Next.js app layout paths and resolve cross-feature communications.
- [ ] Link routing layouts in `src/app` directly to view managers in the `features/` group.
- [ ] Integrate the light and dark layout context toggle using native CSS features within `shared/components`.
- [ ] Create a connectivity status watcher component that triggers an out-of-date data warning banner if the external API becomes unreachable.

- [ ] **System Keyboard Interceptors & Accessibility (a11y) Pass**
- **Status:** ⏳ Pending (Target: 2026-08-02)
- **Description:** Implement comprehensive focus rings, semantic tags, and explicit keyboard control routes.
- [ ] Add global hotkey hooks (e.g., `cmd+k` / `ctrl+k` to trigger currency search focus, `cmd+e` to swap pairs, numbers `1-5` for chart scope manipulation).
- [ ] Ensure full screen-reader compliance with appropriate ARIA attributes for live currency changes.
- [ ] Conduct final quality assurance tests across multiple viewport profiles, checking that no layout regressions occur across desktop or mobile breakpoints.
