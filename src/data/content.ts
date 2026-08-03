/**
 * ────────────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH FOR ALL SITE CONTENT
 * ────────────────────────────────────────────────────────────────────────────
 *  Everything Stanley might want to edit lives here — profile, socials, skills,
 *  projects, certifications, and section copy. Components read from this file,
 *  so nothing below the `content.ts` layer needs to be touched to update text.
 *
 *  To edit a project link, description, or tag: change the relevant object.
 *  To reorder cards: reorder the array.
 * ────────────────────────────────────────────────────────────────────────────
 */

import type { LucideIcon } from 'lucide-react'
import {
  Code2,
  Server,
  ShieldCheck,
  BrainCircuit,
  Network,
  Palette,
  ShoppingBag,
  Camera,
  Radar,
} from 'lucide-react'

/* ── Profile ───────────────────────────────────────────────────────────── */

export const profile = {
  name: 'Stanley Ansong',
  firstName: 'Stanley',
  tagline: 'Full-Stack Developer · Cybersecurity & AI · IT Student @ KNUST',
  // Hero headline — the one big statement.
  headline: 'Building practical, real-world tech — across the full stack, security, and AI.',
  // Short kicker shown above the headline.
  kicker: 'Full-Stack · Cybersecurity · AI',
  bio: "I'm an Information Technology student with a strong interest in building practical, real-world tech solutions. My academic journey and personal projects have built hands-on skills across web development, networking, cloud computing, cybersecurity, AI engineering, and graphic design.",
  location: 'Ghana · Accra / Kumasi',
  education: {
    degree: 'BSc Information Technology',
    school: 'Kwame Nkrumah University of Science and Technology (KNUST)',
    city: 'Kumasi, Ghana',
    period: 'Jan 2026 – Sep 2029',
  },
} as const

/* ── Socials / Contact ─────────────────────────────────────────────────── */

export const socials = {
  email: 'ansongsrx@gmail.com',
  linkedin: 'https://www.linkedin.com/in/stanleyansong-32a9a3398',
  github: 'https://github.com/Ko-dron',
  // Set `phonePublic` to true only if Stanley wants the number shown on the site.
  phone: '+233 25 745 7533',
  phonePublic: false,
} as const

/* ── Navigation ────────────────────────────────────────────────────────── */

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
] as const

/* ── Skills ────────────────────────────────────────────────────────────── */

export interface SkillGroup {
  title: string
  icon: LucideIcon
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend & Full-Stack',
    icon: Code2,
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML / CSS', 'Responsive UI'],
  },
  {
    title: 'Backend',
    icon: Server,
    skills: ['Python', 'REST APIs', 'Server-side Architecture'],
  },
  {
    title: 'Cybersecurity',
    icon: ShieldCheck,
    skills: [
      'Network Security',
      'Cyber Risk Management',
      'Packet Analysis',
      'Phishing / Social-Engineering Awareness',
    ],
  },
  {
    title: 'AI',
    icon: BrainCircuit,
    skills: ['Prompt Engineering', 'AI-Assisted Development'],
  },
  {
    title: 'Networking & Cloud',
    icon: Network,
    skills: ['Networking Fundamentals', 'Cloud Computing'],
  },
  {
    title: 'Design',
    icon: Palette,
    skills: ['Graphic Design', 'UI Aesthetics'],
  },
]

// Called out prominently as headline strengths.
export const topSkills = ['Prompt Engineering', 'Cyber Risk Management', 'Network Security'] as const

/* ── Projects ──────────────────────────────────────────────────────────── */

const GH_USER = 'Ko-dron'
const repoUrl = (repo: string) => `https://github.com/${GH_USER}/${repo}`

export interface Project {
  title: string
  repo: string
  url: string
  category: string
  icon: LucideIcon
  description: string
  tags: string[]
  // Preview image is an intentional placeholder — drop a real screenshot into
  // src/assets/ and point `image` at it (or leave undefined for the gradient).
  image?: string
}

export const projects: Project[] = [
  {
    title: 'onlinestore',
    repo: 'onlinestore',
    url: repoUrl('onlinestore'),
    category: 'E-Commerce & Full-Stack',
    icon: ShoppingBag,
    description:
      'An e-commerce storefront built primarily in TypeScript — product browsing, cart, and a clean, responsive shopping UI.',
    tags: ['TypeScript', 'React', 'E-Commerce'],
  },
  {
    title: 'Stanley-Store',
    repo: 'Stanley-Store',
    url: repoUrl('Stanley-Store'),
    category: 'E-Commerce & Full-Stack',
    icon: ShoppingBag,
    description:
      'A full-stack e-commerce project in TypeScript, exploring end-to-end store architecture from catalog to checkout flow.',
    tags: ['TypeScript', 'E-Commerce', 'Full-Stack'],
  },
  {
    title: 'capture-frontend',
    repo: 'capture-frontend',
    url: repoUrl('capture-frontend'),
    category: 'Media / Capture',
    icon: Camera,
    description:
      'The client-side UI of a media / capture application, built in JavaScript with a focus on a fast, intuitive interface.',
    tags: ['JavaScript', 'Frontend', 'UI'],
  },
  {
    title: 'capture-backend',
    repo: 'capture-backend',
    url: repoUrl('capture-backend'),
    category: 'Media / Capture',
    icon: Server,
    description:
      'The companion server-side architecture for the capture app, written in Python — APIs and data handling behind the UI.',
    tags: ['Python', 'Backend', 'API'],
  },
  {
    title: 'CodeAlpha_BasicNetworkSniffer',
    repo: 'CodeAlpha_BasicNetworkSniffer',
    url: repoUrl('CodeAlpha_BasicNetworkSniffer'),
    category: 'Cybersecurity · CodeAlpha Internship',
    icon: Radar,
    description:
      'A Python-based network packet sniffer that captures and monitors traffic data — hands-on packet analysis and inspection.',
    tags: ['Python', 'Networking', 'Security'],
  },
  {
    title: 'CodeAlpha_PhishingAwareness',
    repo: 'CodeAlpha_PhishingAwareness',
    url: repoUrl('CodeAlpha_PhishingAwareness'),
    category: 'Cybersecurity · CodeAlpha Internship',
    icon: ShieldCheck,
    description:
      'A 12-slide training module for non-technical users teaching social-engineering tactics and practical defense strategies, built in Python.',
    tags: ['Python', 'Security Awareness', 'Education'],
  },
]

/* ── Certifications ────────────────────────────────────────────────────── */

export interface Certification {
  title: string
  issuer: string
}

export const certifications: Certification[] = [
  { title: 'Foundations of Cybersecurity', issuer: 'Google · Coursera' },
  { title: 'Connect and Protect: Networks and Network Security', issuer: 'Google · Coursera' },
  { title: 'Play It Safe: Manage Security Risks', issuer: 'Google · Coursera' },
  { title: 'Hashgraph Developer', issuer: 'Hedera' },
  { title: 'Claude 101', issuer: 'Anthropic' },
]

/* ── Section copy ──────────────────────────────────────────────────────── */

export const sections = {
  about: {
    index: '01',
    title: 'About',
    lead: 'An all-rounder who builds — and secures — what he ships.',
  },
  skills: {
    index: '02',
    title: 'Expertise',
    lead: 'Depth across three fronts: full-stack, security, and AI.',
  },
  projects: {
    index: '03',
    title: 'Projects',
    lead: 'Selected work, from storefronts to packet sniffers.',
  },
  certifications: {
    index: '04',
    title: 'Certifications',
    lead: 'Credentials backing the security and AI foundations.',
  },
  contact: {
    index: '05',
    title: 'Contact',
    lead: "Have something to build, break, or secure? Let's talk.",
    closing: "I'm open to internships, collaborations, and interesting problems.",
  },
} as const

export const meta = {
  builtWith: 'Built with React + Three.js',
  year: new Date().getFullYear(),
} as const
