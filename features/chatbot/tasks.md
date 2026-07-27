# Tasks: AI Chatbot Assistant (`src/features/chatbot`)

### Phase 1: Native Popover Shell & UI First (Tangible Starting Point)

- [x] **1. Build Native Popover Floating Container**
- **Status**: ✅ Done
- **Target**: 2026-07-25
- **Description**: Implement the floating trigger button and chatbot drawer overlay using the native HTML Popover API for clean, native accessibility and focus management.
- **Steps**:
- [x] Create the `ChatPopover` component leveraging native `popover="auto"` and `popovertarget` attributes in `src/features/chatbot/components/ChatPopover.tsx`.
- [x] Add keyboard event listeners for automatic focus trapping, ESC key dismissal, and trigger focus restoration.
- [x] Style the floating drawer overlay using Tailwind CSS v4 design tokens with light and dark mode support.

- [x] **2. Build Accessible Message Stream & Input Frame**
- **Status**: ✅ Done
- **Target**: 2026-07-27
- **Description**: Create a screen-reader-accessible chat container with mock message bubbles and keyboard-friendly prompt input controls.
- **Steps**:
  - [x] Build `ChatMessageList` wrapped in an `aria-live="polite"` region to ensure streaming LLM token output is announced smoothly to assistive technologies.
  - [x] Build `ChatInput` with an auto-resizing text field, submit shortcut handling (Cmd/Ctrl + Enter), and stop generation controls.
  - [x] Implement auto-scroll to bottom functionality with a user scroll-lock override when reading previous messages.

---

### Phase 2: Local Persistence & Storage Adapter

- [ ] **3. Implement IndexedDB Client & Storage Hook**
- **Status**: 🚀 Doing
- **Target**: 2026-07-27
- **Description**: Connect the UI to local IndexedDB storage to preserve privacy and persist message history across page reloads without database overhead.
- **Steps**:
  - [ ] Initialize clear storage button `ClearStorage`.
  - [ ] Initialize the IndexedDB database client in `src/features/chatbot/lib/db.ts` with dedicated object stores for sessions and messages.
  - [ ] Build the `useChatStorage` custom hook to read, append, update, and clear local conversation threads from the UI.
  - [ ] Implement fallback error handling for offline usage and storage quota limits.

---

### Phase 3: AI Tool Contracts & Infrastructure Binding

- [ ] **4. Define AI Tool Zod Contracts & Types**
- **Status**: ⏳ Todo
- **Target**: 2026-07-27
- **Description**: Establish Zod schemas and TypeScript interfaces for all chatbot AI tools to ensure strict parameter validation without cross-feature coupling.
- **Steps**:
- [x] Create the tools contract file in `src/features/chatbot/types/tools.ts`.
- Define Zod schemas for:
  - [x] `convert_currency`,
  - [x] `compare_currencies`,
  - [x] `get_rate_history`,
  - [x] `search_currencies`,
  - [ ] `manage_favorites`, and
  - [ ] `get_conversion_logs`.
- [ ] Export strongly typed input and output interfaces for server tool execution handlers.

- [ ] **5. Implement Server-Side Tool Execution Handlers & Generative UI**
- **Status**: ⏳ Todo
- **Target**: 2026-07-27
- **Description**: Connect Zod tool schemas to shared infrastructure services and build inline generative UI card renderers inside message bubbles.
- **Steps**:
- [x] Create server tool handlers in `src/features/chatbot/server/tools.ts` using the Vercel AI SDK.
- [x] Bind tool executions to shared rate services in `src/infra/rates` and metadata utilities in `src/shared`.
- Build `ToolCard` renderers to display conversion summary cards, mini comparison tables, and trend indicators inside chat bubbles.
- Wrap account-sensitive chat triggers with `SignInInterceptor` to prompt authentication without clearing active chat context.

---

### Phase 4: API Streaming Endpoint & E2E Testing Orchestration

- [ ] **6. Set Up API Streaming Route**
- **Status**: ⏳ Todo
- **Target**: 2026-07-28
- **Description**: Create the Next.js App Router API endpoint for streaming assistant responses using the Vercel AI SDK.
- **Steps**:
- Create `app/api/chat/route.ts` with a POST route handler invoking `streamText`.
- Attach server tool definitions and configure system prompt instructions.
- Add rate-limiting middleware guards to protect the endpoint from prompt abuse.

- [ ] **7. Create Storybook Stories & Playwright E2E Suite**
- **Status**: ⏳ Todo
- **Target**: 2026-07-28
- **Description**: Build isolated UI stories and centralized Playwright E2E automation for the chatbot feature.
- **Steps**:
- Create component stories for empty, streaming, and tool execution states in `src/features/chatbot/__testing__/ChatPopover.stories.tsx`.
- Write Playwright specs in `tests/playwright/chatbot.spec.ts` that import stories directly from the feature's `__testing__` directory.
- Mock API stream responses in Playwright to deterministically test drawer toggling, tool UI rendering, and IndexedDB message persistence.
