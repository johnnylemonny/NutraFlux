# NutraFlux - AI Agent Context (AGENTS.md)

Welcome to NutraFlux! This document provides context, guidelines, and structural overview for AI agents working on this codebase.

## Project Overview
NutraFlux is a local-first daily calorie tracker built with React, TypeScript, Tailwind CSS, and Vite. It is designed to be highly responsive, offline-ready (storing data in localStorage), and visually polished with a clear typography-driven design.

## Technical Stack
- **Framework:** React 19 + Vite 8
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (configured via `@import "tailwindcss";` in `src/index.css`)
- **Package Manager:** `pnpm` exclusively
- **UI Base:** shadcn/ui components (which build on top of Radix UI primitives)
- **Toasts/Notifications:** `react-toastify` for instant feedback
- **Icons:** `lucide-react`

## Codebase Structure
- `src/main.tsx` - App entrypoint
- `src/App.tsx` - Main layout, dashboard, catalog search, custom food entry, and meal listing
- `src/components/` - Shared UI elements:
  - `logo-mark.tsx` - Custom brand logo SVG
  - `meal-card.tsx` - Display for specific meal entries with options to delete/duplicate
  - `progress-ring.tsx` - Visual circular calorie indicator
  - `theme-toggle.tsx` - Smooth switch between light and dark modes
  - `ui/` - Reusable primitives (buttons, inputs, separators, sliders)
- `src/data/` - Static JSON databases and data helpers:
  - `foods.ts` - Food catalog, target presets, categories, meal hints
- `src/hooks/` - Core custom React hooks:
  - `use-calorie-tracker.ts` - State management hook (loads/saves to localStorage)
  - `use-theme.ts` - System/user theme synchronization hook
- `src/lib/` - Helper libraries:
  - `tracker.ts` - Calorie math, macro formatting, snapshot generation
  - `utils.ts` - Classname merging utilities (`cn`)
- `src/types.ts` - TypeScript interface and type definitions

## UI/UX Rules & Guidelines
- **Mobile First:** All layouts must be responsive, relying on CSS Grid/Flexbox.
- **Visual Style:** Clean, high-contrast, typographically centered design. Avoid glassmorphism.
- **Animations:** Strictly use pure Tailwind transitions and micro-interactions (e.g., hover states, scale transforms) to preserve high performance. No heavy external animation libraries.
- **Language Policy:** Code, commits, README, and comments must be in English. User-facing chat and logs in Polish.

## Development Workflows
- **Dependency Management:** Use `pnpm` only. Always run `pnpm typecheck` and `pnpm lint` before completing tasks.
- **Local Dev Server:** Start the server with `pnpm run dev`.
- **Git Policy:** Work on feature branches. Do not push to remote directly without explicit user request.
