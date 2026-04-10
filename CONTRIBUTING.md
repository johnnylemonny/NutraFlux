# Contributing to NutraFlux

First off, thank you for considering contributing to NutraFlux! It's people like you who make NutraFlux such a great tool for the community.

## Code of Conduct

By participating in this project, you are expected to uphold our high standards of professional conduct and respect for the community.

## How Can I Contribute?

### Reporting Bugs
* Check the existing issues to ensure the bug hasn't already been reported.
* Open a new issue with a clear title and description, including as much relevant information as possible (OS, Browser, steps to reproduce).

### Suggesting Enhancements
* Open an issue to discuss your idea before implementing it.
* Explain the "why" behind the feature and how it benefits the users.

### Pull Requests
1. Fork the repo and create your branch from `main`.
2. Make sure your code follows the established style and passes linting.
3. Ensure the UI remains accessible (WCAG 2.1 AA) and performant.
4. Issue a Pull Request with a clear description of the changes.

## Development Setup

### Stack
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4 (using OKLCH colors)
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm

### Local Environment
1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/NutraFlux.git
   cd NutraFlux
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the dev server:
   ```bash
   pnpm dev
   ```

## Coding Standards

To maintain the quality of the project, please adhere to the following:

- **Clean Code**: Use descriptive naming and keep functions focused.
- **Linting & Types**: Always run `pnpm lint` and `pnpm typecheck` before committing. CI will reject PRs with warnings.
- **Design**: Follow the existing glassmorphism aesthetic. Use Tailwind CSS v4 variables for colors.
- **Commit Messages**: We prefer [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) (e.g., `feat: add protein target chart`, `fix: resolve mobile layout overflow`).

## Licensing

By contributing, you agree that your contributions will be licensed under the **GNU Affero General Public License v3 (AGPL-3.0)**. We chose this license to keep the project open and protect it from closed-source commercial exploitation.

---

Thank you for building the future of nutritional tracking with us! 🚀
