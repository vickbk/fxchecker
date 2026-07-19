# Converter feature Tasks

## Features Layer: High-Fidelity Converter Subsystem (TDD Workflow)

### Phase 1: Bookmarkable URL Engine & Custom Hooks (Red-Green-Refactor)

- [x] **Write Failing Specs for URL Synchronization (RED)**
- **Status:** ✅ Done (Target: 2026-07-06)
- **Description:** Build Vitest specs verifying that custom interaction hooks properly extract, parse, and synchronize currency state from Next.js URL query parameters.
- [x] Create test file `features/converter/hooks/useURLState.test.ts`.
- [x] Write a test asserting that default fallback values (`USD`, `EUR`, `100`) load cleanly if the search parameters are completely empty.
- [x] Write a test asserting that updating the state smoothly serializes values into the URL string format (`?from=GBP&to=JPY&amount=500`) using modern Next.js navigation mocks.

- [x] **Implement URL State & Swap Logic (GREEN)**
- **Status:** ✅ Done (Target: 2026-07-06)
- **Description:** Write the minimal hook logic to drive state changes and provide a zero-layout-shift swap function.
- [x] Implement `useURLState.ts` inside `features/converter/hooks/` to bind `from`, `to`, and `amount` states to the Next.js router natively. It also handles currency swap.

---

### Phase 2: Accessible Searchable Picker & Converter View (Red-Green-Refactor)

- [x] **Write Unit Tests for the Searchable Combobox (RED)**
- **Status:** ✅ Done (Target: 2026-07-07)
- **Description:** Formulate accessibility and keyboard-navigation specifications for filtering through available currencies.
- [x] Create test file `features/converter/components/CurrencyPicker.test.ts`.
- [x] Assert that typing a currency code (e.g., "CH") dynamically limits the list options down to matching records ("CHF").
- [x] Assert correct ARIA keyboard behaviors (`ArrowDown` moves focus, `Enter` selects the active item).

- [x] **Build Layout-Stable Accessible UI (GREEN)**
- **Status:** ✅ Done (Target: 2026-07-14)
- **Description:** Craft the physical view blocks using semantic components with absolute height/width constraints to prevent irritating layout shifting during network loading cycles.
- [x] Build the searchable combobox component inside `features/converter/components/CurrencyPicker.tsx` using fully compliant HTML ARIA attributes.
- [x] Build `features/converter/components/ConverterCard.tsx` as the layout-stable wrapper that encapsulates the amount inputs, picking dropdowns, and target conversion readouts.
- [x] Put down explicit visual placeholder skeletons to preserve the exactly calculated container space while background currency calculations are active.

---

### Phase 3: Real-Time Interactors & Verification

- [x] **Integrate Infrastructure & Assert Performance Boundaries**
- **Status:** ✅ Done (Target: 2026-07-16)
- **Description:** Glue the UI layer to our high-performance `shared/cache` and Frankfurter client infrastructure layer.
- [x] Connect `ConverterCard` to our pre-built `fetchLatestRates` infrastructure service using an optimal client-side integration hook (or SWR/React Query wrapper).
- [x] Run `pnpm lint` and `pnpm test` across the `features/converter` layout to check that it imports cleanly from `shared/cache` and `infra/api/frankfurter` without creating circular dependency trees.
- [ ] Execute an automated Playwright layout test to guarantee that shifting between input values or toggling currency reversals maintains an absolute **Cumulative Layout Shift (CLS)** score of 0.
