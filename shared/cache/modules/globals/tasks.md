## Tasklist definition

### Phase 1: Core Foundation & Utility Setup

- [x] **Implement Global Singleton Utility**
- **Status**: ✅ Done
- **Target**: 2026-07-28
- **Description**: Create the generic `createGlobalSingleton` factory and its corresponding unit tests.
- **Steps**:
  - [x] Create singleton factory:
  - [x] Define `createGlobalSingleton` in `src/shared/globals/singleton.ts`
  - [x] Implement lazy initialization using `globalThis`

- [x] Add unit tests:
  - [x] Create `singleton.test.ts`
  - [x] Test lazy evaluation and reference identity across calls
