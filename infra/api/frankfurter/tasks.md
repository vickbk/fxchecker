## Infrastructure Layer: Resilient Frankfurter API Client (TDD Workflow)

### Phase 1: Type Contracts & Error Handling (Red-Green-Refactor)

- [x] **Write Failing Tests for Core Requests & Error Handling (RED)**
  - **Status:** ✅ Done (Target: 2026-07-06)
  - **Description:** Establish the modular folder architecture, define strict TypeScript network contracts, and write Vitest test suites that assert correct parsing and error classification using mock network payloads.
  - [x] Scaffold the module directory block at `infra/api/frankfurter/` containing `errors.ts`, `types.ts`, `service.ts`, and the barrel entry point `index.ts`.
  - [x] Create the test file `infra/api/frankfurter/service.test.ts`.
  - [x] Write a test asserting that `fetchLatestRates()` correctly processes valid Frankfurter payloads (base, date, rates mapping).
  - [x] Write tests asserting that the client throws distinct, strongly-typed domain errors (inheriting from a unified `FrankfurterError` base class) for standard edge cases:
    - `FrankfurterRateLimitError` on HTTP `429` status codes.
    - `FrankfurterValidationError` on HTTP `422` (invalid currency code).
    - `FrankfurterOfflineError` when a network request completely fails to connect.

- [x] **Implement Core Client Fetch Logic to Pass Tests (GREEN)**
  - **Status:** ✅ Done (Target: 2026-07-07)
  - **Description:** Implement minimal functional code within the decoupled layout to satisfy the basic fetch and error handling tests.
  - [x] Build rigid TypeScript interface mappings inside `infra/api/frankfurter/types.ts` for `/latest`, `/{date}` (historical), and `/timeseries` endpoints to lock down the provider surface contract.
  - [x] Implement custom error structures inside `infra/api/frankfurter/errors.ts` establishing the domain boundary.
  - [x] Implement the base fetch operations using a clean `globalThis.fetch` mechanism inside `infra/api/frankfurter/service.ts`, explicitly processing incoming status codes to throw corresponding custom exceptions.
  - [x] Wire public interfaces through `infra/api/frankfurter/index.ts` to form a clean module boundary wrapper.

---

### Phase 2: High-Performance SWR Caching Layer (Red-Green-Refactor)

- [x] **Write Failing Tests for the Cache Execution Lifecycle (RED)**
  - **Status:** ✅ Done (Target: 2026-07-06)
  - **Description:** Establish explicit timing assertions inside `infra/api/frankfurter/service.test.ts` to enforce rate-limit shielding and stale-while-revalidate functionality.
  - [x] Write a test asserting that calling `fetchLatestRates()` back-to-back executes a single network request while resolving the second call immediately from the local module cache.
  - [x] Write an asynchronous SWR test case using Vitest's fake timers (`vi.useFakeTimers()`): when data is past its TTL (Time-To-Live), the client must immediately resolve with the _stale_ cached data while silently spawning a background network fetch to refresh the internal state storage.

- [x] **Implement Zero-Allocation In-Memory SWR Engine (GREEN)**
  - **Status:** ✅ Done (Target: 2026-07-06)
  - **Description:** Build a highly performant, lightweight in-memory cache mechanism inside the service to meet the rate-limit protection requirements.
  - [x] Implement an internal, highly optimized cash map (`private cache = new Map<string, CacheEntry>()`) inside `service.ts` to track responses without adding bulky runtime weight.
  - [x] Add the non-blocking background refresh logic: if a stale cache hit is detected, trigger the network promise detached from the main execution thread to update the storage layout asynchronously.

---

### Phase 3: V2 API Endpoints, Metadata Dictionary, & Rate Extraction

- [ ] **Write Failing Tests for V2 Endpoint Structures & Metadata (RED)**
  - **Status:** ⏳ Pending (Target: 2026-07-12)
  - **Description:** Formulate Vitest specs asserting correct endpoint routing, query assembly, and signature normalization matching Frankfurter V2.
  - [ ] Write a test asserting that `fetchCurrencies()` requests `/currencies` and correctly handles the full key-value text descriptor dictionary object.
  - [ ] Write a test asserting that `fetchCurrencyDetails(code)` targets the distinct path element `/currency/:currency` (e.g., `/currency/USD`).
  - [ ] Write tests confirming the core `/rates` query parameter layout matrix:
    - Current rates fetch (`/rates`)
    - Historical query assembly (`/rates?from=2026-07-11`)
    - Base filtering execution (`/rates?base=USD`)
    - Multi-target symbols mapping (`/rates?quotes=EUR,GBP`)
  - [ ] Write an explicit test for `getRate(from, to)` to verify it strips down a multi-key object payload, providing a single flat returned instance: `{ rate: number, from: string, to: string }`.

- [x] **Implement V2 Spec Routings, Metadata Lookups & Rate Extractors (GREEN)**
  - **Status:** ⏳ Done (Target: 2026-07-13)
  - **Description:** Adjust types and services inside `service.ts` to fully adapt to V2 structural schemas.
  - [x] Expand `infra/api/frankfurter/types.ts` to support the dictionary map layout for `/currencies` and `/currency/:currency`.
  - [x] Implement `fetchCurrencies()` and `fetchCurrencyDetails(code)` passing payloads safely through the shared SWR engine.
  - [x] Refactor existing rates routing to discard deprecated structural configurations, shifting fully to the core `/rates` parameter matrix matching V2 signatures.
  - [x] Implement `getRate(from, to)` helper leveraging internal cache engines, delivering zero-overhead calculations directly to consumer models.

---

### Phase 4: Verification & Boundary Verification

- [x] **Refactor and Assert Architectural Enforcements**
  - **Status:** ⏳ In progress (Target: 2026-07-14)
  - **Description:** Clean up code paths for raw execution speed and verify folder layer boundaries remain completely uncompromised.
  - [x] Refactor cache access loops to optimize memory footprint and execution latency.
  - [x] Run `pnpm lint` to ensure that `infra/api/frankfurter/` maintains absolute layer isolation and doesn’t look upward into outer features or unauthorized application domains.
  - [x] Run `pnpm build` to guarantee zero compilation or type inference regressions down to the Next.js production build output.
