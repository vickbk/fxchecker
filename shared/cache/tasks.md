## Cache migration to global singleton management to eliminate routes missmatch

### Phase 1: Systematic SWREngine Cache Audit & Migration

- [x] **Iterative SWREngine Instance Refactoring**
- **Status**: ✅ Done
- **Target**: 2026-07-28
- **Description**: Audit the entire codebase for raw `= new SWREngine` initializations and refactor each instance into a `createGlobalSingleton` getter until the search yields zero remaining results.
- **Steps**:
- [x] Run global codebase search for `= new SWREngine`:
- [x] Log all matching file paths across `src/features/` and `src/shared/`

- [x] Execute refactoring loop (repeat for every match):
  - [x] Replace direct `= new SWREngine(...)` instantiation with `createGlobalCache`
  - [x] Export the corresponding `get<Name>Cache` getter function
  - [x] Update internal module exports to eliminate raw instance leaks
  - [x] Re-run codebase search for `= new SWREngine`

- [x] Verify loop completion:
  - [x] Confirm search result for `= new SWREngine` is completely empty (0 results) expect in tasks file and engine tests

---

### Phase 2: Verification & E2E Validation

- [x] **Testing & Build Verification**
- **Status**: ✅ Done
- **Target**: 2026-07-28
- **Description**: Confirm cache instance consistency across Next.js HMR, production build chunks, and automated test suites.
- **Steps**:
- [x] HMR Verification:
- [x] Test state persistence after dev server hot reload

- [x] Production Chunk Isolation Test:
- [x] Run production build and verify shared memory across route chunks

- [x] Automated Test Suite:
  - [x] Run Vitest unit tests
  - [x] Run Playwright E2E tests
