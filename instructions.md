# Coding Agent Prompt — Stanley Ansong's Immersive Portfolio

> Paste this whole document into your coding agent as the task brief. It is a complete specification: role, design direction, tech stack, features, content, structure, quality bar, deployment, and a required README.

---

## 1. Role & Objective

You are a senior front-end / creative developer. Build a **production-ready, single-page personal portfolio website** for **Stanley Ansong**.

The site must feel **immersive but calm**: a real 3D hero, buttery-smooth momentum scrolling, refined scroll-driven motion, and polished micro-interactions — all in service of a **sleek, minimal, elegant dark theme** with generous whitespace and confident typography.

**Golden rule:** *impressive* must never mean *cluttered*. Every animation is intentional, smooth, and restrained. When in doubt, do less, but do it beautifully.

**Positioning:** present Stanley as a versatile **all-rounder** — a full-stack developer with genuine depth in **cybersecurity** and **AI**. Weight these three areas evenly across content, copy, and emphasis. Don't let any one area dominate.

**Done means:** the project runs locally with `npm run dev` and **zero console errors/warnings**, `npm run build` succeeds, and you have written a thorough `README.md` (see §11).

---

## 2. Design Direction — Sleek & Minimal (Dark)

**Mood:** modern, editorial, premium. Think of the restraint of Linear / Vercel / Apple product pages, with a creative-developer edge.

**Color system (dark):**
- Background: a layered near-black neutral (e.g. `#0A0A0B` base with slightly lighter surfaces like `#111114` for depth) — **not** pure black.
- Text: high-contrast off-white for headings (e.g. `#F5F5F7`), muted gray for body/secondary (e.g. `#A1A1AA`).
- **One** restrained accent color, used sparingly for links, hover, focus, and small highlights. You choose it (a cool electric blue, soft violet, or warm amber all work). Keep the palette mostly monochrome with the accent as punctuation.
- Use soft radial gradients and a subtle film-grain / noise overlay for atmosphere.

**Typography:**
- A refined display typeface for headings (e.g. **Space Grotesk**, **Clash Display**, or **General Sans**) paired with a clean sans for body (**Inter**). Load via `@fontsource` or Google Fonts.
- Large, confident headline sizes with tight leading; comfortable body sizing with generous line-height.

**Layout & motion:**
- Generous whitespace, strong vertical rhythm, a wide but breathing max-width container.
- Editorial touches: large numeric section indices (01, 02, 03…), oversized section headings.
- Easing: smooth and natural (expo/cubic-bezier); avoid bouncy overshoot except very subtly. Reveal durations ~0.4–0.8s with gentle stagger.

---

## 3. Tech Stack (use these)

- **Build/framework:** Vite + **React 18** + **TypeScript**.
- **Styling:** Tailwind CSS with a small custom theme (color tokens, fonts, spacing).
- **3D:** `three`, `@react-three/fiber`, `@react-three/drei`, optionally `@react-three/postprocessing` for subtle bloom.
  - ⚠️ **Version pin:** use `@react-three/fiber` **v8.x** (and drei/postprocessing versions compatible with it). R3F **v9 requires React 19**, which would break the React 18 requirement.
- **UI motion:** `framer-motion` (Motion for React) for micro-interactions, viewport reveals, and scroll-linked transforms.
- **Smooth scroll:** `lenis` (the current Darkroom package; use its React binding `ReactLenis` from `lenis/react` if convenient).
- **Advanced scroll choreography:** `gsap` + `ScrollTrigger` for the pinned/horizontal Projects showcase.
  - **Sync Lenis with ScrollTrigger** (drive `ScrollTrigger.update` from Lenis's scroll event and integrate with the gsap ticker) so pinned/scrubbed animations stay perfectly in sync with the smooth scroll.
- **Icons:** `lucide-react`.

Install current stable versions except where pinned above. Comment any non-obvious setup.

---

## 4. The 3D Hero Centerpiece (my pick — build this)

A single, slowly-rotating **abstract form** at the hero center that fits the minimal aesthetic:

- A high-detail sphere/icosahedron with a **custom distortion** (animated vertex noise) and a **premium material** — frosted glass / brushed metal / faint iridescence. Keep it mostly monochrome with only a whisper of color shift so it reads as elegant, not flashy. (`MeshDistortMaterial` or `MeshTransmissionMaterial` from drei are good starting points.)
- Lit with soft studio/environment lighting (drei `Environment`), understated **bloom** via postprocessing.
- **Cursor-reactive:** subtle parallax rotation toward the pointer.
- **Scroll-linked:** the form gently rotates / scales / drifts as the user scrolls, tying the hero into the page narrative.
- A very faint field of background **points/particles** (low count, slow drift) for depth.

**Alternatives** you may substitute if better-suited to the minimal direction: a morphing point-cloud that forms and drifts, or a refined wobbling distort-sphere. Whatever you choose, keep it **calm, smooth, and restrained**.

Wrap the canvas in `React.Suspense`, lazy-load it, cap `dpr={[1, 2]}`, and pause when the tab is hidden / the hero is offscreen.

---

## 5. Signature Interactions

- **Intro loader:** a minimal loading screen (subtle progress or the name/logo) that elegantly reveals the site once the 3D scene is ready.
- **Custom cursor:** a small circle following the pointer with slight lag; grows/changes state over interactive elements. Fall back to the default cursor on touch devices.
- **Magnetic buttons/links:** interactive elements subtly attract toward the cursor on hover.
- **Scroll reveals:** headings, paragraphs, and cards fade + translate up as they enter the viewport, with gentle stagger (`whileInView`).
- **Parallax:** layered depth on hero and section elements tied to scroll.
- **Signature scroll moment (the "mind-bending" bit):** render the **Projects** section as a **pinned, horizontally-scrolling gallery** — the section pins while project cards move horizontally as the user scrolls vertically (GSAP ScrollTrigger, synced with Lenis). Provide a clean **mobile fallback** (vertical stack). Keep it smooth and readable, never disorienting.
- **Project card hovers:** subtle lift, image scale, tag reveal.
- **Smooth momentum scrolling** across the whole page via Lenis.

---

## 6. Sections & Structure (in order)

1. **Hero** — name, a strong one-line positioning statement, the 3D centerpiece, a subtle scroll cue, quick social links.
2. **About** — Stanley's story + what he does. Include his education (KNUST). Portrait placeholder (clearly marked).
3. **Skills / Expertise** — grouped and animated (see §7 for groups).
4. **Projects** — the 6 GitHub repos as cards, grouped by category, with description, tech tags, and GitHub links. This is the pinned/horizontal showcase.
5. **Certifications** — the 5 certs as a clean list/grid.
6. **Contact** — email + LinkedIn + GitHub, a friendly closing line, and a simple contact affordance (a `mailto:` CTA, or an optional form via Formspree/Web3Forms — no backend).
7. **Footer** — name, social links, "built with React + Three.js", year.

A minimal fixed/scroll-aware **navbar** with anchor links to each section, and a **skip-to-content** link.

---

## 7. Content (use this — put it all in `src/data/content.ts`)

Centralize **all** text, links, projects, skills, and certs in a single typed `src/data/content.ts` so Stanley can edit everything in one place without touching components.

**Profile**
- Name: **Stanley Ansong**
- Role/tagline (adapt phrasing): *Full-Stack Developer · Cybersecurity & AI · IT Student @ KNUST*
- Suggested hero headline (pick/refine one): "Building practical, real-world tech — across the full stack, security, and AI." or "I build across the stack — from interfaces to networks to AI."
- Bio (use/adapt): "I'm an Information Technology student with a strong interest in building practical, real-world tech solutions. My academic journey and personal projects have built hands-on skills across web development, networking, cloud computing, cybersecurity, AI engineering, and graphic design."
- Location: Ghana (Accra / Kumasi)
- Education: **BSc Information Technology**, Kwame Nkrumah University of Science and Technology (KNUST), Kumasi · Jan 2026 – Sep 2029

**Socials / Contact**
- Email: `ansongsrx@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/stanleyansong-32a9a3398`
- GitHub: `https://github.com/Ko-dron`
- Phone (optional — include only if Stanley wants it public): `+233 25 745 7533`

**Skill groups** (present as animated groups/cards)
- **Frontend & Full-Stack:** React, TypeScript, JavaScript, HTML/CSS, responsive UI
- **Backend:** Python, REST APIs, server-side architecture
- **Cybersecurity:** network security, cyber risk management, packet analysis, phishing / social-engineering awareness
- **AI:** prompt engineering, AI-assisted development
- **Networking & Cloud:** networking fundamentals, cloud computing
- **Design:** graphic design, UI aesthetics
- Highlight these **top skills** somewhere: Prompt Engineering, Cyber Risk Management, Network Security.

**Projects** (build each repo URL as `https://github.com/Ko-dron/<repo>`; use marked placeholder preview images)

*E-Commerce & Full-Stack*
- **onlinestore** — E-commerce storefront, built primarily in TypeScript. Tags: TypeScript, React, E-Commerce.
- **Stanley-Store** — E-commerce project built in TypeScript. Tags: TypeScript, E-Commerce, Full-Stack.

*Media / Capture*
- **capture-frontend** — Client-side UI of a media/capture application, built in JavaScript. Tags: JavaScript, Frontend, UI.
- **capture-backend** — Companion server-side architecture for the capture app, written in Python. Tags: Python, Backend, API.

*Cybersecurity (CodeAlpha Internship)*
- **CodeAlpha_BasicNetworkSniffer** — Python-based network packet sniffer that monitors traffic data. Tags: Python, Networking, Security.
- **CodeAlpha_PhishingAwareness** — A 12-slide training module for non-technical users teaching social-engineering tactics and defense strategies, built in Python. Tags: Python, Security Awareness, Education.

**Certifications**
- Foundations of Cybersecurity
- Connect and Protect: Networks and Network Security
- Play It Safe: Manage Security Risks
- Hashgraph Developer (Hedera)
- Claude 101

---

## 8. Suggested File Structure

```
portfolio/
├─ public/
│  ├─ favicon.svg
│  └─ og-image.png            # placeholder, mark for replacement
├─ src/
│  ├─ assets/                 # images, textures, grain
│  ├─ components/
│  │  ├─ layout/              # Navbar, Footer, Cursor, Loader, ScrollProvider (Lenis)
│  │  ├─ three/               # Scene, HeroObject, Particles, Lighting, Effects
│  │  ├─ sections/            # Hero, About, Skills, Projects, Certifications, Contact
│  │  └─ ui/                  # MagneticButton, Card, Tag, SectionHeading, RevealText
│  ├─ data/
│  │  └─ content.ts           # ALL editable content (profile, skills, projects, certs, socials)
│  ├─ hooks/                  # useMagnetic, useMousePosition, useReducedMotion, ...
│  ├─ lib/                    # gsap + lenis setup, helpers
│  ├─ styles/                 # globals.css, tailwind layers
│  ├─ App.tsx
│  └─ main.tsx
├─ index.html
├─ tailwind.config.ts
├─ vite.config.ts
├─ tsconfig.json
├─ package.json
└─ README.md
```

---

## 9. Accessibility, Performance & Quality Bar

**Accessibility**
- Semantic HTML5 landmarks (`header`/`nav`/`main`/`section`/`footer`) and correct heading hierarchy.
- Descriptive `alt` text on images; decorative elements `aria-hidden`.
- Fully keyboard navigable, visible focus states, logical tab order, skip-to-content link.
- WCAG AA color contrast, even in dark theme.
- **Respect `prefers-reduced-motion`:** disable/greatly reduce animations, 3D auto-rotation, and scroll-scrubbing; content must remain fully visible and usable without motion.

**Performance**
- Lazy-load the 3D canvas via `React.Suspense`; code-split heavy pieces.
- Cap `devicePixelRatio` (`[1, 2]`), keep particle counts low, use instancing, dispose geometries/materials, pause rendering when offscreen or the tab is hidden.
- Graceful degradation on low-power/mobile: reduce 3D complexity or swap for a lighter hero if performance suffers.
- No console errors or warnings. Keep the bundle lean.

**SEO & meta**
- Descriptive `<title>`, meta description, Open Graph + Twitter card tags, favicon, `lang` attribute, canonical link.

**Responsive**
- Fluid across mobile / tablet / desktop; verify common breakpoints; ensure the pinned/horizontal Projects section has a working mobile fallback.

---

## 10. Deployment

- Configure for **zero-config deploy to Vercel or Netlify** (static SPA).
- **GitHub Pages support:** if deploying to a project page (`username.github.io/<repo>`), set `base: '/<repo>/'` in `vite.config.ts`, add a `gh-pages` deploy script, and document it. Note the SPA fallback (`404.html`) if needed — a single-page scroll site is usually fine.
- Ensure `npm run build` and `npm run preview` work.

---

## 11. README.md (required — write a thorough one)

Create a clear, well-formatted `README.md` that explains everything you built:

- **Title + one-line description** (+ live demo / screenshot placeholder).
- **Overview** — what the site is and who it's for.
- **Features** — bulleted: 3D hero, smooth momentum scroll, pinned/horizontal Projects gallery, micro-interactions, custom cursor, dark minimal theme, responsive, accessible, reduced-motion support, SEO.
- **Tech stack** — each library and what it's used for.
- **Project structure** — annotated folder tree.
- **Getting started** — prerequisites (Node version), `npm install`, `npm run dev`, `npm run build`, `npm run preview`.
- **Customizing content** — explain that all content lives in `src/data/content.ts` and how to edit profile / projects / skills / certs / socials; where to change colors & fonts (Tailwind config / CSS variables); how to swap the 3D hero object.
- **Deployment** — step-by-step for Vercel, Netlify, and GitHub Pages (with the base-path note).
- **Accessibility & performance notes.**
- **Credits** (libraries) and **license** (e.g. MIT).

---

## 12. Build Process & Definition of Done

1. Scaffold Vite + React 18 + TypeScript; add Tailwind; set up dark theme tokens and fonts.
2. Set up the Lenis smooth-scroll provider and GSAP/ScrollTrigger integration (synced).
3. Build the layout shell: loader, navbar, footer, custom cursor.
4. Build the 3D hero scene (Suspense-wrapped, reduced-motion aware, performance-capped).
5. Build sections in order (Hero → About → Skills → Projects → Certifications → Contact), wiring all content from `src/data/content.ts`.
6. Add scroll reveals, parallax, magnetic buttons, and the signature pinned/horizontal Projects showcase.
7. Add SEO meta, favicon, OG placeholder.
8. Pass accessibility + reduced-motion checks; verify responsive across breakpoints; confirm no console errors.
9. Write the `README.md`.
10. Confirm `npm run dev` runs cleanly and `npm run build` succeeds.

**Deliverables:** the full working project **and** a complete `README.md`. Use clearly-marked placeholder images wherever real assets (project screenshots, portrait, OG image) are missing so Stanley can drop in his own. Decisions left to you: the exact accent color, the precise display font, and the specific form/material of the 3D hero — choose tasteful options consistent with the sleek-minimal direction, and comment any non-obvious code.
