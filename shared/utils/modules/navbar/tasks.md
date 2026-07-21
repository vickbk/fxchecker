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
- **Status:** ⏳ Todo (Target: 2026-07-23)
- **Description:** Import feature getter functions into the main Navigation / Header component and pass count values down to navigation link badges.
- [ ] Fetch log and favorite counts concurrently within the Navigation Server Component (e.g., using `Promise.all([getLogsCount(), getFavoritesCount()])`).
- [ ] Attach badge pill indicators to the **Logs** and **Favorites** navigation items:

```tsx
<NavLink href="/logs">
  Logs
  {logsCount > 0 && <Badge>{logsCount}</Badge>}
</NavLink>
```

- [ ] Ensure responsive badge scaling across desktop navbar and mobile drawer views.

---

### Phase 3: Cache Invalidation & UX Verification

- [ ] **Revalidation & Verification Sweep**
- **Status:** ⏳ Todo (Target: 2026-07-23)
- **Description:** Verify cache tag revalidation when adding/clearing logs or toggling favorites, and confirm zero-state UI behavior.
- [ ] Tag count queries for revalidation (`revalidateTag('logs-count')` / `revalidateTag('favorites-count')`) when mutation actions complete.
- [ ] Verify that adding or removing a favorite immediately updates the navigation badge count.
- [ ] Verify that clearing or logging a conversion updates the log badge count dynamically.
- [ ] Test zero-count states to ensure no empty or layout-shifting badge elements remain in the DOM.
