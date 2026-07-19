## Conversion Log & Data Portability Feature

### Phase 1: Database Schema & Driver-Level Serialization

- [ ] **Encapsulated Database Layout & Driver Codecs**
  - **Status:** ⏳ Doing (Target: 2026-07-19)
  - **Description:** Build a highly compact relational table storing tokenized log records, using Drizzle's `customType` utility to manage data transformations transparently at the driver layer.
  - [x] Implement the `logDataColumn` custom type wrapper configuration:
    - **`toDriver(value)`**: Encodes incoming objects into your target layout format string: `${base}-${quote}_${amount}@${rate}`.
    - **`fromDriver(value)`**: Unpacks the string string token via split logic, wrapped in a strict `try/catch` block returning a safe default object block if values are corrupted.
  - [ ] Define the compact `ex_logs` table schema in Drizzle ORM:
    - [x] `id`: Primary key (UUID or auto-incrementing serial).
    - [x] `userId`: Text field referencing the core users table with a `cascade` deletion modifier.
    - [x] `data`: Bound to your newly created `logDataColumn` type config.
    - [x] `editTime`: Native PostgreSQL `timestamp` column field auto-defaulting to `now()` to ensure efficient B-Tree indexing and performance sorting.
  - [x] Run database migration scripts:
    - Run `pnpm drizzle-kit generate`
    - Run `pnpm drizzle-kit migrate`

---

### Phase 2: Core Server Actions Engine

- [ ] **Declarative State Mutation Engine**
  - **Status:** ⏳ Todo (Target: 2026-07-26)
  - **Description:** Implement type-safe Server Actions to manage history records cleanly behind user session validations, utilizing automatic schema typing.
  - [ ] Build the `logConversion(base, quote, amount, result)` Server Action:
    - Verify active authentication session context. Return early if missing.
    - Pass the raw parameters object directly into your Drizzle insert execution statement, allowing `toDriver` to handle token mapping automatically.
  - [ ] Build the `deleteLogItem(id)` Server Action:
    - Validate session parameters.
    - Query and remove the specific row matching the target record item ID and the active user ID within `ex_logs`.
  - [ ] Build the `clearAllLogs()` Server Action:
    - Purge all log rows matching the authenticated user's ID inside the `ex_logs` workspace.
  - [ ] Ensure all action returns match a uniform, serializable payload: `{ success: boolean; error?: string }`.

---

### Phase 3: UI Integration & Interceptor Binding

- [ ] **Chronological Stream UI & Protected Interceptions**
  - **Status:** ⏳ Todo (Target: 2026-07-27)
  - **Description:** Construct a clean chronological list layout that consumes the automatically deserialized data objects, while gating sensitive interactions behind the client interceptor layer.
  - [ ] Integrate the automatic `logConversion` statement inside the main converter form submission pipeline so it runs implicitly for authenticated user profiles.
  - [ ] Build the history display list viewport:
    - Fetch user log rows from the database, sorted using `.orderBy(desc(exLogs.editTime))`.
    - Access object keys directly off the returned data row configuration—skipping manual array string splitting layouts entirely.
    - Render the calculation row format: `[Amount] [Base] → [Result] [Quote]`.
  - [ ] Mount individual trash icon controls on each log entry row, completely wrapped inside the client-side `SignInInterceptor`.
  - [ ] Add a "Clear History" header action utility component, wrapped inside the `SignInInterceptor` shell carrying the explicit context prompt: _"Login to manage and purge your calculation history."_

---

### Phase 4: Data Portability (CSV Export Engine)

- [ ] **Clean Data Export Stream**
  - **Status:** ⏳ Todo (Target: 2026-07-28)
  - **Description:** Implement an authenticated client-side parser to read the pre-mapped log data arrays and convert them instantly into a structural, downloadable CSV stream.
  - [ ] Mount an "Export to CSV" utility option in the history toolbar layout, wrapped inside the `SignInInterceptor`: _"Login to download your conversion history as a CSV file."_
  - [ ] Build the client-side utility function `exportLogsToCSV(logsArray)`:
    - Loop through the rows and directly map the typed object properties to spreadsheet column headers: `Log ID, Timestamp, Base Currency, Quote Currency, Input Amount, Conversion Result`.
  - [ ] Configure the native browser file system download sequence:
    - Convert parsed metrics into a browser `Blob` target using type `text/csv;charset=utf-8;`.
    - Instantiate a transient link element with an explicit timestamped filename (`conversion_history_YYYY_MM_DD.csv`), trigger the click event, and immediately remove the link node from the document context.
  - [ ] Execute codebase verification passes:
    - Run `pnpm build` to confirm static checking routines pass cleanly.
    - Run `pnpm lint` to ensure zero boundary style exceptions.
