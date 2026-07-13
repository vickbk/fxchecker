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

* [x] **Implement Historical Data Chart Transformer**
* **Status:** ⏳ Pending (Target: 2026-07-13)
* **Description:** Build a safe, zero-allocation data parsing utility that transforms nested V2 time-series responses into linear coordinate matrices optimized for charting inputs.
* [x] Create data adapter engine under `src/features/history/utils/graph.ts`.
* [x] Implement `loadHistoricalRates` mapping the raw multi-node V2 API dictionary into a strict `Array<{ date: string; rate: number }>` payload, ensuring dates are correctly ordered chronologically ascending for the horizontal axes.
* [ ] Write unit tests verifying that missing data points or weekend gaps are handled smoothly without emitting `NaN` plots or breaking the visualization array.

* [ ] **Develop Client-Optimized Line Chart Component**
* **Status:** ⏳ Pending (Target: 2026-07-17)
* **Description:** Build the interactive charting workspace to visualize historical volatility curves smoothly using a dedicated client interactive boundary.
* [ ] Create `src/features/history/components/HistoryChart.tsx` explicitly marked with the `'use client'` layout directive.
* [ ] Integrate your selected lightweight visualization primitives (e.g., a native responsive SVG path generator or tree-shaken graphing element) mapped directly to the incoming coordinate array props.
* [ ] Implement layout-stable styling configurations utilizing explicit aspect ratios (e.g., `aspect-[21/9]` or clear Tailwind `h-64` bounds) to guarantee zero Cumulative Layout Shift (CLS) when data mounts.
* [ ] Integrate hover tooltips showing precise crosshair dates and custom localized rate figures.

* [ ] **Compose Server Route Integration & Streaming Skeleton**
* **Status:** ⏳ Pending (Target: 2026-07-18)
* **Description:** Bind the visualization engine directly into the Server Component data stream and configure an explicit regional streaming fallback skeleton.
* [ ] Inject the `HistoryChart` component directly into the primary asynchronous server container view, streaming data straight from the Frankfurter client pipeline layer.
* [ ] Create a layout-matching placeholder canvas `components/HistoryChartSkeleton.tsx` featuring a shifting Tailwind pulse backdrop animation sequence.
* [ ] Wire the chart skeleton side-by-side with the history table loader under the Next.js route's `<Suspense>` perimeter, bound directly to the active URL `period` query state transitions.
