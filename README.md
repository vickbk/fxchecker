# Frontend Mentor - FX Checker solution

This is a solution to the [FX Checker challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/foreign-exchange-currency-converter). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

#### Authentication

- Login with google
- Get intercepted with a SignInInterceptor when trying to perform some session related actions (add/remove from favorite, add/remove from compare, log a conversion)

#### Converter

- Enter an amount to send and see it convert in real time as they type
- Pick the "send" and "receive" currencies from a searchable currency picker
- See the live exchange rate for the active pair (for example, `1 USD = 0.8530 EUR`)
- Swap the send and receive currencies with the swap button
- Favorite the active pair, and log a conversion to their history

#### Currency picker

- Search the full list of available currencies by code or name
- See currencies grouped into "Popular" and "Other currencies", each row showing the flag, code, and name
- See a check against the currency that's currently selected

#### Live markets ticker

- See a ticker of currency pairs, each with its current rate and 24-hour change (up or down)

#### Rate history

- View a line and area chart of the active pair's rate over time
- Switch the chart range between 1D, 1W, 1M, 3M, 1Y, and 5Y
- See the open, last, absolute change, and percentage change for the selected range

#### Compare

- See their send amount converted into a range of other currencies at once, each with its reference rate
- Pin or unpin any comparison row to their favorites
- Add/Remove currencies from the compare list

#### Favorites

- See their pinned pairs, each with its live rate and 7-Days change
- Load a pinned pair back into the converter by selecting its row
- Unpin a pair they no longer want to track
- Clear all favorites at once

#### Conversion log

- See a log of conversions they've made, each showing the relative time, the pair, and the send and receive amounts
- Clear the whole log
- Delete an individual entry
- Export logs to CSV

#### UI & accessibility

- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page
- Navigate the entire app using only their keyboard

### Screenshot

![](./design/solutions/desktop-history.png)

### Links

- Solution URL: [Github Repo](https://github.com/vickbk/fxchecker)
- Live Site URL: [Deployed on vercel](https://fxchecker-ten.vercel.app)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- [React](https://reactjs.org/) - JS library
- [Next.js](https://nextjs.org/) - React framework
- [Tailwindcss](https://tailwindcss.com/) - For styles
- [Playwright](https://playwright.com/) - For E2E testing
- [Gemini](https://gemini.google.com/) - Planning and orchastration
- [GitHub Copilot](https://github.com/features/copilot) - Some code implementation

### What I learned

Here is a polished, concise version of your **What I learned** section with clean code snippets ready to drop into your `README.md`:

---

### What I learned

#### 1. Accessible Infinite Marquee via `IntersectionObserver`

To prevent screen reader and keyboard focus traps on duplicated ticker items, I combined continuous CSS animations with an `IntersectionObserver`. Off-screen nodes dynamically transition to `tabIndex={-1}` and `aria-hidden="true"`, ensuring keyboard navigation only targets visible links.

```typescript
// Dynamically toggle item visibility when crossing the viewport boundary
useEffect(() => {
  observerRef.current = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const key = entry.target.getAttribute('data-marquee-key');
        if (!key) return;
        setVisibleKeys((prev) => {
          const next = new Set(prev);
          entry.isIntersecting ? next.add(key) : next.delete(key);
          return next;
        });
      });
    },
    { root: containerRef.current, threshold: 0.05 }
  );
}, []);

// Applied directly to scrolling currency links
<Link
  href={`/convert?from=${base}&to=${quote}`}
  tabIndex={isVisible ? 0 : -1}
  aria-hidden={!isVisible}
>
  {base}/{quote}
</Link>

```

#### 2. Feature-Driven Architecture & Enforced Cross-Domain Decoupling

The application is organized into isolated domain modules under `features/*`. Direct cross-feature dependencies are prohibited to prevent tight coupling. Domain integration relies on Inversion of Control (IoC) via component slots, with wiring handled at the page composition layer.

```text
features/
├── compare/                 # Zero imports from @/features/favorites
│   └── components/
│       └── MainCompare.tsx  # Accepts generic FavoriteSlot prop
└── favorites/
    └── components/
        └── FavoriteToggleWrapper.tsx # Reusable slot provider

```

```tsx
// app/(main)/compare/page.tsx — Page Route Composition Layer
import { MainCompare } from "@/features/compare";
import { FavoriteToggleWrapper } from "@/features/favorites";

export default function ComparePage() {
  return <MainCompare FavoriteSlot={FavoriteToggleWrapper} />;
}
```

#### 3. Test Co-location

Instead of isolating tests in a monolithic root directory, I co-located E2E specs, unit tests, and component logic within their respective domain folders (`features/*`). This keeps feature modules portable, self-contained, and easier to orchestrate.

```ts
// tests/playwright/converter.spec.ts
import { test, expect } from "@playwright/test";
import { shouldSwapBaseAndQuoteCurrencyAndCovert } from "@/features/converter/__testing__/stories";

test("should swap base and quote currency and do the conversion", async ({
  page,
}) => {
  await page.goto("/convert");
  await shouldSwapBaseAndQuoteCurrencyAndCovert(page);
});
```

```text
features/converter/
├── components/
│   ├── ConverterCard.test.tsx      # Unit / Component tests
│   └── ConverterCard.tsx
├── hooks/
│   └── useConverter.ts
└── __tests__/
│   └── stories.ts             # stories for tests in e2e folder
tests/
└── playwright/                # Centralized E2E orchestration
    ├── converter.spec.ts      # Imports from @/features/converter/*.stories
    ├── compare.spec.ts        # Imports from @/features/compare/*.stories
    └── favorites.spec.ts      # Imports from @/features/favorites/*.stories

```

### Continued development

- **AI Chatbot Integration (`features/chatbot`):** Developing an embedded financial assistant that will allow users to ask conversational queries (e.g., _"How much is 250 EUR in JPY?"_ or _"Show me market trends for GBP/USD this week"_), trigger quick conversions, and receive real-time rate insights directly inside the UI.
- **Offline Rate Caching & PWA Support:** Extending service worker capabilities to support cached offline rate lookup and offline conversion calculations.
- **Real-time WebSockets:** Transitioning rate updates from polling intervals to a live WebSocket feed for instant ticker updates.

---

### AI Collaboration

AI tools were integrated throughout the project lifecycle to streamline task planning, accelerate boilerplate implementation, and maintain architectural consistency:

- **Tools Used:** Gemini, Antigravity, and GitHub Copilot.
- **Workflow & Usage:**
- **Gemini:** Scoped granular tasks per feature domain (`features/*`), architected accessibility patterns, and generated structured PR descriptions.
- **Antigravity & GitHub Copilot:** Accelerated boilerplate implementation for large features, custom hooks, and test suites. All AI-generated code was manually reviewed, tested, and optimized to match design specifications.

- **Key Takeaways:**
- **What worked well:** Highly constrained task definitions, PR descriptions, test implementations, and targeted hook/function refactoring.
- **Challenges:** Broad, unconstrained prompts occasionally produced off-target solutions, highlighting the importance of tight, domain-bounded context.

## Author

- Frontend Mentor - [@vickbk](https://www.frontendmentor.io/profile/vickbk)
- Twitter - [@vick_bk8](https://www.twitter.com/vick_bk8)
- Github - [@vickbk](github.com/vickbk)
