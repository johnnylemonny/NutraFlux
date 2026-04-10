<p align="center">
  <img src="public/nutraflux-banner.png" width="100%" alt="NutraFlux Banner">
</p>

<p align="center">
  <img src="public/favicon.svg" width="120" height="120" alt="NutraFlux Logo">
</p>

<h1 align="center">NutraFlux</h1>

<p align="center">
  <strong>Fuel your nutritional momentum with precision.</strong><br>
  A professional, local-first daily calorie and macro tracker built for speed, privacy, and technical excellence.
</p>

<p align="center">
  <a href="https://github.com/johnnylemonny/NutraFlux/actions/workflows/deploy.yml"><img src="https://img.shields.io/github/actions/workflow/status/johnnylemonny/NutraFlux/deploy.yml?branch=main&style=for-the-badge&logo=github&label=deploy&color=52B788" alt="Deploy status"></a>
  <a href="https://github.com/johnnylemonny/NutraFlux/actions/workflows/super-linter.yml"><img src="https://img.shields.io/github/actions/workflow/status/johnnylemonny/NutraFlux/super-linter.yml?branch=main&style=for-the-badge&logo=github&label=lint&color=52B788" alt="Lint status"></a>
  <a href="https://github.com/johnnylemonny/NutraFlux/blob/main/LICENSE"><img src="https://img.shields.io/github/license/johnnylemonny/NutraFlux?style=for-the-badge&color=52B788" alt="License"></a>
  <a href="https://johnnylemonny.github.io/NutraFlux/"><img src="https://img.shields.io/badge/Live-Demo-52B788?style=for-the-badge" alt="Live Demo"></a>
</p>

---

## 🌟 Overview

**NutraFlux** is a high-performance nutritional tracking application designed for those who value speed and data privacy. It eliminates the friction of traditional trackers by offering an instant, search-first logging experience combined with a stunning glassmorphism interface.

Built with a **local-first** architecture, NutraFlux ensures your personal data never leaves your browser, providing a zero-latency experience that works entirely offline.

## ✨ Features

- ⚡️ **Nutra-Speed Logging:** Instant search and log meals with a search-first interface.
- 🔍 **Metri-Food Lookup:** Advanced full-text search with wildcard support over a compact local catalog.
- 🥗 **Flux Categories:** Categorize entries into Breakfast, Lunch, Dinner, and Snacks with real-time feedback.
- 📊 **Precision Momentum:** Professional progress indicators and calorie budgeting to visualize your intake.
- ❤️ **Smart Memory:** Persistent favorites and recently used foods for one-tap tracking.
- 🌓 **Technical Aesthetic:** State-of-the-art glassmorphism UI with Light, Dark, and System mode support.
- 📱 **Adaptive Design:** Seamless performance across mobile, tablet, and desktop viewports.

## ⚖️ License

NutraFlux is open-source software licensed under the **GNU Affero General Public License v3 (AGPL-3.0)**. This ensures that the application remains free for the community and that any modifications served over a network are contributed back. 

---

## 🛠️ Tech Stack

NutraFlux leverages the latest frontend engineering standards:

- **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (OKLCH color system + backdrop-filter)
- **Icons:** [Lucide React](https://lucide.dev/)
- **UI Logic:** Custom high-resilience components with [Radix UI](https://www.radix-ui.com/) primitives
- **Notifications:** [Sonner](https://sonner.stevenly.me/)

## 🚀 Getting Started

### Prerequisites

- **Node.js:** 22.0.0 or higher
- **Package Manager:** [pnpm](https://pnpm.io/) 10+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/johnnylemonny/NutraFlux.git
   cd NutraFlux
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Build for production:
   ```bash
   pnpm build
   ```

## 🏗️ Project Structure

```text
src/
├── components/   # Reusable UI components & Design System
├── data/         # Food catalogs and presets
├── hooks/        # Custom React hooks (tracker logic, theme)
├── lib/          # Utilities, math logic, and helper functions
├── types/        # TypeScript interfaces and types
└── App.tsx       # Main application entry point
```

## 🔐 Privacy & Local-First

NutraFlux is strictly **local-first**. All nutritional data, settings, and food history are stored in your browser's `localStorage`. No trackers, no cookies, no cloud syncing—your health data belongs to you.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please see our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

---

<p align="center">
  <i>Built with passion as part of a public open-source fitness ecosystem.</i>
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
