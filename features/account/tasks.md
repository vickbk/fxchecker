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

### Phase 2: Login Dialog Viewport Centering Fix

- [x] **Override Global CSS Anchor Positioning on Login Dialog**
- **Status:** ✅ Done (Target: 2026-07-21)
- **Description:** Neutralize `position-anchor: auto;` on the login dialog element so it remains strictly centered on the viewport across all screen sizes.
- [x] Update `SignInInterceptor` dialog container styles:
- Unset/override anchor positioning: `position-anchor: none;` (or explicit `anchor-name: none`).
- Enforce fixed viewport centering (`inset: 0`, `margin: auto`, or fixed `top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`).

- [x] Verify the dialog remains centered in the middle of the screen on both mobile (`<sm`) and desktop (`≥sm`).

---

### Phase 3: Sign-In Pending State Visual Feedback

- [x] **Implement Visual Feedback During Authentication**
- **Status:** ✅ Done (Target: 2026-07-21)
- **Description:** Add loading spinners, disabled states, and visual pending cues during the active sign-in transaction to eliminate user uncertainty.
- [x] Track pending state using `useTransition` or `useFormStatus` during the authentication server action.
- [x] Update the sign-in submit button to display an inline loading spinner icon and set `disabled={isPending}` during submission.
- [x] Add `aria-busy="true"` and `aria-disabled="true"` to the active dialog form during authentication for screen-reader accessibility.

---

### Phase 4: DOM, UX & Accessibility Verification

- [x] **Regression & DOM Inspection Sweep**
- **Status:** ✅ Todo (Target: 2026-07-21)
- **Description:** Confirm DOM cleanliness, anchored dialog layout, and pending state feedback across all interceptor trigger points.
- [x] Inspect DOM nodes for `FavoriteToggler` star icon button and `ConversionLogger` actions to verify zero prop leaks.
- [x] Verify login popover opens centered on the page.

- [x] Test the sign-in submission flow and confirm the loading spinner and disabled state trigger properly while the request is in-flight.
- [x] Test keyboard navigation (`Tab`, `Escape`) to ensure focus stays trapped within the anchored login dialog until dismissed.
