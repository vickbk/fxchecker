## Compare Feature: Multi-Currency Comparison Dashboard Implementation

### Phase 1: Database Schema Configuration (Drizzle ORM)

- [x] **Drizzle Schema Extension**
- **Status:** ✅ Done (Target: 2026-07-15)
- **Description:** Establish a robust database-level persistence layer using Drizzle ORM to store custom currency lists for authenticated users.
- [x] Import PostgreSQL/Drizzle helpers inside `compare/db/schema.ts`.
- [x] Create and export the `cx_compare` table:
  - Bind the primary key to `users.id` with cascade deletion constraints.

- [x] Define `currency_list` as an array column:
  - Map it to a string array.
  - Establish our default fallback basket: `["EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "ZAR"]`.

- [x] Generate and apply database migrations cleanly:
- Run `pnpm drizzle-kit generate`
- Run `pnpm drizzle-kit migrate`

- [x] Verify generated SQL output scripts contain array-based column constraints.

---

### Phase 2: Server-Side Comparison Engine & Safe Resolvers

- [ ] **API Data Matching & Self-Comparison Safeguard**
- **Status:** ⏳ Todo (Target: 2026-07-17)
- **Description:** Build helper functions and server actions to resolve comparison targets on the server while avoiding self-comparison calculations.
- [x] Declare global fallback lists:
- Predefined basket: `["EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "ZAR"]`

- [x] Write the `resolveCompareList(baseCurrency, savedList)` helper:
- Check if active base currency overlaps with the comparison target list.
- Replace the colliding currency with a unique item from the replacement pool.

- [ ] Expose an authenticated Server Action `updateCompareList(newList)`:
- Validate auth session on incoming writes.
- Commit sanitized changes to `cx_compare` table.

- [ ] Test base currency mutation triggers:
- Confirm selecting `EUR` as base filters out the `EUR` row and resolves to a fallback replacement automatically.

---

### Phase 3: Client-Side Interceptor & Auth Integration

- [ ] **Unauthenticated Interaction Guard**
- **Status:** ⏳ Todo (Target: 2026-07-18)
- **Description:** Implement client-side protection hooks to intercept unauthenticated actions (such as adding or deleting rows) and prompt guest users with a dedicated login pop-up.
- [ ] Build custom utility hook `useCompareGuard`:
- Pull current system session states.

- [ ] Implement UI operation wrapper `guardAction(action)`:
- Execute incoming callback if authenticated.
- Trigger global login modal if session is missing.

- [ ] Support dynamic login prompt parameters in your global login dialog:
- Customize target display copy: _"Only logged-in users can customize and save their currency comparison list."_

- [ ] Verify guest button actions reliably open the auth boundary dialog.

---

### Phase 4: Interactive Compare Dashboard UI

- [ ] **State-Linked Dashboard Interface**
- **Status:** ⏳ Todo (Target: 2026-07-20)
- **Description:** Assemble the stateless Server Page using Next.js `searchParams` alongside a fluid, optimistic-update-ready client table wrapper.
- [ ] Create server page configuration `src/app/compare/page.tsx`:
- Resolve asynchronous search values (`base`, `amount`).
- Query target currency rate feeds from endpoints.

- [ ] Layout the stable dashboard grid interface:
- Render rows showing currency codes, full names, rates, and values.

- [ ] Bind row deletion hooks and addition menus to `guardAction`.
- [ ] Implement client-side optimistic rendering:
- Delete/Insert items in UI state instantly.
- Fire background database mutations concurrently.

- [ ] Test layout behavior for shift-free responsiveness when converting amounts.
