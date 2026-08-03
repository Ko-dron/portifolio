# Stanley Ansong — Immersive Portfolio

> A production-ready, single-page personal portfolio for **Stanley Ansong** — full-stack developer with genuine depth in **cybersecurity** and **AI**. Immersive but calm: a real 3D hero, buttery momentum scrolling, and a pinned horizontal Projects showcase, all in a sleek, minimal dark theme.

<!-- LIVE DEMO: add your deployed URL here once published, e.g. https://stanleyansong.dev -->
<!-- SCREENSHOT: drop a screenshot into src/assets/ and embed it here, e.g. ![Portfolio](src/assets/screenshot.png) -->

---

## Overview

This is a personal portfolio website that positions Stanley as a versatile **all-rounder** — weighting full-stack development, cybersecurity, and AI evenly across the content. It's a single scrolling page with an editorial, premium feel inspired by the restraint of Linear / Vercel / Apple product pages, with a creative-developer edge.

The site is built to impress **without** clutter: every animation is intentional, smooth, and restrained.

---

## Features

- **Real 3D hero** — a stylised **isometric coding desk** (orthographic projection): monitor + laptop with accent-red glowing screens, a desk lamp casting a warm pool, keyboard, mug, books, plant, and chair. Self-contained studio lighting (no external HDR fetch), a faint particle field, and understated bloom on the emissive screens. Cursor-reactive (parallax tilt) and scroll-linked (drifts + scales as you scroll).
- **Smooth momentum scrolling** — the whole page uses [Lenis](https://github.com/darkroomengineering/lenis), synced with GSAP ScrollTrigger.
- **Signature scroll moment** — the **Projects** section **pins** while project cards scroll **horizontally**, driven by vertical scroll (GSAP ScrollTrigger). Clean vertical-stack fallback on mobile / reduced-motion.
- **Custom cursor** — a dot that tracks 1:1 plus a ring that trails with lag and grows over interactive elements. Falls back to the native cursor on touch.
- **Magnetic buttons** — interactive elements subtly attract toward the cursor on hover.
- **Scroll reveals & parallax** — headings, paragraphs, and cards fade + translate up on entry with gentle stagger (Framer Motion `whileInView`).
- **Intro loader** — a minimal loading screen that tracks the real 3D asset progress and elegantly reveals the site.
- **Dark, minimal theme** — layered near-blacks, high-contrast off-white headings, one restrained electric-blue accent, soft radial gradients, and a subtle film-grain overlay.
- **Responsive** — fluid across mobile / tablet / desktop.
- **Accessible** — semantic landmarks, heading hierarchy, keyboard navigable, visible focus states, skip-to-content link, WCAG-AA contrast.
- **Reduced-motion support** — respects `prefers-reduced-motion`: disables the loader, 3D auto-rotation, scroll-scrubbing, and reveals; content stays fully visible and usable.
- **Performance** — lazy-loaded 3D canvas, capped `devicePixelRatio`, low particle counts, render loop paused when offscreen or the tab is hidden, graceful degradation on low-power devices, code-split vendor chunks.
- **SEO & meta** — descriptive title, meta description, Open Graph + Twitter cards, favicon, `lang`, canonical link.

---

## Tech Stack

| Library | Version | Used for |
| --- | --- | --- |
| **Vite** | 5.x | Build tool / dev server |
| **React** | 18.3 | UI framework |
| **TypeScript** | 5.6 | Type safety |
| **Tailwind CSS** | 3.4 | Styling + custom dark theme tokens |
| **three** | 0.169 | 3D engine |
| **@react-three/fiber** | **8.x** | React renderer for three.js (⚠️ v8 pinned — v9 needs React 19) |
| **@react-three/drei** | 9.x | 3D helpers (`RoundedBox`, `Float`, `ContactShadows`, `Environment`, `Lightformer`, `useProgress`) |
| **@react-three/postprocessing** | 2.x | Bloom + vignette post effects |
| **framer-motion** | 11.x | Micro-interactions, viewport reveals |
| **lenis** | 1.x | Smooth momentum scrolling |
| **gsap** + ScrollTrigger | 3.x | Pinned/horizontal Projects choreography |
| **lucide-react** | latest | Icons |

> **Version pin note:** `@react-three/fiber` is intentionally kept on **v8**. R3F **v9 requires React 19**, which would break the React 18 requirement. `drei` v9 and `@react-three/postprocessing` v2 are the versions compatible with R3F v8.

---

## Project Structure

```
portfolio/
├─ public/
│  ├─ favicon.svg              # generated brand mark
│  └─ og-image.png             # placeholder social card (regenerate: scripts/generate-og.mjs)
├─ scripts/
│  └─ generate-og.mjs          # pure-Node generator for the OG placeholder
├─ src/
│  ├─ components/
│  │  ├─ layout/               # ScrollProvider (Lenis), Navbar, Footer, Cursor, Loader
│  │  ├─ three/                # HeroScene, IsoDesk, Particles, Lighting, Effects, HeroFallback
│  │  ├─ sections/             # Hero, About, Skills, Projects (+ ProjectCard), Certifications, Contact
│  │  └─ ui/                   # MagneticButton, Tag, SectionHeading, Reveal (+ RevealGroup/Item)
│  ├─ data/
│  │  └─ content.ts            # ← ALL editable content (profile, socials, skills, projects, certs)
│  ├─ hooks/                   # useMagnetic, useMousePosition, useReducedMotion, useMediaQuery, useActiveSection
│  ├─ lib/                     # gsap setup, utils (cn, clamp, lerp)
│  ├─ styles/
│  │  └─ globals.css           # Tailwind layers, grain, cursor, reduced-motion
│  ├─ App.tsx                  # composition + loader/scroll orchestration
│  └─ main.tsx                 # entry
├─ index.html                  # SEO meta, fonts
├─ tailwind.config.ts          # theme tokens (colors, fonts, spacing, animation)
├─ vite.config.ts              # alias, base path, manual chunks
└─ tsconfig*.json
```

---

## Getting Started

**Prerequisites:** Node.js **18+** (built and tested on Node 22) and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev

# 3. Type-check + production build → dist/
npm run build

# 4. Preview the production build locally
npm run preview
```

`npm run dev` runs cleanly with zero console errors, and `npm run build` succeeds.

---

## Customizing Content

**All editable content lives in [`src/data/content.ts`](src/data/content.ts)** — you can update the entire site there without touching a single component.

- **Profile** — name, tagline, hero headline, bio, location, education → the `profile` object.
- **Socials / contact** — email, LinkedIn, GitHub, phone → the `socials` object. Set `phonePublic: true` to show the phone number on the site.
- **Skills** — grouped skills and icons → `skillGroups`; the three highlighted strengths → `topSkills`.
- **Projects** — each card's title, repo, description, tags, category, icon → the `projects` array. Repo URLs are auto-built as `https://github.com/Ko-dron/<repo>`. To add a real preview screenshot, drop an image in `src/assets/` and set `image` on that project.
- **Certifications** — → the `certifications` array.
- **Navigation & section copy** — `navLinks` and the `sections` object.

**Colors & fonts:** edit the theme tokens in [`tailwind.config.ts`](tailwind.config.ts) — the `colors` block (change `accent.DEFAULT` to re-tint the whole site) and `fontFamily`. The theme is built around **`#df2531`** (accent red), **`#161616`** (base), and **`#faf9f7`** (heading); translucent accent variants are done with opacity utilities (`bg-accent/45`, `bg-accent/65`). The 3D scene has its own matching palette constant `C` at the top of [`IsoDesk.tsx`](src/components/three/IsoDesk.tsx). Fonts load via Google Fonts in [`index.html`](index.html); atmosphere (grain, radial gradients, cursor) lives in [`src/styles/globals.css`](src/styles/globals.css). The OG placeholder colours are in [`scripts/generate-og.mjs`](scripts/generate-og.mjs) — rerun `node scripts/generate-og.mjs` after changing them.

**Swapping / editing the 3D hero:** the isometric desk is composed in [`src/components/three/IsoDesk.tsx`](src/components/three/IsoDesk.tsx) — each object (`Monitor`, `Laptop`, `Keyboard`, `Lamp`, `Chair`, …) is its own small function you can tweak, move, or remove. The orthographic isometric camera and its responsive zoom live in [`HeroScene.tsx`](src/components/three/HeroScene.tsx). Lighting is in `Lighting.tsx`, particles in `Particles.tsx`, and post effects (bloom/vignette) in `Effects.tsx`.

**Portrait & OG image:** the About portrait is a marked placeholder in `About.tsx` — replace the placeholder block with an `<img>`. The social card `public/og-image.png` is a generated placeholder; regenerate with `node scripts/generate-og.mjs` or drop in your own 1200×630 image.

---

## Deployment

The site is a static SPA — it builds to `dist/` and deploys anywhere.

### Vercel (zero-config)
1. Push the repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Framework preset: **Vite**. Build command `npm run build`, output `dist`. Deploy.

### Netlify (zero-config)
1. Push to GitHub and "Add new site → Import an existing project".
2. Build command `npm run build`, publish directory `dist`. Deploy.

### GitHub Pages
1. In [`vite.config.ts`](vite.config.ts), set `base: '/<repo>/'` (e.g. `base: '/portfolio/'`) if deploying to a **project page** (`username.github.io/<repo>`). Leave `base: '/'` for a user/root domain.
2. Deploy with the included script (uses `gh-pages`):
   ```bash
   npm run deploy
   ```
   This runs `npm run build` and publishes `dist/` to the `gh-pages` branch.
3. In the repo settings, set Pages → Source → `gh-pages` branch.

> **SPA note:** this is a single-page scroll site using in-page anchors, so a `404.html` fallback is generally **not** required. If you later add client-side routes, copy `dist/index.html` to `dist/404.html` for GitHub Pages deep-link support.

---

## Accessibility & Performance Notes

**Accessibility**
- Semantic HTML5 landmarks (`header` / `nav` / `main` / `section` / `footer`) and a correct heading hierarchy.
- Fully keyboard navigable with a visible, on-brand focus ring and a skip-to-content link.
- Descriptive `alt` text on meaningful images; decorative/3D elements are `aria-hidden`.
- WCAG-AA color contrast maintained in the dark theme.
- **`prefers-reduced-motion`** is honored throughout: the intro loader is skipped, the 3D scene holds a static frame and then stops rendering, smooth scroll falls back to native, ScrollTrigger scrubbing is disabled, and reveals show content immediately.

**Performance**
- The entire 3D bundle is **lazy-loaded** (`React.lazy` + `Suspense`) so it never blocks first paint.
- `devicePixelRatio` capped at `[1, 2]` (`[1, 1.5]` on low-power devices).
- Low particle counts; the render loop **pauses** when the hero is offscreen or the browser tab is hidden.
- Low-power / mobile devices degrade gracefully (fewer particles, no postprocessing, lower DPR).
- Vendor code is split into cached chunks (`three`, `r3f`, `motion`).

---

## Credits

- 3D: [three.js](https://threejs.org), [React Three Fiber](https://github.com/pmndrs/react-three-fiber), [drei](https://github.com/pmndrs/drei), [postprocessing](https://github.com/pmndrs/postprocessing)
- Motion: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com), [Lenis](https://github.com/darkroomengineering/lenis)
- Icons: [Lucide](https://lucide.dev)
- Fonts: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), [Inter](https://fonts.google.com/specimen/Inter), [Space Mono](https://fonts.google.com/specimen/Space+Mono)

## License

MIT © Stanley Ansong
