# 🌟 Nandini Goyal — Personal Portfolio & AI Digital Twin 🚀

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

Welcome to my **Personal Portfolio Website**! It’s designed to be a premium, highly interactive digital twin, bringing together my achievements, projects, and an integrated **AI Portfolio Assistant** that can answer your questions right on the site.

🌍 **Live Deployment:** [nandini-goyal.netlify.app](https://nandini-goyal.netlify.app/)

---

## ✨ What's Inside?

### 🎨 Portfolio Ecosystem
* 🌌 **Futuristic Dark Aesthetic**: Immersive glassmorphic design utilizing beautiful cyan and fuchsia gradients.
* 🎓 **Neural Learning Timeline**: An interactive pathway showcasing my education and credentials with custom metrics.
* 🏆 **Wins Grid**: A clean, hover-activated dashboard to highlight my Hackathon and Open Source milestones.
* 💫 **Social Orbit Loop**: A fun, rotating interactive socials console that reacts to your cursor.
* 🖱️ **Custom Touches**: Smooth magnetic custom cursor and a subtle film-grain texture for that premium feel.

### 🤖 AI Digital Twin (Portfolio Assistant)
* 💬 **Glassmorphic Chat Interface**: A sleek, responsive widget that floats in the layout with satisfying entry animations.
* ⚡ **Quick Action Cards**: Tap-to-explore triggers (Projects, Resume, GitHub, Community, Wins, Contact) allowing you to navigate effortlessly.
* 🧠 **Smart Search Architecture**: Uses local semantic-matching to answer your questions based on my portfolio documents.
* 🎥 **YouTube Integration**: Direct links pointing to my YouTube channel (`@self_taught_bob`) for mentorship and content.
* 🎙️ **Voice Mode Visualizer**: An interactive speech panel featuring animated SVG equalizer wave patterns.

---

## 📂 Project Structure

I've organized the project neatly inside a `src/` directory to keep the root clean and readable!

```text
Portfolio/
├── public/                    # 🖼️ Static assets (images, icons)
├── src/
│   ├── app/                   # 🚀 App Router Directory (Pages, API, Layouts)
│   ├── components/            # 🧩 Reusable React Components (Chat, Portfolio UI)
│   └── lib/                   # 🛠️ Utility helpers and core logic
├── .gitignore                 # 🙈 Git ignore rules
├── package.json               # 📦 Project dependencies
├── next.config.ts             # ⚙️ Next.js configuration
├── netlify.toml               # ⚙️ Netlify deployment configuration
└── README.md                  # 📖 You are reading this right now!
```

> **Note:** Important configuration files like `package.json`, `tsconfig.json`, `netlify.toml`, and other `.config` files are deliberately kept in the root folder because Next.js and deployment platforms (like Netlify) require them there to function correctly! 🚀

---

## 🛠️ Quick Start & Local Development

### Prerequisites
* 🟢 Node.js **18.0.0+**
* 📦 npm **10.0.0+**

### Let's Run It!
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Sync GitHub Cache (Optional):**
   Open your browser and visit `http://localhost:3000/api/sync` to trigger the GitHub API sync and build your local repository index.

---

## 🚀 Deployment

The site is fully configured and live! 
Check it out here: **[nandini-goyal.netlify.app](https://nandini-goyal.netlify.app/)**

If you want to deploy your own version:
* **Vercel**: Just import the repo and it automatically detects Next.js.
* **Netlify**: The `netlify.toml` file is already set up (Build command: `npm run build`, Publish directory: `.next`). Just import and deploy!

---
Made with ❤️ by Nandini
