# Nandini — Portfolio & Mentorship ✨

![Portfolio Preview](./public/assets/picture.jpeg)

[![Next.js](https://img.shields.io/badge/Next.js-16.2.7-black?style=flat&logo=next.js)](#)
[![React](https://img.shields.io/badge/React-19.2.4-61dafb?style=flat&logo=react)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat&logo=typescript)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-^4-38bdf8?style=flat&logo=tailwindcss)](#)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](#license)

A modern, interactive personal portfolio built with **Next.js (App Router)**, styled with **Tailwind CSS**, and featuring:

- 🎯 **Sections**: About, Skills, Education, Projects, Contact
- 🧠 **Chat Widget (UI + API placeholders)**
- 🎨 **Custom cursor & effects**
- 📬 **Contact form endpoint (placeholder)**
- 📈 **Professional UI/UX with smooth scrolling + reveal animations**

---

## 📋 Quick Start

### Prerequisites
- Node.js **18+** recommended

### Install & Run

```bash
cd portfolio-next
npm install
npm run dev
```

Open:
- http://localhost:3000

---

## 🧱 Tech Stack

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- **ESLint**

---

## 🗂️ Project Structure (Directory Tree)

```text
portfolio-next/
├─ app/
│  ├─ api/
│  │  ├─ chat/
│  │  │  └─ route.ts
│  │  └─ contact/
│  │     └─ route.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ chat/
│  │  ├─ ChatInput.tsx
│  │  ├─ ChatMessage.tsx
│  │  ├─ ChatWidget.tsx
│  │  ├─ ChatWindow.tsx
│  │  └─ (chat UI)
│  └─ portfolio/
│     ├─ About.tsx
│     ├─ Contact.tsx
│     ├─ CursorAndEffects.tsx
│     ├─ Education.tsx
│     ├─ Footer.tsx
│     ├─ Hero.tsx
│     ├─ Navbar.tsx
│     ├─ PortfolioMarquee.tsx
│     ├─ PortfolioPage.tsx
│     ├─ Projects.tsx
│     └─ Skills.tsx
├─ public/
│  ├─ assets/
│  │  ├─ (images, fonts, pdf, favicon set, vendor assets)
│  │  └─ Nandini.pdf
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  └─ vercel.svg
├─ eslint.config.mjs
├─ next.config.ts
├─ package.json
└─ tsconfig.json
```

(High-level mapping)
- `app/` — Next.js routes and layout
  - `app/page.tsx` — portfolio entry page
  - `app/layout.tsx` — root layout + metadata
  - `app/api/contact/route.ts` — contact form handler (placeholder)
  - `app/api/chat/route.ts` — chat handler (placeholder)
- `components/portfolio/` — main portfolio UI sections
- `components/chat/` — chat widget UI components
- `public/` — images, icons, and assets


---

## 🚀 Features

### 🧩 Portfolio Sections
- **Hero** (headline + CTA + imagery)
- **About** (bio and experience)
- **Skills** (skill categories)
- **Education** (timeline)
- **Projects** (showcase)
- **Contact** (form + social links)
- **Footer** (closing links/info)

### ✨ UI Effects
- Custom cursor + grain/blobs style effects
- Intersection-based reveal animations for headings/paragraphs
- Marquee/animated highlights in the UI

### 🤖 Chat & Contact (API placeholders)
The app includes working API endpoints for future integration:
- `POST /api/chat` — currently returns `{ ok: true, reply: "" }`
- `POST /api/contact` — currently returns `{ ok: true }`

These endpoints are ready to be wired to:
- an AI provider (OpenAI/Anthropic/etc.) for chat
- an email service (Formspree/Resend/SMTP) for contact
- a DB for conversation history (optional)

---

## 🔧 Scripts

From `portfolio-next/package.json`:

- `npm run dev` — run development server
- `npm run build` — build for production
- `npm start` — start production server
- `npm run lint` — run ESLint

---

## 🧪 Testing

No automated tests are configured in this repo yet.

Recommended manual checks:
- Run `npm run dev`
- Verify navigation + section reveal animations
- Validate contact form submission
- Validate chat widget submission (currently placeholder response)

---

## 🌍 Deployment

Works well with **Vercel**.

### Vercel Steps (typical)
1. Import the repo
2. Set build command to `npm run build`
3. Set output directory (default for Next.js)
4. Deploy

---

## 🛡️ Security & Privacy Notes

- API routes are currently placeholders.
- When integrating real services, avoid exposing secrets in the client.
- Use environment variables (`.env.local`) and server-side handling.

---

## 📄 License

MIT. See `LICENSE`.

---

## 🤝 Contributing

If you’d like to improve features (chat integration, email delivery, DB persistence), open a PR and reference the relevant file areas in:
- `app/api/chat/route.ts`
- `app/api/contact/route.ts`
- `components/chat/*`
- `components/portfolio/*`

