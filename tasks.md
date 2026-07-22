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

- [x] **Styling, Theme System, & Test Harness Configuration**
- **Status:** ✅ Done (Target: 2026-07-03)
- **Description:** Establish Tailwind CSS dark-first theme systems and seed runtime validation frameworks.
- [x] Set up Tailwind CSS configuration supporting utility classes and dark mode toggling.
- [ ] Wire up global typography scales and basic CSS variables inside `shared/styles`.
- [x] Install and configure Vitest for structural unit tests and Playwright for core end-to-end integration flows.

---

## 2. Infrastructure Layer (`infra`)

- [x] **Database Core Setup with Neon & Drizzle ORM**
- **Status:** ✅ Done (Target: 2026-07-10)
- **Description:** Establish data persistence schemas for user synchronization, favorites tracking, and logging with migration validation.
- [ ] Provision the Neon serverless Postgres database instance.
- [x] Create `infra/db/schema.ts` defining user profiles, `pinned_pairs`, and `conversion_history` tables.
- [x] Set up Drizzle config scripts and configure automated migration pipelines for runtime synchronization.

- [x] **Authentication Engine with Auth.js & Google OAuth**
- **Status:** ✅ Done (Target: 2026-07-12)
- **Description:** Construct the identity boundary providing optional device sync via Google accounts while isolating multi-tenant data sets.
- [x] Configure the NextAuth handler inside `infra/auth` injecting the Drizzle adapter mapping.
- [x] Register Google OAuth credentials and secure environment variables.
- [x] Construct custom React hooks within `infra/auth/hooks` to safely resolve global session status across the architecture layers.

- [x] **Resilient Frankfurter API Client Suite**
- **Status:** ✅ Done (Target: 2026-07-06)
- **Description:** Develop a type-safe, performant client interface interacting with the Frankfurter API endpoints.
- [x] Build the HTTP fetch wrapper inside `infra/api/frankfurter/` with strict TypeScript definition maps for live, historical, and time-series payloads.
- [x] Incorporate an internal stale-while-revalidate or client-cache engine to protect against rate limits and server drops.
- [x] Add explicit error handling structures to catch connection failures, preparing for offline fallback handling.

---

## 3. Feature Architecture (`src/features`)

- [x] **Converter Feature Subsystem**
- **Status:** ✅ Done (Target: 2026-07-18)
- **Description:** Deliver real-time conversions, searchable pickers, and live URL state mapping.
- [x] Build the primary conversion interface inside `features/converter/components`.
- [x] Create an accessible, searchable combo-box dropdown component to filter currencies.
- [x] Implement URL persistence logic (`?from=USD&to=EUR&amount=250`) keeping state fully bookmarkable.
- [x] Write one-click currency reversal hooks with zero layout shifting.

- [x] **Market Ticker & Chronological Chart Feature**
- **Status:** ✅ Done (Target: 2026-07-22)
- **Description:** Implement real-time pair overview tickers and interactive historical time-series canvas graphs.
- [x] Structure the currency pairs grid showing baseline 24-hour pricing shifts.
- [x] Integrate a performant charting approach (SVG or canvas layout) rendering data windows from 1 day up to 5 years.
- [x] Develop the interactive crosshair feature overlay tracking coordinates to surface dates and exact rates on mouse hover.

- [x] **Favorites Tracking & Comparison Engine**
- **Status:** ✅ Pending (Target: 2026-07-18)
- **Description:** Track high-priority currency pairs side by side and load contexts back into the converter.
- [x] Build the cross-currency matrix showing a single target base converted against multiple currencies simultaneously.
- [x] Implement toggle workflows enabling local storage tracking for guests, automatically upgrading to the Neon cloud datastore upon Google sign-in.
- [x] Create navigation hooks that swap the primary converter state instantly when a user clicks a favorite card.

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

## 5. Architectural Boundary Enforcement

- [x] **Dependency Setup & Environment Verification**
- **Status:** ✅ Done (Target: 2026-07-05)
- **Description:** Install the boundary evaluation plugin and verify your current ESLint environment can parse absolute path aliases.
- [x] Run `pnpm add -D eslint-plugin-boundaries` to add the core analyzer engine.
- [x] Verify that your `eslint.config.js` includes a TypeScript parser setup capable of expanding path mappings (`@/*` or absolute paths like `features/`).
- [x] Audit the `package.json` configurations to ensure standard lint shortcuts (`pnpm lint`) map correctly to the active configuration root.

- [x] **Configure Project Elements & Dynamic Capturing Groups**
- **Status:** ✅ Done (Target: 2026-07-05)
- **Description:** Map out the directory boundaries in your central configuration so the engine can categorize components by architectural layer.
- [x] Update `eslint.config.js` to initialize the boundaries plugin engine.
- [x] Add the `settings["boundaries/elements"]` array to your flat config workspace.
- [x] Define the `feature` capture zone with `mode: "folder"` and `capture: ["featureName"]` targeting the `features/*` pattern.
- [x] Map structural bounds for the foundational folders: `shared/*` (capturing `moduleName`), `infra/*`, and `app/*`.

- [x] **Establish Boundary Restrictions & Custom Assertions**
- **Status:** ✅ Done (Target: 2026-07-05)
- **Description:** Define strict dependency constraints to lock down feature coupling and protect your codebase's core architecture.
- [x] Activate the `boundaries/dependencies` validation rule inside the configurations array set to throw a baseline `"error"`.
- [x] Configure the rule block to disallow any element categorized as a `feature` from importing components or hooks from neighboring `feature` folders.
- [x] Attach strict foundational guards: restrict `shared/` elements from pointing upward into `infra/`, `features/`, or `app/`.
- [x] Formulate readable custom error logs (e.g., using `"{{from.captured.featureName}}"`) to output clear debugging steps upon violation.

- [x] **Execute Sandbox Testing & Codebase Sweeps**
- **Status:** ✅ Done (Target: 2026-07-05)
- **Description:** Validate the reliability of the new linter rules by running an intentional boundary failure sweep.
- [x] Run a standard baseline sweep (`pnpm lint`) to guarantee that your current project layout contains zero pre-existing boundary violations.
- [x] Open a file within an active feature workspace (e.g., `features/converter/`) and inject an intentional cross-feature link to a neighboring folder.
- [x] Execute `pnpm lint` and confirm the parser rejects the build while printing your custom cross-contamination error token.
- [x] Revert the structural code test to return your workspace to a fully compliant status.

Shifting to a **UI-First workflow** is a highly effective way to stabilize your design system, solidify user flows, and lock down accessibility (like testing your new Heading Level Manager) before getting bogged down in state management or API wiring.

Because we just implemented strict ESLint boundary rules, building your UI inside the `shared/` layer first ensures that your baseline presentation components remain entirely pure and decoupled from domain logic.

Here is the task scaffolding to execute this UI-to-Feature workflow systematically.

---

## 6. UI-First to Feature Integration Workflow

- [ ] **Phase 1: Build Shared Core UI Components (Design System Foundation)**
- **Status:** ⏳ Pending (Target: 2026-07-08)
- **Description:** Build the stateless, reusable presentation atomic parts inside `shared/components/ui` or similar, ensuring theme and typography managers are bound.
- [ ] Scaffold foundational inputs, buttons, tokens, and cards that will be universal across all views.
- [x] Integrate the new `Heading Level Manager` components (`<Main>`, `<Section>`, `<Heading>`) directly into core structural layouts.
- [x] Wrap the local presentation workspace in your unified `ThemeProvider` to verify dark/light variations on the raw components.
- [ ] Write targeted presentation-only tests checking styles, accessible tags, and variant configurations.

- [ ] **Phase 2: Assemble Global App Layouts & Page Wireframes**
- **Status:** ⏳ Pending (Target: 2026-07-10)
- **Description:** Compose your atomic UI components into broad application wireframes inside the `app/` folder using mock static data.
- [ ] Design the main layout shells (Navigation sidebars, persistent header grids, footers, responsive mobile wrappers).
- [ ] Compose dummy screens (e.g., placeholder Converter screen, Market Dashboard grid) relying exclusively on localized mock data arrays.
- [ ] Verify semantic outline structures using screen reader/DOM tools to ensure your heading manager scales depth correctly across full viewports.

- [ ] **Phase 3: Domain Extraction & Feature Module Isolation**
- **Status:** ⏳ Pending (Target: 2026-07-13)
- **Description:** Slice your visual layouts into isolated feature domains under `features/` and watch for boundary validation.
- [ ] Identify which chunks of the composed layouts belong to specific domains (e.g., the Currency Pair grid moves into `features/converter`).
- [ ] Migrate those view layouts into their corresponding `features/*` directory.
- [ ] Run `pnpm lint` immediately following migration to verify that these isolated views are not accidentally cross-importing from neighboring feature files.

- [ ] **Phase 4: Hook Integration & Business Logic Wiring**
- **Status:** ⏳ Pending (Target: 2026-07-15)
- **Description:** Replace the static mockup code inside your feature blocks with real reactive states, domain hooks, and external API pipelines.
- [ ] Swap out static layouts with local reactive states (`useState`, `useReducer`) to establish interactive view logic.
- [ ] Layer in your underlying processing engines (custom feature data hooks, infra-level API fetchers, cache persistence rules).
- [ ] Run the complete test suite (`pnpm test`) to guarantee your visual components transition fluidly between empty, loading, data, and fallback error states.

---

## Production Provisioning & Migration Pipeline Task List

### Phase 1: Neon Postgres Provisioning & Credentials

- [x] **Provision Neon Postgres Database**
- **Status:** ✅ Doing (Target: 2026-07-21)
- **Description:** Provision a production Neon Postgres database project and retrieve connection strings.
- [x] Create a new project in the [Neon Console](https://console.neon.tech).
- [x] Copy the **Pooled Connection String** (used by Next.js serverless functions at runtime to manage connection limits).
- [x] Copy the **Direct / Unpooled Connection String** (used during migration phase for DDL operations that require direct TCP / transaction isolation).

---

### Phase 2: Build-Phase Migration Pipeline Setup

- [x] **Configure Automated Database Migration Script**
- **Status:** ✅ Done (Target: 2026-07-21)
- **Description:** Integrate database migrations directly into the build command so schema updates run automatically before `next build` compiles the application.
- [x] Verify or add the migration runner script in `package.json`:

```json
{
  "scripts": {
    "db:migrate": "drizzle-kit migrate",
    "build": "pnpm db:migrate && next build"
  }
}
```

- [x] Ensure migration runner reads the unpooled `MIGRATION_DATABASE_URL` or `DATABASE_URL` environment variable during the execution phase.
- [x] Test migration command locally against a staging/test Neon branch to verify idempotency (ensuring re-running migrations on identical schema results in a no-op).

---

### Phase 3: Vercel Project Setup & Environment Injection

- [x] **Configure Vercel Environment & Deployment Pipeline**
- **Status:** ✅ Done (Target: 2026-07-21)
- **Description:** Link the project to Vercel, populate production secrets, and execute the deployment build.
- [x] Import the GitHub repository into Vercel.
- [x] Configure Production Environment Variables on Vercel:
  - `DATABASE_URL` → Neon Pooled Connection String (`postgres://...pooler.neon.tech/...`)
  - `MIGRATION_DATABASE_URL` → Neon Direct Connection String (`postgres://...neon.tech/...`)
  - Add any required Auth / App secrets.
  - [x] Set Build Command in Vercel Project Settings to `pnpm build` (or `npm run build`).

---

### Phase 4: Production Verification & Schema Validation

- [x] **Verify Production Deployment & Database Health**
- **Status:** ✅ Done (Target: 2026-07-21)
- **Description:** Inspect Vercel build logs, verify table structures in Neon, and test live database interaction.
- [x] Inspect Vercel Deployment Logs to confirm `pnpm db:migrate` completed successfully prior to Next.js compilation.
- [x] Check the Neon Dashboard / Drizzle Studio to confirm all tables, indexes, and enum types were created.
- [x] Perform smoke testing on the deployed Vercel URL (test sign-in, currency rate operations, and database read/write actions).

## Domain-Specific Hover & Focus State Design Alignment Task List

### Phase 1: Header & Top Utilities (`features/header`)

- [x] **Align Header Utilities & Theme Controls**
- **Status:** ✅ Done (Target: 2026-07-22)
- **Description:** Refine interactive states for theme toggle and authentication triggers in the top navigation header.
- [x] Apply focus-visible ring offsets and hover background highlights to the theme switcher button.
- [x] Update hover and keyboard focus-visible states on the header sign-in trigger button.

- [x] **Align Live Market Ticker Items**
- **Status:** ⏳ Done (Target: 2026-07-22)
- **Description:** Update hover and focus indicators across scrolling live market rate cards.
- [x] Update hover color for ticker currency links.
- [x] Ensure visible ticker links display text in accent color on keyboard navigation without disrupting the marquee layout.

---

### Phase 2: Main Navigation (`features/navigation`)

- [x] **Align Desktop & Mobile Navigation Links**
- **Status:** ✅ Done (Target: 2026-07-22)
- **Description:** Update hover, active, and focus states across desktop navbar links and mobile drawer controls.
- [x] Apply design-spec hover highlights and focus rings to desktop navigation links and badge pills.
- [x] Update mobile menu drawer trigger, close button, and full-width drawer link hover/focus states.

---

### Phase 3: Converter Module (`features/converter`)

- [x] **Align Converter Controls & Action Triggers**
- **Status:** ✅ Done (Target: 2026-07-22)
- **Description:** Refine interactive states across the core currency converter card.
- [x] Update focus-within rings and hover borders on amount input fields and currency picker dropdown triggers.
- [x] Apply rotation transitions and focus rings to the currency swapper button.
- [x] Align hover and focus states for the favorite toggler star button inside the converter.
- [x] Update hover and focus indicator states on the converter logs trigger link/button.

---

### Phase 4: History Module (`features/history`)

- [ ] **Align History Navigation Bar & Interactive Log Items**
- **Status:** ⏳ Todo (Target: 2026-07-23)
- **Description:** Align interactive elements within the history section and its internal sub-navigation bar.
- [ ] Update hover background fills, active tab indicators, and focus rings on the history section navigation bar links.
- [ ] Apply subtle hover highlight rows and focus outlines to individual history entries and action buttons.

---

### Phase 5: Compare Module (`features/compare`)

- [ ] **Align Compare Controls & Currency Management Actions**
- **Status:** ⏳ Todo (Target: 2026-07-23)
- **Description:** Refine hover and focus states on multi-currency comparison inputs and list management controls.
- [ ] Update hover and focus-visible states on the add currency trigger and dropdown selector.
- [ ] Apply hover state highlights and focus rings to the remove/delete currency buttons on compare items.

---

### Phase 6: Favorites Module (`features/favorites`)

- [ ] **Align Favorite Item Actions & Bulk Clearing**
- **Status:** ⏳ Todo (Target: 2026-07-23)
- **Description:** Update interactive feedback across favorite cards and bulk actions.
- [ ] Refine hover background shifts and focus rings on favorite item toggle triggers.
- [ ] Update hover state and focus-visible indicators for the "Clear All" favorites button.

---

### Phase 7: Logs Module (`features/logs`)

- [ ] **Align Log Item Operations & Export Actions**
- **Status:** ⏳ Todo (Target: 2026-07-23)
- **Description:** Align focus and hover feedback across conversion logs management controls.
- [ ] Apply hover highlights and focus-visible rings to individual log delete buttons.
- [ ] Update hover color shifts and focus rings for the bulk "Clear Logs" action button.
- [ ] Refine hover transitions and focus outlines on the "Export to CSV" action button.

---

### Phase 8: Account Feature (`features/account`)

- [x] **Align Auth Cards & Account Actions**
- **Status:** ⏳ Done (Target: 2026-07-22)
- **Description:** Update input and action button focus/hover states across authentication cards.
- [x] Update focus-within rings on input fields and hover states on submit buttons inside the Login card.
- [x] Apply hover background shifts and focus-visible rings to the Log Out card action button.
