## Live Market Marquee Dynamic Visibility & Focus Task List

### Phase 1: Dynamic Item Visibility Observer (`useMarqueeVisibility`)

- [x] **Implement Intersection Observer Hook for Marquee Items**
- **Status:** ✅ Done (Target: 2026-07-21)
- **Description:** Build a custom React hook using `IntersectionObserver` to track which currency links are actively inside the visible marquee container viewport.
- [x] Configure the `IntersectionObserver` with the main marquee container as `root` (with `threshold: 0.1` or `rootMargin: '0px'`).
- [x] Apply attributes dynamically based on item visibility (for both Track A and Track B):
- **In Viewport:** `tabIndex={0}`, `aria-hidden="false"`
- **Out of Viewport:** `tabIndex={-1}`, `aria-hidden="true"`

- [x] Provide a fallback for initial SSR/hydration (default visible items to `0` and off-screen items to `-1`).

---

### Phase 2: Interaction Pause & Focus Controls

- [x] **Pause Marquee Movement on Focus/Hover**
- **Status:** ⏳ Done (Target: 2026-07-21)
- **Description:** Prevent elements from moving out from underneath the user's cursor or keyboard focus during interaction.
- [x] Add CSS rules in the live market module.
- [x] Add distinct focus styles (`outline` / `ring`) to currency links when focused via keyboard to ensure high contrast against the background.

---

### Phase 3: Component Integration

- [ ] **Wire Observer Refs into Track A & Track B Items**
- **Status:** ⏳ Todo (Target: 2026-07-22)
- **Description:** Attach the observer refs uniformly across both the original and duplicate track arrays so item state updates seamlessly as the animation translates.
- [ ] Update `src/features/header/modules/live-market/` item renderer to attach element refs to `useMarqueeVisibility`.
- [ ] Ensure link clicks continue to update currency pair selection (`from`/`to` parameters) without breaking the observer state.

---

### Phase 4: Accessibility & Cross-Browser Verification

- [ ] **Keyboard & Screen Reader Audit**
- **Status:** ⏳ Todo (Target: 2026-07-23)
- **Description:** Verify that keyboard focus stays exclusively on visible elements and screen readers do not encounter ghost stops.
- [ ] Test with `Tab` / `Shift+Tab`: confirm focus lands **only** on currently visible links, whether they originate from Track A or Track B.
- [ ] Verify the marquee animation freezes instantly when keyboard focus enters the container and resumes when focus leaves.
- [ ] Test with screen readers (VoiceOver / NVDA) to confirm off-screen hidden elements are ignored while visible ones are announced correctly.
