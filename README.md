# Nandini Goyal — Portfolio & AI Portfolio Assistant

[![Netlify Status](https://api.netlify.com/api/v1/badges/1cdd8a3f-3447-4071-8935-02febb091b07/deploy-status)](https://app.netlify.com/projects/nandini-goyal/deploys)

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge\&logo=next.js\&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge\&logo=react\&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge\&logo=tailwindcss\&logoColor=white)](https://tailwindcss.com/)

Personal portfolio built with Next.js, React, TypeScript, and Tailwind CSS. The site showcases my projects, open-source work, community initiatives, achievements, and includes an AI-powered portfolio assistant that can answer questions about my work and experience.

### Live Site

🌐 https://nandini-goyal.netlify.app/

---

## Features

### Portfolio

* Responsive portfolio experience built with Next.js App Router
* Custom space-inspired visual design
* Interactive education journey
* Experience and leadership showcase
* Achievement archive
* Project portfolio
* Community and open-source contributions
* Social and contact integrations

### AI Portfolio Assistant

* Chat-based portfolio assistant
* Quick action shortcuts
* Semantic search across portfolio content
* GitHub repository awareness
* Resume and project discovery
* YouTube integration for content and mentorship resources
* Voice-mode interface with visual feedback

---

## Tech Stack

### Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS

### Backend & APIs

* Next.js API Routes
* REST APIs

### Tooling

* Git
* GitHub
* Netlify
* Postman

---

## Project Structure

```text
Portfolio/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── .gitignore
├── package.json
├── next.config.ts
├── netlify.toml
└── README.md
```

### Directory Overview

* `app/` — Pages, layouts, API routes, and routing logic
* `components/` — Reusable UI components
* `lib/` — Utilities, helpers, search logic, and supporting code
* `public/` — Static assets and media

---

## Local Development

### Prerequisites

* Node.js 18+
* npm 10+

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Optional GitHub Sync

```text
http://localhost:3000/api/sync
```

Triggers the GitHub sync process and updates the local repository index used by the assistant.

---

## Deployment

The project is configured for deployment on Netlify.

### Netlify

```bash
npm run build
```

Publish directory:

```text
.next
```

Configuration:

```text
netlify.toml
```

### Vercel

Import the repository and deploy. Next.js settings are detected automatically.

---

## About Me

I'm Nandini Goyal, a BCA student, community builder, open-source contributor, and aspiring software engineer.

Areas of interest:

* Software Engineering
* Web Development
* AI Applications
* Computer Vision
* Developer Communities
* Open Source

---

Made by Nandini Goyal
