# Nandini — Personal Portfolio & AI Digital Twin 🚀

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

A premium, interactive personal portfolio website featuring a future-ready **AI Portfolio Assistant** acting as a digital twin. Built on **Next.js (App Router)** and styled using **Tailwind CSS v4** with hardware-accelerated **Framer Motion** animations.

---

## ✨ Features

### 🎨 Portfolio Ecosystem
- **Futuristic Dark Aesthetic**: Immersive glassmorphic design utilizing cyan and fuchsia gradients.
- **Neural Learning Timeline**: Interactive education and credentials pathway with custom status metrics.
- **Wins Grid**: Clean, hover-activated achievements dashboard showcasing Hackathon and Open Source milestones.
- **Social Orbit Loop**: Rotating interactive socials console tracking cursor signals to map connections.
- **Custom Cursor & Noise Overlays**: Smooth custom magnetic cursor and subtle film-grain texture.

### 🤖 AI Digital Twin (Portfolio Assistant)
- **Glassmorphic Chat Interface**: Responsive widget floating in the layout with entry scale animations.
- **Quick Action Cards**: Tap-to-explore triggers (Projects, Resume, GitHub, Community, Wins, Contact) allowing zero-type navigation.
- **RAG Architecture & Mock Vector DB**: Local query semantic-matching search library mapping requests to indexed portfolio documents.
- **YouTube Linkage**: Seamless links pointing to Youtube channel `@self_taught_bob` for mentorship content.
- **Voice Mode Visualizer**: Interactive speech panel with animated SVG equalizer wave patterns.

---

## 🏗️ Architecture

The personal assistant runs on a modular, future-ready structure separating client interfaces, caching rules, and document vector mappings.

```mermaid
sequenceDiagram
    autonumber
    actor User as Visitor
    participant Widget as Chat Widget (UI)
    participant API as Chat API (/api/chat)
    participant DB as Mock Vector DB
    participant Cache as Sync Cache (JSON)
    participant GitHub as GitHub API
    
    User->>Widget: Asks: "What is AutoBotX?"
    Widget->>API: POST /api/chat { message }
    Note over API: Load Local Facts
    API->>Cache: Read Cache (github-cache.json)
    Cache-->>API: Return Repos Data
    API->>DB: Index Facts & Repo Documents
    API->>DB: Query Term Search
    DB-->>API: Match Ranked Documents
    API-->>Widget: Return Conversational Markdown Response
    Widget-->>User: Renders Answer with Clickable Links
```

---

## 📂 Project Structure

```text
Portfolio/                     # Repository Root
├── app/                       # App Router Directory
│   ├── api/                   # API Endpoints
│   │   ├── chat/              # Smart conversational search route
│   │   ├── contact/           # Contact form receiver (stub)
│   │   └── sync/              # Manual/Cron GitHub cache rebuilder
│   ├── globals.css            # Global CSS + Tailwind v4 theme mapping
│   ├── layout.tsx             # Root layout HTML structure
│   └── page.tsx               # Portfolio landing page loader
├── components/                # React Components
│   ├── chat/                  # Chat assistant widget files
│   └── portfolio/             # Hero, Skills, Education, Footer, etc.
├── data/                      # Cached local JSON files
├── lib/                       # Utility helpers and core RAG stubs
├── netlify.toml               # Netlify Deployment settings
└── README.md                  # Project Documentation
```

---

## 🛠️ Quick Start & Local Development

### Prerequisites
- Node.js **18.0.0+**
- npm **10.0.0+**

### Steps to Run
1. Install the dependencies:
   ```bash
   npm install
   ```
2. Boot up the local development server:
   ```bash
   npm run dev
   ```
3. Build the repository cache from GitHub:
   Open your browser and navigate to `http://localhost:3000/api/sync`. This triggers the GitHub API sync and builds your local repository index in `data/github-cache.json`.

---

## 🚀 Deployment (Vercel & Netlify)

This project is fully configured for out-of-the-box deployment to Vercel and Netlify since all files are located at the repository root.

### 📐 Vercel Configuration
1. In the Vercel Dashboard, select **New Project** and import the repository.
2. Vercel will automatically detect the Framework Preset as **Next.js**.
3. Click **Deploy**. Vercel will build and serve your site instantly.

### 📐 Netlify Configuration
This project includes a root-level `netlify.toml` file that specifies the publish and build commands:
- **Build command**: `npm run build`
- **Publish directory**: `.next`

Simply import the repository in Netlify, and Netlify will deploy it automatically without requiring any manual dashboard settings!
