# `shared/` Global Foundation Layer Guide

## 📐 Core Philosophy

The `shared/` directory serves as the bedrock of the application. It houses cross-cutting configurations, constants, tokens, and foundational code that are universally available to every layer above it (`infra/`, `features/`, and `app/`).

The most critical invariant of the `shared/` layer is that it is **entirely domain-agnostic**. It knows absolutely nothing about currency exchanges, conversion logs, chart calculations, or user database profiles. It only knows about the technical mechanics, configuration states, and theme design system rules of the application platform itself.

---

## 📁 Initial Directory Blueprint

To maintain an aggressive focus on a lean architecture initialization, this directory **begins exclusively with the config layer**. As the application scales, this boundary expands under strict stateless rules.

```text
shared/
└── config/         # Shared application constants, environmental setups, and style system tokens

```

### Future Scaling Evolution (When to expand)

As building progresses, `shared/` will welcome stateless architectural primitives strictly conforming to these sub-folders:

- `shared/components/` — Atom-level UI presentation primitives (e.g., raw un-typed Buttons, Input boxes, Skeleton wrappers, Dialog frames).
- `shared/hooks/` — Global hardware/system lifecycle monitors (e.g., `useMediaQuery`, `useNetworkStatus`, `useLocalStorage`).

---

## ⚙️ Core Modules: Configuration & Design Tokens (`shared/config/`)

The `config/` boundary centralizes system metadata and behavioral guidelines for the UI and network layers.

### 1. Style & Theme Engineering

- Houses the primary tokens governing our **dark-first theme paradigm** alongside its light theme counterpart.
- Declares layout sizing baselines, color variables, focus-state design tokens, and focus ring schemas ensuring uniform accessibility (a11y) across elements.

### 2. Runtime Environment Constants

- Defines rigid system mappings, such as localized client fallback rules, application metadata declarations, and functional layout thresholds.

---

## 🛡️ Architectural Guardrails

> **The Boundary Rule:** Code within `shared/` must **never** import from `features/`, `infra/`, or `app/`. It has zero outer awareness. If a file inside `shared/` tries to import a component from a feature or check an infrastructure database type, the architectural layer is broken.

### How to audit additions to `shared/`:

Before creating or shifting code into this layer, ask yourself these three validation questions:

1. **Is it free of domain logic?** If it contains words like `FX`, `Rate`, `Frankfurter`, `Favorite`, or `Currency`, it belongs in a `features/` or `infra/` folder—**not** here.
2. **Is it globally useful?** Does it represent an asset or structural pattern required across multiple entirely unrelated segments of the application?
3. **Is it highly stable?** Changes to the `shared/` layer have a massive blast radius. Code placed here should be foundational, resilient, and highly predictable.

---

## 🎨 System Integration Mapping

Configuration primitives stored within `shared/config/` are wired directly into global structural orchestrators. For example, your Tailwind CSS theme configuration file references design token objects stored right here, creating a single source of truth for the entire visual compiler landscape.
