<div align="center">
  <img src="public/nutraflux-banner.png" width="100%" alt="NutraFlux Banner">
  
  <br />

  <img src="public/favicon.svg" width="100" height="100" alt="NutraFlux Logo">

  # NutraFlux
  ### Professional • Local-First • High-Performance

  [![Deploy Status](https://img.shields.io/github/actions/workflow/status/johnnylemonny/NutraFlux/deploy.yml?branch=main&style=for-the-badge&logo=github&label=deploy&color=52B788)](https://github.com/johnnylemonny/NutraFlux/actions/workflows/deploy.yml)
  [![Lint Status](https://img.shields.io/github/actions/workflow/status/johnnylemonny/NutraFlux/super-linter.yml?branch=main&style=for-the-badge&logo=github&label=lint&color=52B788)](https://github.com/johnnylemonny/NutraFlux/actions/workflows/super-linter.yml)
  [![License](https://img.shields.io/github/license/johnnylemonny/NutraFlux?style=for-the-badge&color=52B788)](https://github.com/johnnylemonny/NutraFlux/blob/main/LICENSE)
  [![Live Demo](https://img.shields.io/badge/Live-Demo-52B788?style=for-the-badge)](https://johnnylemonny.github.io/NutraFlux/)

  **Fuel your nutritional momentum with precision.**  
  NutraFlux is a premium, local-first daily calorie and macro tracker built for those who demand speed, privacy, and technical excellence.

  [Explore Docs](#-getting-started) • [Report Bug](https://github.com/johnnylemonny/NutraFlux/issues) • [Request Feature](https://github.com/johnnylemonny/NutraFlux/issues)

</div>

---

## 📖 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🏗️ Project Architecture](#️-project-architecture)
- [🔐 Privacy & Data Philosophy](#-privacy--data-philosophy)
- [🤝 Contributing](#-contributing)
- [⚖️ License](#️-license)
- [🙏 Acknowledgements](#-acknowledgements)

---

## 🌟 Overview

**NutraFlux** is a high-performance nutritional tracking application designed for power users who value both their time and their data privacy. It eliminates the friction of traditional trackers by offering an **instant, search-first logging experience** combined with a stunning glassmorphism interface.

Unlike many modern trackers that rely on slow API calls and invasive data-sharing, NutraFlux is built with a **local-first** architecture. Your personal data never leaves your browser, ensuring zero-latency interactions and 100% offline capability.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| ⚡ **Nutra-Speed Logging** | Instant, search-first interface for logging meals in seconds. |
| 🔍 **Metri-Food Lookup** | Advanced full-text search with wildcard support over a compact local catalog. |
| 🥗 **Flux Categories** | Smart categorization into Breakfast, Lunch, Dinner, and Snacks. |
| 📊 **Precision Momentum** | Real-time progress indicators and calorie budgeting visualizations. |
| ❤️ **Smart Memory** | One-tap logging for favorites and recently used foods. |
| 🌒 **Technical Aesthetic** | State-of-the-art glassmorphism UI with native Light/Dark/System support. |
| 📱 **Adaptive Design** | Optimized for mobile-first workflows without sacrificing desktop power. |

---

## 🛠️ Tech Stack

NutraFlux is engineered using the most resilient modern frontend standards:

- **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Framework:** [Vite](https://vitejs.dev/) for ultra-fast HMR and optimized builds
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (Leveraging OKLCH color space & container queries)
- **Design System:** [Radix UI](https://www.radix-ui.com/) primitives + custom glassmorphic components
- **Experience:** [Lucide React](https://lucide.dev/) for iconography & [Sonner](https://sonner.stevenly.me/) for toast management

---

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js:** `v22.0.0` or higher
- **pnpm:** `v10.0.0` or higher (Recommended)

### ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/johnnylemonny/NutraFlux.git
   cd NutraFlux
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Spin up the development environment:**
   ```bash
   pnpm dev
   ```

4. **Prepare for production:**
   ```bash
   pnpm build
   ```

---

## 🏗️ Project Architecture

```text
src/
├── components/   # Atomic UI components & custom Design System
├── data/         # Optimized local nutritional catalogs
├── hooks/        # Reactive logic for tracking, theming, and persistence
├── lib/          # Utilities, math engines, and formatting helpers
├── types/        # Comprehensive TypeScript definitions
└── App.tsx       # Root orchestrator and layout definition
```

---

## 🔐 Privacy & Data Philosophy

NutraFlux strictly adheres to the **local-first** principle:

- **Zero Cloud:** No servers, no syncing, no data leaks.
- **Client-Side Storage:** All nutritional history and user preferences are stored in `localStorage`.
- **Absolute Ownership:** Your health data belongs to you, and you alone. It exists only on your device.
- **Offline Integrity:** The app is fully functional without an internet connection, ensuring your tracking isn't interrupted by network issues.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Please review our [**Contributing Guidelines**](CONTRIBUTING.md) before starting.
2. Check the [**Projects**](https://github.com/johnnylemonny/NutraFlux/projects) and [**Issues**](https://github.com/johnnylemonny/NutraFlux/issues) for open tasks.
3. Open a Pull Request using our [**Standard Template**](.github/pull_request_template.md).

---

## ⚖️ License

Distributed under the **GNU Affero General Public License v3 (AGPL-3.0)**. See `LICENSE` for more information. This license was chosen to ensure the software remains free and that any improvements are contributed back to the public domain.

---

## 🙏 Acknowledgements

- Inspired by the [App Ideas](https://github.com/florinpop17/app-ideas) community.
- Icons by [Lucide](https://lucide.dev/).
- Design inspiration from various glassmorphism case studies.

---

<p align="center">
  <i>Built with technical passion as part of a public open-source health ecosystem.</i>
</p>

<p align="center">
<pre align="center">
  _   _       _              ______ _             
 | \ | |     | |            |  ____| |            
 |  \| |_   _| |_ _ __ __ _ | |__  | |_   ___  __ 
 | . ` | | | | __| '__/ _` ||  __| | | | | \ \/ / 
 | |\  | |_| | |_| | | (_| || |    | | |_| |>  <  
 |_| \_|\__,_|\__|_|  \__,_||_|    |_|\__,_/_/\_\ 
</pre>
</p>
