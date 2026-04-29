# Pollen Polymer Index

A real-time polymer pellet price tracking dashboard built for industrial pellet 3D printing — powered by [Pollen AM](https://pollen.am).

## Overview

The Pollen Polymer Index provides indicative pricing intelligence for polymer grades commonly used in industrial FFF/FGF (pellet-based) 3D printing, including PA12, PP, PLA, PETG, ABS, and specialty compounds.

## Prerequisites

- **Node.js** 20 or later
- **npm** 10 or later

## Getting Started

### Development server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
npm run build
```

The static export is written to `./out/`. Deploy the contents of `out/` to any static host.

### Linting

```bash
npm run lint
```

## Tech Stack

- **Framework**: Next.js 15 (App Router, static export)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Charts**: lightweight-charts
- **UI Primitives**: Radix UI
- **Icons**: Lucide React
- **Fonts**: Inter (UI), JetBrains Mono (numbers/prices) via next/font

## Deployment

The project deploys automatically to GitHub Pages on push to `main` or `claude/polymer-price-tracker-mvp-EVQiU` via the workflow in `.github/workflows/deploy.yml`.

## Disclaimer

All prices shown are **indicative only** and are aggregated from publicly available sources. They do not constitute financial, investment, or procurement advice. Pollen AM makes no warranty as to the accuracy or completeness of pricing data. Always verify prices directly with suppliers before making purchasing decisions.

---

Built for industrial pellet 3D printing — powered by Pollen AM.
