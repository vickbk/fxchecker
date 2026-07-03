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

- [ ] **Playwright Core Framework Initialization**
- Status: ⏳ Pending (Target: 2026-07-06)
- Description: Scaffolding the Playwright infrastructure tailored to intercept and validate complete Next.js user flows.
- [ ] Install the core test runner: `pnpm add -D @playwright/test`.
- [ ] Execute the official driver installer to get necessary browser binaries: `pnpm exec playwright install --with-deps`.
- [ ] Create a root-level `playwright.config.ts` file.

- [ ] **Playwright Next.js Lifecycle Configuration & Isolation**
- Status: ⏳ Pending (Target: 2026-07-06)
- Description: Tweak Playwright timeouts, base URLs, and local server initialization scripts to smoothly test build outputs.
- [ ] Configure `webServer` within `playwright.config.ts` to automatically trigger a production build preview (`pnpm build && pnpm start`) on port `3000` before running assertions.
- [ ] Set up the baseline `baseURL` to target `http://localhost:3000`.
- [ ] Configure a dedicated storage output folder (`tests-output/`) inside `.gitignore` to isolate trace logs and screenshot artifacts.
- [ ] Create a baseline E2E check file `e2e/home.spec.ts` at the root level to test layout stability across desktop and mobile viewports.
- [ ] Update `package.json` to include scripts for execution: `"test:e2e": "playwright test"`.
