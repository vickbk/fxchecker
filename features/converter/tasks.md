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

## Feature Decoupling & Composition Root Task List

### Phase 1: Feature Encapsulation (`favorites` & `logs`)

- [ ] **Encapsulate `FavoriteToggler` Component**
- **Status:** ⏳ Doing (Target: 2026-07-20)
- **Description:** Move all favorite UI, state handling, and interceptor hooks into a self-contained component inside the `favorites` feature folder.
- [x] Create `src/features/favorites/components/FavoriteToggler.tsx`:
  - [x] Consume `useURLStatus` internally to read `base` and `quote` parameters.
  - [x] Embed the active favorite status query and `toggleFavoritePair` server action call.
  - [x] Wrap the toggle trigger inside `SignInInterceptor` with the context prompt: _"Login to save this currency pair to your favorites."_

- [x] Re-export `FavoriteToggler` from `src/features/favorites/index.ts`.

- [x] **Encapsulate `ConversionLogger` Component**
- **Status:** ✅ Done (Target: 2026-07-20)
- **Description:** Consolidate automatic URL conversion logging.
- [x] Create `src/features/logs/components/ConversionLogger.tsx`:
  - Consume `useURLStatus` internally to detect parameter changes (`base`, `quote`, `amount`, `result`).
  - Trigger `logConversion` automatically when active parameter sets update.
  - Render the chronological history list, `ExportCsvButton`, and `clearAllLogs` button—each wrapped in their respective `SignInInterceptor` boundaries.

- [x] Re-export `ConversionLogger` from `src/features/logs/index.ts`.

---

### Phase 2: Slotted `ConverterCard` Refactoring

- [x] **Convert `ConverterCard` to Pure Composition Slot Model**
- **Status:** ✅ Done (Target: 2026-07-20)
- **Description:** Remove all direct imports of favorite or log actions/schemas from the `converter` feature, refactoring `ConverterCard` to accept passive `ReactNode` props.
- [x] Update `ConverterCardProps` interface in `src/features/converter/components/ConverterCard.tsx`:

```ts
interface ConverterCardProps {
  favoriteToggle?: React.ReactNode;
  conversionLogger?: React.ReactNode;
}
```

- [x] Remove imports referencing `@/features/favorites` and `@/features/logs` inside `ConverterCard.tsx`.
- [x] Position `{favoriteToggle}` in the card header toolbar and `{conversionLogger}` in the bottom content area.
- [x] Ensure `ConverterCard` relies strictly on `useURLStatus` for its own conversion calculation interface.

---

### Phase 3: Composition Root & Suspense Setup (`layout.tsx`)

- [x] **Assemble Composition Root with `<Suspense>` Boundary**
- **Status:** ✅ Done (Target: 2026-07-20)
- **Description:** Compose the feature components together inside `app/layout.tsx` while wrapping URL-dependent client components in a Next.js `<Suspense>` boundary.
- [x] Create a fallback component `<ConverterSkeleton/>` for loading states during client hydration.
- [x] Refactor `app/layout.tsx`:
- Import `ConverterCard` from `@/features/converter`.
- Import `FavoriteToggler` from `@/features/favorites`.
- Import `ConversionLogger` from `@/features/logs`.

- [x] Wrap `ConverterCard` inside `<Suspense fallback="{<ConverterSkeleton"/>}>` inside `layout.tsx`.
- [x] Pass the components directly as JSX props:

```tsx
<ConverterCard
  favoriteToggle={<FavoriteToggler />}
  conversionLogger={<ConversionLogger />}
/>
```

---

### Phase 4: Validation & Boundary Sweep

- [x] **Build Verification & Dependency Audit**
- **Status:** ✅ Todo (Target: 2026-07-20)
- **Description:** Verify that cross-feature imports are eliminated and static site generation succeeds without `useSearchParams` hydration warnings.
- [x] Run `pnpm lint` to confirm zero circular dependencies between feature modules.
- [x] Run `pnpm build` to confirm Next.js compiles the layout segment cleanly without de-opting page generation.
- [x] Verify runtime behavior:
- Navigating between currency pairs updates the URL via `useURLStatus`.
- `FavoriteToggler` reflects status changes independently.
- `ConversionLogger` logs calculation entries and exposes export/clear controls cleanly.
