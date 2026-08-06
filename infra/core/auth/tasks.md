## Playwright Programmatic NextAuth Integration Tasklist

### Phase 1: Environment & Config Setup

- [x] **Configure Test Secrets & Git Ignores**
  - **Status**: ✅ Done
  - **Target**: 2026-08-05
  - **Description**: Ensure encryption secrets match between Playwright and NextAuth while keeping auth state out of source control.
  - **Steps**:
    - [x] Verify `NEXTAUTH_SECRET` is set in `.env.test`
    - [x] Add `tests/playwright/.auth/` to `.gitignore`

- [x] **Configure Playwright Dependencies**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-06
  - **Description**: Update `playwright.config.ts` to support dependent projects and storageState fixtures.
  - **Steps**:
    - [x] Create `setup` project matching `/auth\.setup\.ts/`
    - [x] Create `authenticated` project matching `/.*\.auth\.spec\.ts/` with `dependencies: ['setup']`
    - [x] Add `storageState: 'playwright/.auth/user.json'` to authenticated project
    - [x] Create `unauthenticated` project not matching `/.*\.auth\.spec\.ts/`

---

### Phase 2: Programmatic Session Minting

- [x] **Build `auth.setup.ts` Script**
  - **Status**: ✅ Done
  - **Target**: 2026-08-06
  - **Description**: Generate encrypted NextAuth JWT tokens using `next-auth/jwt` and inject them directly into browser storage state.
  - **Steps**:
    - [x] Define mock user payload matching the `fxchecker` user schema
    - [x] Encrypt token using `encode({ token, secret: process.env.NEXTAUTH_SECRET, salt: cookieName })`
    - [x] Inject `next-auth.session-token` (or `__Secure-` variant) into Playwright context cookies
    - [x] Export context state to `playwright/.auth/user.json` via `context.storageState()`

---

### Phase 3: Test Spec Authoring & Validation

- [x] **Implement Test Suites**
  - **Status**: ✅ Done
  - **Target**: 2026-08-06
  - **Description**: Create authenticated and guest test suites for key routes (`/favorites`, `/compare`).
  - **Steps**:
    - [x] Create `e2e/stories.auth.spec.ts` for authenticated user flows
    - [x] Check existing `tests/**.spec.ts` for unauthenticated redirection flows
    - [x] Execute `npx playwright test` and confirm setup runs first without triggering Google OAuth UI

## CI/CD Pipeline Alignment Tasklist (Playwright & Neon DB Integration)

### Phase 1: Environment & Neon DB Branch Configuration

- [x] **Configure CI Environment Secrets**
  - **Status**: ✅ Done
  - **Target**: 2026-08-06
  - **Description**: Inject connection credentials for the Neon preview branch and Auth.js runtime secrets into the CI workflow.
  - **Steps**:
    - [x] Add `DATABASE_URL` pointing to the Neon preview database branch in GitHub Actions Secrets
    - [x] Add `AUTH_SECRET` (or `NEXTAUTH_SECRET`) to CI environment secrets

- [x] **Database Schema Migration Sync**
  - **Status**: ✅ Done
  - **Target**: 2026-08-10
  - **Description**: Ensure the Neon preview branch schema is fully migrated prior to executing `auth.setup.ts`.
  - **Steps**:
    - [x] Add Drizzle migration command (`drizzle-kit push` or `db:migrate`) to the CI workflow step before test execution
    - [x] Verify non-blocking connection pooled / direct URL configuration for Neon in CI

---

### Phase 2: Workflow Execution & Caching

- [ ] **Configure Node & Playwright Caching**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-11
  - **Description**: Speed up pipeline runs by caching npm packages and Playwright browser binaries across CI builds.
  - **Steps**:
    - [ ] Add `actions/cache` for `~/.cache/ms-playwright` keyed by lockfile
    - [ ] Add step `npx playwright install --with-deps` on browser cache miss

- [ ] **Next.js Web Server Orchestration**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-11
  - **Description**: Run Playwright against a production build of the Next.js app inside the runner.
  - **Steps**:
    - [ ] Add application build step (`npm run build`)
    - [ ] Configure `webServer` block in `playwright.config.ts` (`command: 'npm run start'`, `port: 3000`, `reuseExistingServer: !process.env.CI`)

---

### Phase 3: Reporting & Ephemeral Artifact Handling

- [ ] **Artifact & Trace Uploads**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-12
  - **Description**: Preserve failure screenshots, video recordings, and Playwright trace files for debugging.
  - **Steps**:
    - [ ] Add `actions/upload-artifact` step for `playwright-report/` with `if: always()` condition
    - [ ] Ensure `tests/playwright/.auth/user.json` remains in `.gitignore` and is not committed
