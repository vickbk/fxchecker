# Converter feature Tasks

## Features Layer: High-Fidelity Converter Subsystem (TDD Workflow)

### Phase 1: Bookmarkable URL Engine & Custom Hooks (Red-Green-Refactor)

- [ ] **Write Failing Specs for URL Synchronization (RED)**
- **Status:** ⏳ Pending (Target: 2026-07-06)
- **Description:** Build Vitest specs verifying that custom interaction hooks properly extract, parse, and synchronize currency state from Next.js URL query parameters.
- [ ] Create test file `features/converter/hooks/useURLState.test.ts`.
- [ ] Write a test asserting that default fallback values (`USD`, `EUR`, `100`) load cleanly if the search parameters are completely empty.
- [ ] Write a test asserting that updating the state smoothly serializes values into the URL string format (`?from=GBP&to=JPY&amount=500`) using modern Next.js navigation mocks.

- [ ] **Implement URL State & Swap Logic (GREEN)**
- **Status:** ⏳ Pending (Target: 2026-07-11)
- **Description:** Write the minimal hook logic to drive state changes and provide a zero-layout-shift swap function.
- [ ] Implement `useURLState.ts` inside `features/converter/hooks/` to bind `from`, `to`, and `amount` states to the Next.js router natively.
- [ ] Implement `useCurrencySwap.ts` to execute a one-click reversal of the `from` and `to` assets, ensuring state changes are wrapped in a single unified router step to prevent dual-render flickering.

---

### Phase 2: Accessible Searchable Picker & Converter View (Red-Green-Refactor)

- [ ] **Write Unit Tests for the Searchable Combobox (RED)**
- **Status:** ⏳ Pending (Target: 2026-07-12)
- **Description:** Formulate accessibility and keyboard-navigation specifications for filtering through available currencies.
- [ ] Create test file `features/converter/components/CurrencyPicker.test.ts`.
- [ ] Assert that typing a currency code (e.g., "CH") dynamically limits the list options down to matching records ("CHF").
- [ ] Assert correct ARIA keyboard behaviors (`ArrowDown` moves focus, `Enter` selects the active item).

- [ ] **Build Layout-Stable Accessible UI (GREEN)**
- **Status:** ⏳ Pending (Target: 2026-07-14)
- **Description:** Craft the physical view blocks using semantic components with absolute height/width constraints to prevent irritating layout shifting during network loading cycles.
- [ ] Build the searchable combobox component inside `features/converter/components/CurrencyPicker.tsx` using fully compliant HTML ARIA attributes.
- [ ] Build `features/converter/components/ConverterCard.tsx` as the layout-stable wrapper that encapsulates the amount inputs, picking dropdowns, and target conversion readouts.
- [ ] Put down explicit visual placeholder skeletons to preserve the exactly calculated container space while background currency calculations are active.

---

### Phase 3: Real-Time Interactors & Verification

- [ ] **Integrate Infrastructure & Assert Performance Boundaries**
- **Status:** ⏳ Pending (Target: 2026-07-16)
- **Description:** Glue the UI layer to our high-performance `shared/cache` and Frankfurter client infrastructure layer.
- [ ] Connect `ConverterCard` to our pre-built `fetchLatestRates` infrastructure service using an optimal client-side integration hook (or SWR/React Query wrapper).
- [ ] Run `pnpm lint` and `pnpm test` across the `features/converter` layout to check that it imports cleanly from `shared/cache` and `infra/api/frankfurter` without creating circular dependency trees.
- [ ] Execute an automated Playwright layout test to guarantee that shifting between input values or toggling currency reversals maintains an absolute **Cumulative Layout Shift (CLS)** score of 0.
