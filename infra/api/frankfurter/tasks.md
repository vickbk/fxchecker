## Infrastructure Layer: Resilient Frankfurter API Client (TDD Workflow)

### Phase 1: Type Contracts & Error Handling (Red-Green-Refactor)

- [x] **Write Failing Tests for Core Requests & Error Handling (RED)**
- **Status:** ⏳ Done (Target: 2026-07-06)
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

- [ ] **Implement Zero-Allocation In-Memory SWR Engine (GREEN)**
- **Status:** ⏳ Pending (Target: 2026-07-08)
- **Description:** Build a highly performant, lightweight in-memory cache mechanism inside the service to meet the rate-limit protection requirements.
- [ ] Implement an internal, highly optimized cash map (`private cache = new Map<string, CacheEntry>()`) inside `service.ts` to track responses without adding bulky runtime weight.
- [ ] Add the non-blocking background refresh logic: if a stale cache hit is detected, trigger the network promise detached from the main execution thread to update the storage layout asynchronously.

---

### Phase 3: Verification & Boundary Verification

- [ ] **Refactor and Assert Architectural Enforcements**
- **Status:** ⏳ Pending (Target: 2026-07-09)
- **Description:** Clean up code paths for raw execution speed and verify folder layer boundaries remain completely uncompromised.
- [ ] Refactor cache access loops to optimize memory footprint and execution latency.
- [ ] Run `pnpm lint` to ensure that `infra/api/frankfurter/` maintains absolute layer isolation and doesn’t look upward into outer features or unauthorized application domains.
- [ ] Run `pnpm build` to guarantee zero compilation or type inference regressions down to the Next.js production build output.
