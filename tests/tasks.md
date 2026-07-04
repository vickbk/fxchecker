# Testing Plannification

## 1. Unit Testing Environment (Vitest)

- [x] **Vitest Installation & Package Setup**
- Status: ✅ Done (Target: 2026-07-03)
- Description: Install the Vitest test runner alongside React Testing Library dependencies optimized for the Next.js runtime.
- [x] Install dependencies: `pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`
- [x] Configure the `vitest.config.ts` file at the root level.
- [x] Map Next.js path aliases (`infra/*`, `features/*`, `shared/*`) inside the Vite configuration using `vite-tsconfig-paths` or manual alias blocks.
- [x] Create a `test/setup.ts` file at the root to import `@testing-library/jest-dom` matchers globally.

- [x] **Vitest Scripts & Smoke Test Verification**
- Status: ✅ Done (Target: 2026-07-03)
- Description: Add test execution commands to the package manifest and verify runtime configuration with a dummy component test.
- [x] Add testing scripts to `package.json`: `"test": "vitest"`, `"test:run": "vitest run"`, and `"test:ui": "vitest --ui"`.
- [x] Create a validation test file inside a feature block (e.g., `features/converter/components/Button.test.tsx`) to verify JSDOM and React element rendering functions correctly.

---

## 2. End-to-End Integration Testing (Playwright)

- [x] **Playwright Core Framework Initialization**
- Status: ✅ Completed (Target: 2026-07-03)
- Description: Scaffolding the Playwright infrastructure tailored to intercept and validate complete Next.js user flows.
- [x] Install the core test runner: `pnpm add -D @playwright/test`.
- [x] Execute the official driver installer to get necessary browser binaries: `pnpm exec playwright install --with-deps`.
- [x] Create a root-level `playwright.config.ts` file.

- [x] **Playwright Next.js Lifecycle Configuration & Isolation**
- Status: ✅ Done (Target: 2026-07-03)
- Description: Tweak Playwright timeouts, base URLs, and local server initialization scripts to smoothly test build outputs.
- [x] Configure `webServer` within `playwright.config.ts` to automatically trigger a production build preview (`pnpm build && pnpm start`) on port `3000` before running assertions.
- [x] Set up the baseline `baseURL` to target `http://localhost:3000`.
- [x] Configure a dedicated storage output folder (`tests-output/`) inside `.gitignore` to isolate trace logs and screenshot artifacts.
- [x] Create a baseline E2E check file `e2e/home.spec.ts` at the root level to test layout stability across desktop and mobile viewports.
- [x] Update `package.json` to include scripts for execution: `"test:e2e": "playwright test"`.

## 3. Add CI tests scripts

- [x] **Vitest workflow config**
  - Status: ✅ Done (Target: 2026-07-03)
  - Description: Configue workflow for checking init and integration tests on push and merge
  - [x] Create `vitest.yml` workflow file
  - [x] Add configs for running the vitest tests

- [x] **Playwright workflow config**
  - Status: ✅ Done (Target: 2026 -07-03)
  - Description: Verify that the generated playwright config meet expectation
  - [x] Check that `playwright.yml` exists in the workflows folder
  - [x] Verify the current config meet the expectations for end to end testing

Here is the optimized task structure. It fixes the typos, eliminates redundant descriptions, and converts the manual instructions into a clean, high-velocity loop optimized for Vitest’s interactive watch mode.

---

## 4. Fix Broken Tests

- [x] **Execute Iterative Test Resolution Loop**
  - **Status:** ✅ Done (Target: 2026-07-04)
  - **Description:** Run the test engine in targeted isolation to systematically eliminate component failures in a tight loop without pipeline overhead.
  - [x] Run `pnpm test` to inventory the exact list of failing suites.
  - [x] **The Resolution Loop:** Select a single failing component file and isolate it using `pnpm test -- path/to/file.test.tsx`.
    - [x] Apply the localized component fix or mock correction.
    - [x] Observe the immediate watch mode pass/fail feedback loop.
    - [x] Confirm the total failure count drops and commit the atomic patch.
    - [x] Repeat this cycle for the next targeted failure.

  - [x] Remove all temporary test isolation markers and execute a final global run via `pnpm test`.
  - [x] Execute `pnpm build` to verify that the test fixes introduced no production bundle or type compilation regressions.
