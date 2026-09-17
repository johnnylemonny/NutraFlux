# NutraFlux - AI Agent Context (AGENTS.md)

Welcome to NutraFlux! This document provides context, architectural guidelines, and structural overview for AI agents working on this codebase.

## Project Overview
NutraFlux is a commercial-grade, local-first daily calorie and macro tracker built with React 19, TypeScript, Tailwind CSS v4, and Vite 8. It provides dual-language support (PL / EN), zero-login offline privacy, in-app feedback, donation support (Buy Me a Coffee), and high-performance SEO.

## Technical Stack
- **Framework:** React 19 + Vite 8
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (configured via `@import "tailwindcss";` in `src/index.css`)
- **Package Manager:** `pnpm` exclusively
- **UI Base:** Radix UI primitives with custom accessible solid components
- **Internationalization (i18n):** Native lightweight typed dictionaries in `src/locales/` with `useLocale` hook
- **Toasts/Notifications:** `react-toastify` for instant feedback
- **Icons:** `lucide-react`
- **Testing:** `vitest` + `@testing-library/react` (21 unit and component tests)

## Codebase Structure
- `src/main.tsx` - App entrypoint
- `src/App.tsx` - Main layout, dashboard, catalog search, custom food entry, meals, FAQ, and donations
- `src/locales/` - Bilingual translation dictionaries:
  - `en.ts` - English strings & Translations type definition
  - `pl.ts` - Polish natural health/diet strings
  - `locale.test.ts` - Test suite verifying dictionary consistency & localized summaries
- `src/components/` - Shared UI elements:
  - `language-toggle.tsx` - Polish / English language toggle button
  - `feedback-dialog.tsx` - In-app user feedback dialog modal
  - `support-card.tsx` - Donation call-to-action card (Buy Me a Coffee)
  - `faq-section.tsx` - FAQ accordion with Schema.org JSON-LD structured data
  - `logo-mark.tsx` - Custom brand logo SVG
  - `meal-card.tsx` - Display for specific meal entries with delete, duplicate, and localized titles
  - `theme-toggle.tsx` - Smooth switch between light and dark modes
  - `ui/` - Reusable primitives (buttons, inputs, separators, dialogs)
- `src/data/` - Static JSON databases and data helpers:
  - `foods.ts` - Food catalog, target presets, categories, meal hints
  - `foods.json` - Curated featured food items
  - `foods.generated.json` - Generated database of 2,000+ USDA food items
- `src/hooks/` - Core custom React hooks:
  - `use-locale.ts` - Language detection (LocalStorage + navigator.language) and switching hook
  - `use-calorie-tracker.ts` - State management hook (loads/saves to localStorage with safe memory fallback)
  - `use-theme.ts` - System/user theme synchronization hook
- `src/lib/` - Helper libraries:
  - `tracker.ts` - Calorie math, macro formatting, snapshot, and localized text summary generation
  - `utils.ts` - Classname merging utilities (`cn`)
- `src/types.ts` - TypeScript interface and type definitions

## Development Workflows
- **Dependency Management:** Use `pnpm` only. Always run `pnpm test`, `pnpm typecheck`, and `pnpm lint` before completing tasks.
- **Local Dev Server:** Start the server with `pnpm run dev`.
- **Git Policy:** Do not push to remote directly without explicit user request.
