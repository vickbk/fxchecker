## Navigation Badge Numbers Implementation Task List

### Phase 1: Feature-Level Count Exporters

- [x] **Expose Log Count API in `features/logs**`
- **Status:** ✅ Done (Target: 2026-07-21)
- **Description:** Export a lightweight getter function from the `logs` feature module that queries the database or cache and returns a primitive `number`.
- [x] Implement `getLogsCount(): Promise<number>` (or `fetchLogsCount()`) in `src/features/logs/utils.ts` (or domain export entrypoint).
- [x] Ensure strict error handling returning `0` on fallback/empty states.

- [x] **Expose Favorite Count API in `features/favorites**`
- **Status:** ✅ Doing (Target: 2026-07-21)
- **Description:** Export a lightweight getter function from the `favorites` feature module that returns the active user's favorite count as a primitive `number`.
- [x] Implement `getFavoritesCount(): Promise<number>` in `src/features/favorites/utils.ts`.
- [x] Ensure guest/unauthenticated states return `0` cleanly without throwing errors.

---

### Phase 2: Navigation UI & Badge Integration

- [ ] **Wire Feature Counts into Navigation Items**
- **Status:** ⏳ Doing (Target: 2026-07-21)
- **Description:** Import feature getter functions into the main Navigation / Header component and pass count values down to navigation link badges.
- [x] Fetch log and favorite counts concurrently within the Navigation Server Component.
- [x] Attach badge pill indicators to the **Logs** and **Favorites** navigation items:
- [x] Ensure responsive badge scaling across desktop navbar and mobile drawer views.

---

### Phase 3: Cache Invalidation & UX Verification

- [x] **Revalidation & Verification Sweep**
- **Status:** ⏳ Done (Target: 2026-07-21)
- **Description:** Verify cache tag revalidation when adding/clearing logs or toggling favorites, and confirm zero-state UI behavior.
- [x] Tag count queries for revalidation (`revalidateTag('logs-count')` / `revalidateTag('favorites-count')`) when mutation actions complete.
- [x] Verify that adding or removing a favorite immediately updates the navigation badge count.
- [x] Verify that clearing or logging a conversion updates the log badge count dynamically.
- [x] Test zero-count states to ensure no empty or layout-shifting badge elements remain in the DOM.

---

### Phase 4: Mobile Menu Active Route Highlighting Fix

- [x] **Fix Stale Active State in Mobile Navigation Drawer**
- **Status:** ✅ Done (Target: 2026-07-21)
- **Description:** Fix the mobile menu navigation items so the currently active route is dynamically highlighted based on the current URL path, resolving the bug where it remains stuck on "history".
- [x] Inspect mobile drawer menu component (`MobileNav` / `NavDrawer`).
- [x] Replace hardcoded or static active index state with dynamic path matching using `useActiveOption()`.

- [x] Apply active styling (e.g., active background/text highlight) and `aria-current={isActive ? "page" : undefined}` dynamically to each drawer link.
- [x] Confirm drawer closes cleanly upon navigation while updating the active route indicator.
