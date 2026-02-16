# Nandini Portfolio Website

<p align="left">
  <img src="https://img.shields.io/badge/Status-Active-16a34a?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/Type-Personal%20Portfolio-2563eb?style=for-the-badge" alt="Type"/>
  <img src="https://img.shields.io/badge/Built%20With-HTML%2FCSS%2FJS-f97316?style=for-the-badge" alt="Built With"/>
  <img src="https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge" alt="License"/>
</p>

Modern, single-page portfolio for **Nandini** focused on full-stack development, community impact, mentorship, and collaboration.


## Highlights

- Animated hero section with custom typography and gradient branding
- Smooth scroll navigation (`About`, `Skills`, `Education`, `Connect`)
- Interactive UI details: custom cursor, reveal-on-scroll animations, floating blobs, marquee strip
- Skills and focus cards for frontend, backend, and community leadership
- Education timeline cards with clear academic progression
- Contact form powered by Formspree with direct LinkedIn CTA
- Social links for X, LinkedIn, Instagram, GitHub, and YouTube

## Tech Stack

<p align="left">
  <img src="https://cdn.simpleicons.org/html5/E34F26" alt="HTML5" width="28" height="28"/>
  <img src="https://cdn.simpleicons.org/css/1572B6" alt="CSS3" width="28" height="28"/>
  <img src="https://cdn.simpleicons.org/javascript/F7DF1E" alt="JavaScript" width="28" height="28"/>
  <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" alt="Tailwind CSS" width="28" height="28"/>
  <img src="https://cdn.simpleicons.org/formspree/E5122E" alt="Formspree" width="28" height="28"/>
  <img src="https://cdn.simpleicons.org/github/181717" alt="GitHub" width="28" height="28"/>
</p>

- `index.html` (single-page app layout and behavior)
- `assets/tailwind.js` (Tailwind runtime configuration usage)
- `assets/lucide.js` + `data-lucide` icons (icon rendering)
- Local assets for fonts, favicon set, and hero image

## Project Structure

```text
.
|-- index.html
|-- assets/
|   |-- hero-image.jpg
|   |-- lucide.js
|   |-- tailwind.js
|   |-- favicon/
|   `-- fonts/
|-- README.md
`-- LICENSE
```

## Run Locally

No build step is required.

1. Clone the repo:

```bash
git clone https://github.com/goyaljiiiiii/portdoli.git
cd portdoli
```

2. Open directly:

```bash
xdg-open index.html
```

3. Or serve with a local HTTP server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Customization Guide

- Update personal intro, bio, and sections in `index.html`
- Replace hero image at `assets/hero-image.jpg`
- Edit color theme in the Tailwind config block inside `index.html`
- Update Formspree endpoint in the `form` action attribute
- Update social URLs in the footer anchor tags

## Contact

<p align="left">
  <a href="https://github.com/goyaljiiiiii" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/GitHub-goyaljiiiiii-181717?style=flat-square&logo=github" alt="GitHub"/>
  </a>
  <a href="https://www.linkedin.com/in/goyaljiiiiii" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/LinkedIn-goyaljiiiiii-0A66C2?style=flat-square&logo=linkedin" alt="LinkedIn"/>
  </a>
  <a href="https://x.com/goyaljiiiiii" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/X-@goyaljiiiiii-000000?style=flat-square&logo=x" alt="X"/>
  </a>
  <a href="https://www.instagram.com/goyal.jiiiiii" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Instagram-@goyal.jiiiiii-E4405F?style=flat-square&logo=instagram&logoColor=white" alt="Instagram"/>
  </a>
  <a href="https://www.youtube.com/@goyaljiiiiii" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/YouTube-@goyaljiiiiii-FF0000?style=flat-square&logo=youtube&logoColor=white" alt="YouTube"/>
  </a>
</p>

## License

This project is licensed under the MIT License. See `LICENSE` for details.
