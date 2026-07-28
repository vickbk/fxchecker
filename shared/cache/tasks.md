## Cache migration to global singleton management to eliminate routes missmatch

### Phase 1: Systematic SWREngine Cache Audit & Migration

- [ ] **Iterative SWREngine Instance Refactoring**
- **Status**: 🚀 Doing
- **Target**: 2026-07-28
- **Description**: Audit the entire codebase for raw `= new SWREngine` initializations and refactor each instance into a `createGlobalSingleton` getter until the search yields zero remaining results.
- **Steps**:
- [x] Run global codebase search for `= new SWREngine`:
- [x] Log all matching file paths across `src/features/` and `src/shared/`

- [ ] Execute refactoring loop (repeat for every match):
  - [x] Replace direct `= new SWREngine(...)` instantiation with `createGlobalCache`
  - [x] Export the corresponding `get<Name>Cache` getter function
  - [x] Update internal module exports to eliminate raw instance leaks
  - [x] Re-run codebase search for `= new SWREngine`

- [ ] Verify loop completion:
  - [ ] Confirm search result for `= new SWREngine` is completely empty (0 results)

---

### Phase 2: Verification & E2E Validation

- [ ] **Testing & Build Verification**
- **Status**: ⏳ Todo
- **Target**: 2026-07-31
- **Description**: Confirm cache instance consistency across Next.js HMR, production build chunks, and automated test suites.
- **Steps**:
- [ ] HMR Verification:
- [ ] Test state persistence after dev server hot reload

- [ ] Production Chunk Isolation Test:
- [ ] Run production build and verify shared memory across route chunks

- [ ] Automated Test Suite:
- [ ] Run Vitest unit tests
- [ ] Run Playwright E2E tests
