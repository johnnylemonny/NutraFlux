<p align="center">
  <img src="public/macroflow-banner.png" width="100%" alt="MacroFlow Banner">
</p>

<p align="center">
  <img src="public/favicon.svg" width="120" height="120" alt="MacroFlow Logo">
</p>

<h1 align="center">MacroFlow</h1>

<p align="center">
  <strong>Build your daily nutritional momentum with ease.</strong><br>
  A professional, local-first daily calorie tracker with a focus on speed, privacy, and visual excellence.
</p>

<p align="center">
  <a href="https://github.com/johnnylemonny/macroflow/actions"><img src="https://img.shields.io/github/actions/workflow/status/johnnylemonny/macroflow/moderator.yml?branch=main&style=for-the-badge&logo=github&color=52B788" alt="Build Status"></a>
  <a href="https://github.com/johnnylemonny/macroflow/blob/main/LICENSE"><img src="https://img.shields.io/github/license/johnnylemonny/macroflow?style=for-the-badge&color=52B788" alt="License"></a>
  <a href="https://johnnylemonny.github.io/macroflow/"><img src="https://img.shields.io/badge/Live-Demo-52B788?style=for-the-badge" alt="Live Demo"></a>
</p>

---

## 🌟 Overview

**MacroFlow** is designed for those who want to track their nutrition without the complexity of traditional "homework-like" apps. It provides a sleek, high-performance interface for logging meals, tracking calories, and maintaining a healthy pace throughout the day.

Built as a **local-first** application, your data stays in your browser's storage, ensuring maximum privacy and instant feedback without server latency.

## ✨ Features

- ⚡️ **High-Speed Logging:** Search and log meals in seconds with a search-first approach.
- 🔍 **Smart Food Lookup:** Full-text search with wildcard support (e.g., `chicken*` or `*salad`) over a local JSON catalog.
- 🥗 **Meal Categorization:** Organize entries into Breakfast, Lunch, Dinner, and Snacks with dedicated summaries.
- 📊 **Visual Momentum:** Real-time progress rings and calorie budgeting to keep you on track.
- ❤️ **Favorites & Recents:** Save your common foods and quickly re-add recent entries with a single click.
- 🌓 **Dynamic Theming:** Beautiful glassmorphism UI with support for Light, Dark, and System modes.
- 📱 **Fully Responsive:** Optimised for both desktop and mobile screens.

## 🛠️ Tech Stack

MacroFlow is built with modern, cutting-edge technologies for optimal performance:

- **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (using OKLCH colors & glassmorphism)
- **Icons:** [Lucide React](https://lucide.dev/)
- **UI Primitives:** Custom Sage-toned components loosely based on [shadcn/ui](https://ui.shadcn.com/)
- **Toasts:** [Sonner](https://sonner.stevenly.me/)

## 🚀 Getting Started

### Prerequisites

- **Node.js:** 22.0.0 or higher
- **Package Manager:** [pnpm](https://pnpm.io/) 10+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/johnnylemonny/macroflow.git
   cd macroflow
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

MacroFlow is **local-first**. All your calorie data, settings, and favorites are stored exclusively in your browser's `localStorage`. No data is sent to any server, making it 100% private and offline-capable once loaded.

## 🤝 Contributing

This is an open-source project and contributions are welcome! 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

**johnnylemonny**  
Find more of my open-source work on [GitHub](https://github.com/johnnylemonny).

---

<p align="center">
  <i>Built with passion as part of a public open-source fitness ecosystem.</i>
</p>

<p align="center">
<pre align="center">
 $$$$$$\  $$$$$$\  $$\  $$\ $$\  $$\ $$\  $$\ $$\  $$\ $$\  $$\       $$$$$$$$\  $$\  $$\  $$$$$$\  $$\  $$\ $$\  $$\ $$\  $$\        $$\ 
\_$$  _|$$  __$$\ $$ |  $$ |$$$\  $$ |$$$\  $$ |\$$\  $$  / \$$\  /        $$  _____|$$ \  $$ |$$  __$$\ $$ \  $$ |$$$\  $$ |$$$\  $$ |       $$ | 
  $$ |  $$ /  $$ |$$ |  $$ |$$$$ \ $$ |$$$$ \ $$ | \$$\ $$ /   \$$\ $$ /         $$ |      $$ \$$ |$$ /  $$ |$$ \$$ |$$$$ \ $$ |$$$$ \ $$ |       $$ | 
  $$ |  $$ |  $$ |$$$$$$$$ |$$| \$$ $$ |$$| \$$ $$ |  \$$$$ /     \$$$$ /          $$$$$\    $$ \$$ |$$ |  $$ |$$ \$$ |$$| \$$ $$ |$$| \$$ $$ |       $$ | 
  $$ |  $$ |  $$ |$$  __$$ |$$ | \$$$$ |$$ | \$$$$ |   \$$ /       \$$ /           $$  __|   $$ | \$$|$$ |  $$ |$$ | \$$|$$ | \$$$$ |$$ | \$$$$ |       \__| 
  $$ |  $$ |  $$ |$$ |  $$ |$$ |  \$$$ |$$ |  \$$$ |    $$ |        $$ |            $$ |      $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  \$$$ |$$ |  \$$$ |       $$\ 
$$$$$$\  $$$$$$  |$$ |  $$ |$$ |   \$$ |$$ |   \$$ |    $$ |        $$ |            $$$$$$$$\ $$ |  $$ | $$$$$$  |$$ |  $$ |$$ |   \$$ |$$ |   \$$ |       $$ | 
\______| \______/ \__|  \__|\__|    \__|\__|    \__|\__|        \__|            \________|\__|  \__| \______/ \__|  \__|\__|    \__|\__|    \__|\__|     \__| 
</pre>
</p>
