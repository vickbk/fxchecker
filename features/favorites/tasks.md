## Favorites Feature: Cross-Feature Currency Pair Customization

### Phase 1: Database Schema Configuration (Drizzle ORM)

- [x] **Drizzle Favorites Schema Definition**
- **Status:** ✅ Done (Target: 2026-07-18)
- **Description:** Establish the database persistence structure using Drizzle ORM to house persistent currency pairings linked directly to authenticated accounts.
- [x] Open your Drizzle schema file and export the new `ex_favorites` table definition.
- [x] Add the `userId` primary key column, referencing the core users table with a `cascade` delete modifier.
- [x] Define the `favoritePairs` column as a `text().array().notNull().default([])` structure.
- Document the string format explicitly within the codebase as `"BASE-QUOTE"` (e.g., `"USD-EUR"`).

- [x] Execute database sync scripts to generate and run the migrations:
- Run `pnpm drizzle-kit generate`
- Run `pnpm drizzle-kit migrate`

- [x] Verify generated SQL output scripts contain the correct array column constraints without touching unrelated domains.

---

### Phase 2: Core Server Actions & Isolated Reset Layer

- [x] **State Mutation Actions Engine**
- **Status:** ✅ Done (Target: 2026-07-18)
- **Description:** Create isolated, type-safe Next.js Server Actions to safely append, remove, or entirely clear user favorites behind strict authentication verification.
- [x] Build the `toggleFavoritePair({base: string, quote: string})` Server Action:
- Validate active auth session context.
- Format incoming pairings into the standardized string token: `const pairToken = "${base}-${quote}"`.
- Fetch the current array, check if the token exists, and either append or filter it out.

- [x] Build the `clearAllFavorites()` Server Action:
- Secure the execution thread behind auth session validation.
- Mutate the `favoritePairs` column back to an empty array `[]` for the active user row in `ex_favorites`.

- [x] Verify actions return clean, serializable response objects: `{ success: boolean; error?: string }`.

---

### Phase 3: UI Integration — Converter Feature

- [x] **Converter Pair Star Interception**
- **Status:** ✅ Done (Target: 2026-07-18)
- **Description:** Inject the favorite toggle button alongside the main converter interface to bookmark active currency pairs effortlessly.
- [x] Locate the main converter viewport component layout.
- [x] Render a visual "Star" icon button positioned cleanly near the conversion layout header.
- [x] Wrap the star button element inside the client-side `SignInInterceptor`.
- [x] Inject the explicit context prompt string: _"Login to save this currency pair to your personalized favorites list."_
- [x] Bind the button `onClick` trigger directly to your `toggleFavoritePair` routine, passing the active base and quote values.

---

### Phase 4: UI Integration — Compare Feature & Favorites Reset

- [x] **Dashboard Row Bookmarking & Clean Reset Actions**
- **Status:** ✅ Done (Target: 2026-07-18)
- **Description:** Expand rows inside the comparison dashboard grid to include single-click favoriting capabilities, and add an isolated clear interface.
- [x] Open the `CompareDashboard` layout grid component.
- [x] Add a favoriting option column right next to each currency row's trash icon.
- [x] Pass the row's corresponding pairing values (`base` from page state, row currency as `quote`) straight into another `SignInInterceptor` wrapper block.
- [x] Mount a "Clear Favorite Pairs" action option inside your user preferences layout profile dashboard menu.
- [x] Bind that option to trigger your `clearAllFavorites` server sequence.
- [x] Run verification verification test loops:
- Execute `pnpm build` and `pnpm lint` to ensure zero boundary breaks across features.

## Reusable Favorites Wrapper & Compare Decoupling Task List

### Phase 1: Reusable Slot Creation in `features/favorites`

- [x] **Create Generic `FavoriteToggleWrapper` Component**
- **Status:** ✅ Done (Target: 2026-07-22)
- **Description:** Implement a generic slot wrapper in `src/features/favorites/components/FavoriteToggleWrapper.tsx` that encapsulates favorite submission handling for any currency pair.
- [x] Define explicit props accepting `baseCurrency`, `targetCurrency` and `SignInInterceptor`.
- [x] Handle server action execution (`toggleFavoriteAction`) with server form.
- [x] Export `FavoriteToggleWrapper` from the `features/favorites` public entry point.

---

### Phase 2: Refactor `features/compare` to Accept Generic Wrapper

- [ ] **Decouple `MainCompare` from Favorites Domain**
- **Status:** ⏳ Doing (Target: 2026-07-22)
- **Description:** Remove all direct references, hooks, or imports from `features/favorites` inside `features/compare`.
- [ ] Update `MainCompareProps` to accept an optional `FavoriteSlot` (or `FavoriteWrapper`) component prop.
- [ ] Render the passed slot component inside the compare card layout, forwarding the base and target currency values.
- [ ] Confirm zero imports from `@/features/favorites` exist anywhere inside `src/features/compare/`.

---

### Phase 3: Page-Level Composition Layer Wiring

- [ ] **Wire `FavoriteToggleWrapper` into Compare Page Route**
- **Status:** ⏳ Todo (Target: 2026-07-23)
- **Description:** Inject `FavoriteToggleWrapper` into `MainCompare` at the composition layer in the compare route page.
- [ ] Import `MainCompare` from `@/features/compare` and `FavoriteToggleWrapper` from `@/features/favorites` inside the page route component.
- [ ] Pass `FavoriteToggleWrapper` directly to `MainCompare` via the slot prop.

---

### Phase 4: Testing & Verification

- [ ] **Isolation & Integration Sweep**
- **Status:** ⏳ Todo (Target: 2026-07-23)
- **Description:** Verify isolated component rendering and end-to-end favorite toggling.
- [ ] Write a unit test for `MainCompare` using a dummy mock slot to confirm it renders cleanly without dependencies on `favorites`.
- [ ] Test toggling favorites on the live compare page and verify that navigation badges and query caches update instantly.
