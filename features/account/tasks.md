## Login Interceptor Cleanup, Positioning & State Feedback Task List

### Phase 1: Trigger Prop Sanitation (DOM Attribute Leak)

- [x] **Sanitize `description` Prop in `SignInInterceptor**`
- **Status:** ✅ Done (Target: 2026-07-20)
- **Description:** Prevent the custom `description` prop passed to `SignInInterceptor` from leaking onto the rendered `<button>` DOM element.
- [x] Inspect `src/features/auth/components/SignInInterceptor.tsx` .
- [x] Explicitly destructure `description` out of props before forwarding attributes to the underlying trigger button:

```tsx
const { description, children, ...restTriggerProps } = props;
```

- [x] Verify in browser DevTools that `<button>` nodes inside `FavoriteToggler` and `ConversionLogger` no longer render invalid `description="..."` DOM attributes.

---

### Phase 2: Contextual Dialog/Popover Positioning

- [ ] **Refactor Login Dialog Positioning Relative to Trigger**
- **Status:** ⏳ Todo (Target: 2026-07-22)
- **Description:** Update the login dialog content position from a fixed viewport center to anchor adjacent to the active trigger element.
- [ ] Update `SignInInterceptor` positioning container:
- Shift overlay strategy from standard viewport modal overlay to popover/anchored portal (e.g., utilizing `@radix-ui/react-popover` or Floating UI anchor alignment).
- Position popover dynamically relative to the trigger button (`align="end"`, `side="bottom"` or `side="top"` depending on viewport bounds).

- [ ] Preserve responsive fallback: Keep centered modal positioning for mobile viewports (`<sm`), while anchoring near the trigger on desktop viewports (`≥sm`).

---

### Phase 3: Sign-In Pending State Visual Feedback

- [ ] **Implement Visual Feedback During Authentication**
- **Status:** ⏳ Todo (Target: 2026-07-22)
- **Description:** Add loading spinners, disabled states, and visual pending cues during the active sign-in transaction to eliminate user uncertainty.
- [ ] Track pending state using `useTransition` or `useFormStatus` during the authentication server action.
- [ ] Update the sign-in submit button to display an inline loading spinner icon and set `disabled={isPending}` during submission.
- [ ] Add `aria-busy="true"` and `aria-disabled="true"` to the active dialog form during authentication for screen-reader accessibility.

---

### Phase 4: DOM, UX & Accessibility Verification

- [ ] **Regression & DOM Inspection Sweep**
- **Status:** ⏳ Todo (Target: 2026-07-22)
- **Description:** Confirm DOM cleanliness, anchored dialog layout, and pending state feedback across all interceptor trigger points.
- [ ] Inspect DOM nodes for `FavoriteToggler` star icon button and `ConversionLogger` actions to verify zero prop leaks.
- [ ] Verify login popover opens aligned directly adjacent to:
- Favorite star trigger inside `ConverterCard`.
- CSV export and history clear triggers inside `ConversionLogger`.

- [ ] Test the sign-in submission flow and confirm the loading spinner and disabled state trigger properly while the request is in-flight.
- [ ] Test keyboard navigation (`Tab`, `Escape`) to ensure focus stays trapped within the anchored login dialog until dismissed.
