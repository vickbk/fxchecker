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

- [x] **API Data Matching & Self-Comparison Safeguard**
- **Status:** ⏳ Done (Target: 2026-07-15)
- **Description:** Build helper functions and server actions to resolve comparison targets on the server while avoiding self-comparison calculations.
- [x] Declare global fallback lists:
- Predefined basket: `["EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "ZAR"]`

- [x] Write the `resolveCompareList(baseCurrency, savedList)` helper:
- Check if active base currency overlaps with the comparison target list.
- Replace the colliding currency with a unique item from the replacement pool.

- [x] Expose an authenticated Server Action `updateCompareList(newList)`:
- Validate auth session on incoming writes.
- Commit sanitized changes to `cx_compare` table.

- [x] Test base currency mutation triggers:
- Confirm selecting `EUR` as base filters out the `EUR` row and resolves to a fallback replacement automatically.

---

### Phase 3: Client-Side Interceptor & Auth Integration

- [x] **Unauthenticated Interaction Guard**
  - **Status:** ✅ Done (Target: 2026-07-16)
  - **Description:** Implement a client-side component-driven auth boundary using custom React Context and native HTML Popovers to dynamically intercept guest interactions and inject context-specific login prompts.
  - [x] Implement `SignInContext` and custom `useSignInCtx` hook:
    - Maintain dynamic state for `title` and `description` to customize the sign-in modal dynamically.
  - [x] Build the interactive `SignInTrigger` component:
    - Target the native `#sign-in-dialog` popover using the `popoverTarget` HTML attribute.
    - Update `SignInContext` with contextual text strings on trigger click.
  - [x] Develop the polymorphic `SignInInterceptor` Client Component:
    - Bind to current user session state (`useSession`).
    - Resolve the layout safely: render a default loading state during hydration to prevent visual flashes.
    - **Guest Route:** Render `SignInTrigger` to catch actions and pop open the auth dialog.
    - **Authenticated Route:** Render a normal button executing the target `onClick` callback wrapped in `useTransition`.
  - [x] Set up popover dynamic cleanup using the native `onToggle` event:
    - Clear state descriptions when `newState === "closed"` (with a safe timeout buffer to match the modal's exit transition).
  - [x] Verify both interaction loops:
    - Confirm guests cleanly trigger the dialog with the custom prompt: _"Login to use the remove currency from compare list feature..."_
    - Confirm authenticated users execute the passed `onClick` logic directly without invoking the modal.

---

### Phase 4: Interactive Compare Dashboard UI

- [ ] **State-Linked Dashboard Interface**
- **Status:** ⏳ Doing (Target: 2026-07-17)
- **Description:** Assemble the stateless Server Page using Next.js `searchParams` alongside a fluid, optimistic-update-ready client table wrapper.
- [x] Create server page configuration `src/app/compare/page.tsx`:
  - Resolve asynchronous search values (`base`, `amount`).
  - Query target currency rate feeds from endpoints.

- [x] Layout the stable dashboard grid interface:
  - Render rows showing currency codes, full names, rates, and values.

- [x] Bind row deletion hooks and addition menus to `guardAction`.
- [ ] Implement client-side optimistic rendering:
  - Delete/Insert items in UI state instantly.
  - Fire background database mutations concurrently.

- [ ] Test layout behavior for shift-free responsiveness when converting amounts.
