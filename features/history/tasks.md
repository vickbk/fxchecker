# 📅 History Feature Implementation Roadmap

- [x] **Scaffold History Feature Directories & Date Utilities**
- **Status:** ✅ Done (Target: 2026-07-13)
- **Description:** Establish the core modular boundaries for the history block and implement lightweight server-side date vector helpers.
- [x] Create directory structure under `src/features/history/` spanning `/components`, `/utils`, and `/types`.
- [x] Implement `getLookbackDate(days: number): string` in `utils/date.ts` to safely yield a `YYYY-MM-DD` string representing lookback bounds without timezone shift anomalies or heavy external dependencies.

- [x] **Implement Server Component Data Pipeline & V2 Integration**
- **Status:** ✅ Done (Target: 2026-07-14)
- **Description:** Build the primary server-side data extractor bridging Next.js page state routing to the Frankfurter infrastructure layer.
- [x] Construct an async coordinator extracting `searchParams` (`base`, `quote`, `range`) from the incoming server request.
- [x] Connect lookback values to `infra/api/frankfurter/service.ts`'s `getRates` batch endpoint.
- [x] Apply the 24-hour long-term SWR cache envelope override to protect immutable historical endpoints from revalidation overhead.

- [ ] **Build Layout-Stable History Table & Streamed Filters**
- **Status:** ⏳ Pending (Target: 2026-07-15)
- **Description:** Assemble the visual presentation block using pure Server Components and interactive URL-driven client control overlays.
- [ ] Develop `components/HistoryTable.tsx` as a pure React Server Component, mapping date rows descending with integrated zero-allocation flag assets via the algorithmic ISO utility.
- [ ] Build a responsive Tailwind-powered skeletal loader fallback to hook cleanly into the Next.js `<Suspense>` route wrapper.
- [ ] Create the client-side `components/HistoryRangePicker.tsx` that replaces local component state with Next.js router transitions, refreshing parameters directly on the URL tree.
