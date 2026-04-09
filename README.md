# Calorie Counter

A friendly, open-source calorie tracker built as a polished demo app. It combines a clean daily tracking flow with a local-first food search experience, fast logging, favorites, recent foods, and a lightweight visual system designed for public GitHub sharing. Inspired by the advanced project idea from [App Ideas](https://github.com/florinpop17/app-ideas)

## Why this project exists

This project started as an implementation of `Calorie Counter` challenge, then expanded into a more refined demo product:

- Search foods from a local JSON dataset loaded on first use
- Add foods into breakfast, lunch, dinner, and snacks
- Track daily calorie target, consumed calories, and remaining budget
- Save favorite foods and quickly re-add recent ones
- Duplicate entries, reset the day, and load a sample day for demos
- Switch between light, dark, and follow-system theme modes

## Feature highlights

- `Search + Clear` search panel with wildcard support such as `chicken*`
- Scrollable search results capped at 25 items with a `Show 25 more` action
- Warning states for empty searches and no matching results
- Local-first persistence with `localStorage`
- English-only UI
- Glassmorphism-inspired visual style with subtle motion
- GitHub Pages-ready Vite configuration

## Tech stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn-friendly UI primitives
- Lucide icons
- Sonner toasts

## Local development

### Requirements

- Node.js 22+
- pnpm 10+

### Run locally

```bash
pnpm install
pnpm dev
```

### Validation

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Deploy to GitHub Pages

This repo is configured for GitHub Pages with the repository base path:

`https://johnnylemonny.github.io/Calorie-Counter/`

Recommended setup:

1. Push the repository to GitHub.
2. In GitHub, enable `Pages` and choose `GitHub Actions` as the source.
3. The included workflow will build and deploy the `dist` folder automatically on pushes to `main`.

<!-- ## Screenshots -->


## Project structure

```text
src/
  components/
  data/
  hooks/
  lib/
  App.tsx
```

## Inspiration and resources

- App Ideas: `Calorie Counter`
- U.S. Department of Agriculture MyPyramid Food Raw Data
- WebMD calorie counter example

The food catalog is generated locally from the `food_tables/` exports in this repository and stored as JSON for a lighter front-end-only experience. The import script accepts the My Foodapedia XML/XLSX tables included in the repo and converts them into the catalog the app reads when the search flow is used.

## Roadmap ideas

- Replace the curated food list with a transformed MyPyramid dataset
- Add import/export of saved data
- Add saved meal templates
- Add trend views across multiple days

## Contributing

Issues, suggestions, and pull requests are welcome. If you fork this project, keep the experience lightweight, clear, and useful.

## License

MIT
