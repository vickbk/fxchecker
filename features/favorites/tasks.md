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

- [ ] **State Mutation Actions Engine**
- **Status:** ⏳ Doing (Target: 2026-07-18)
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

- [ ] **Converter Pair Star Interception**
- **Status:** ⏳ Todo (Target: 2026-07-18)
- **Description:** Inject the favorite toggle button alongside the main converter interface to bookmark active currency pairs effortlessly.
- [ ] Locate the main converter viewport component layout.
- [ ] Render a visual "Star" icon button positioned cleanly near the conversion layout header.
- [ ] Wrap the star button element inside the client-side `SignInInterceptor`.
- [ ] Inject the explicit context prompt string: _"Login to save this currency pair to your personalized favorites list."_
- [ ] Bind the button `onClick` trigger directly to your `toggleFavoritePair` routine, passing the active base and quote values.

---

### Phase 4: UI Integration — Compare Feature & Favorites Reset

- [ ] **Dashboard Row Bookmarking & Clean Reset Actions**
- **Status:** ⏳ Todo (Target: 2026-07-22)
- **Description:** Expand rows inside the comparison dashboard grid to include single-click favoriting capabilities, and add an isolated clear interface.
- [ ] Open the `CompareDashboard` layout grid component.
- [ ] Add a favoriting option column right next to each currency row's trash icon.
- [ ] Pass the row's corresponding pairing values (`base` from page state, row currency as `quote`) straight into another `SignInInterceptor` wrapper block.
- [ ] Mount a "Clear Favorite Pairs" action option inside your user preferences layout profile dashboard menu.
- [ ] Bind that option to trigger your `clearAllFavorites` server sequence.
- [ ] Run verification verification test loops:
- Execute `pnpm build` and `pnpm lint` to ensure zero boundary breaks across features.
