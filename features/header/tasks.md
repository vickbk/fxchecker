## Caching & Live Trends Optimization Task List

### Phase 1: Cached Pair Selection Infrastructure

- [x] **Implement `getOrSetCachedPairs` Resolver**
  - **Status:** ✅ Done (Target: 2026-07-20)
  - **Description:** Implement a 24-hour cached resolver using the existing caching provider to store and retrieve the 10 randomized base/quote currency pairs.
  - [x] Check cache system for the active `header-pairs-selection` key.
  - [x] On cache miss:
    - Call `fetchCurrencies()` to retrieve available currency codes.
    - Select 10 unique base currencies.
    - Assign one unique quote currency per base (ensuring `base !== quote`).
    - Write the 10-pair array to cache with a 24-hour TTL (86,400s).

---

### Phase 2: Specific Pair Fetching Refactoring

- [x] **Call `getRate` API Query**
  - **Status:** ✅ Done (Target: 2026-07-20)
  - **Description:** Refactor the historical rates fetcher to query Frankfurter with both `base` and `symbols` (quote) parameters, eliminating full-currency list downloads.
  - [x] Update `fetchHistoricalRates` to `getRate` call:

- [x] **Refactor `getLatestRates` Orchestration**
  - **Status:** ✅ Done (Target: 2026-07-20)
  - **Description:** Connect the cached pair resolver to the optimized rate fetcher to produce live rate trends without re-randomizing currency selections.
  - [x] Retrieve the cached 10 currency pairs via `getCurrencyPairs()`.
  - [x] Execute 10 parallel uncached live rate queries using `Promise.all`.

---

### Phase 3: Cache Invalidation & Verification

- [ ] **Cache Purging & Validation Sweep**
  - **Status:** ⏳ Todo (Target: 2026-07-22)
  - **Description:** Add manual cache purging controls and verify pair stability versus live rate update behavior.
  - [ ] Implement a cache purge helper targeting the `header-pairs-selection` key.
  - [ ] Verify that page refreshes preserve identical currency pair selections in the header UI.
  - [ ] Verify via network logs that incoming Frankfurter responses contain lightweight single-quote payloads rather than full rate maps.
  - [ ] Confirm that exchange rate values and `change` deltas continue to reflect real-time market data on revalidation.
