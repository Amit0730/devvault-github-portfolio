# DevVault — Developer Project Portfolio

> A modern, high-performance developer portfolio automatically powered by GitHub repositories, commits, and public activity.

![DevVault Preview](https://img.shields.io/badge/DevVault-Portfolio-6366f1?style=for-the-badge&logo=github)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

---

## ✨ Features

- 👤 **Developer Profile Hero**: Dynamic avatar, bio, aggregate stars/forks counters, top programming languages, and GitHub status badge.
- 🔄 **Real-Time Username Switcher**: Seamlessly switch between any public GitHub user profile (`Amit0730`, `torvalds`, `leerob`, etc.) without authentication.
- 🌟 **Featured Projects Spotlight**: Curated spotlight section highlighting key applications with glassmorphism cards and custom pin/unpin toggles.
- 🏷️ **Intelligent Filtering & Search**:
  - Filter categories: **All**, **AI/ML**, **Full Stack**, **Frontend**, **Backend**, **Cybersecurity**, and **Other**.
  - Instant search across repository names, descriptions, languages, and topics.
  - Sorting: **Most Stars**, **Recently Updated**, **Alphabetical (A-Z)**, and **Most Forks**.
- 📊 **GitHub Activity & Telemetry**:
  - Simulated interactive 5-month contribution heatmap.
  - Real-time public events stream (PushEvents, CreateEvents) with commit messages and direct diff links.
  - Recently updated repositories quick list.
- 🔍 **Interactive Project Modal**:
  - Full README preview with Markdown rendering, shields badges, and code blocks.
  - Multi-language breakdown progress bar with percentage distribution.
  - Recent commit history stream.
  - Git clone command box with one-click copy.
  - Direct links to repository and live demos.
- ⚡ **High Performance & Resilience**:
  - Zero token requirement for public viewing.
  - Dual-layer caching (`localStorage` + in-memory with TTL) to protect against API rate limits.
  - Graceful fallback snapshots when unauthenticated rate limits (60/hr) are reached.
  - Lightweight GPU-accelerated canvas particle ambient background running at 60 FPS.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown Preview**: `react-markdown` & `remark-gfm`
- **Data Source**: [GitHub REST API v3](https://docs.github.com/en/rest)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Amit0730/devvault-github-portfolio.git
cd devvault-github-portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
devvault-github-portfolio/
├── app/
│   ├── globals.css          # Design system, glassmorphism, animations, markdown styling
│   ├── layout.tsx           # Root layout with SEO metadata & Inter font
│   └── page.tsx             # Master portfolio controller & state orchestration
├── components/
│   ├── ActivitySection.tsx  # Heatmap, recent events stream, recently updated repos
│   ├── AmbientBackground.tsx# GPU-accelerated dynamic particle ambient canvas
│   ├── FeaturedSection.tsx  # Pinned spotlight project cards
│   ├── Footer.tsx           # Modern developer footer & attribution
│   ├── Navbar.tsx           # Header, username switcher, quick presets, rate-limit badge
│   ├── ProfileHero.tsx      # Avatar, bio, aggregates, key stats, social links
│   ├── ProjectCard.tsx      # Individual repository card with language dots and links
│   ├── ProjectGrid.tsx      # Category tabs, live search, sort dropdown, empty/loading states
│   └── ProjectModal.tsx     # Project details drawer with live README preview & languages
├── lib/
│   └── github.ts            # GitHub REST API client, heuristics, caching & snapshots
├── types/
│   └── github.ts            # TypeScript data interfaces
├── next.config.ts           # Next.js config with security headers & image domains
├── postcss.config.mjs       # Tailwind CSS v4 PostCSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

---

## 📄 License

MIT License © 2026 [Amit Kumar Singh](https://github.com/Amit0730)
