## Tasklist definition

### Phase 1: Core Foundation & Utility Setup

- [ ] **Implement Global Singleton Utility**
- **Status**: 🚀 Doing
- **Target**: 2026-07-28
- **Description**: Create the generic `createGlobalSingleton` factory and its corresponding unit tests.
- **Steps**:
  - [x] Create singleton factory:
  - [x] Define `createGlobalSingleton` in `src/shared/globals/singleton.ts`
  - [x] Implement lazy initialization using `globalThis`

- [ ] Add unit tests:
  - [ ] Create `singleton.test.ts`
  - [ ] Test lazy evaluation and reference identity across calls

---

### Phase 2: Systematic SWREngine Cache Audit & Migration

- [ ] **Iterative SWREngine Instance Refactoring**
- **Status**: ⏳ Todo
- **Target**: 2026-07-29
- **Description**: Audit the entire codebase for raw `= new SWREngine` initializations and refactor each instance into a `createGlobalSingleton` getter until the search yields zero remaining results.
- **Steps**:
- [ ] Run global codebase search for `= new SWREngine`:
- [ ] Log all matching file paths across `src/features/` and `src/shared/`

- [ ] Execute refactoring loop (repeat for every match):
  - [ ] Replace direct `= new SWREngine(...)` instantiation with `createGlobalSingleton`
  - [ ] Export the corresponding `get<Name>Cache` getter function
  - [ ] Update internal module exports to eliminate raw instance leaks
  - [ ] Re-run codebase search for `= new SWREngine`

- [ ] Verify loop completion:
  - [ ] Confirm search result for `= new SWREngine` is completely empty (0 results)

---

### Phase 3: Verification & E2E Validation

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
