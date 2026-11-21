/**
 * ────────────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH FOR ALL SITE CONTENT
 * ────────────────────────────────────────────────────────────────────────────
 *  Positioning: cybersecurity is the core, AI is the specialty, and web /
 *  cloud / networking are supporting skills. Everything Stanley might want to
 *  edit lives here — components only read from this file.
 *
 *  Projects: `featured` = security & AI work (shown first, pinned gallery).
 *            `supporting` = web builds (proof of shipping, compact grid).
 *  A project with `draft: true` is kept here but NOT rendered — fill in its
 *  summary / links, then delete the flag to publish it.
 * ────────────────────────────────────────────────────────────────────────────
 */

import type { LucideIcon } from 'lucide-react'
import {
  ShieldCheck,
  BrainCircuit,
  Network,
  Radar,
  ShieldAlert,
  HeartPulse,
  Fish,
  Globe,
  Car,
  Wrench,
  Swords,
  Plane,
} from 'lucide-react'

import evexiaShot from '@/assets/projects/evexia.jpg'
import ridonShot from '@/assets/projects/ridon.jpg'
import therionShot from '@/assets/projects/therion.jpg'

/* ── Site ──────────────────────────────────────────────────────────────── */

/** Public URL of the deployed site. Swap for the custom domain once it is
 *  connected (also update index.html, public/sitemap.xml, public/robots.txt). */
export const siteUrl = 'https://portifolio-theta-wheat-80.vercel.app'

/** CV served from /public. Regenerate with `npm run cv` after editing cv/cv.html. */
export const cvUrl = '/Stanley-Ansong-CV.pdf'

/* ── Profile ───────────────────────────────────────────────────────────── */

export const profile = {
  name: 'Stanley Ansong',
  firstName: 'Stanley',
  tagline: 'Cybersecurity · AI · IT Student @ KNUST',
  role: 'Cybersecurity & AI',
  headline: 'Securing systems, and building AI that holds up under pressure.',
  heroIntro:
    'Cybersecurity-focused IT student at KNUST. I build defensive security tools and apply AI where reliability matters.',
  bio: "I'm an IT student at KNUST focused on cybersecurity, with AI as my specialty. I build and test defensive tooling — packet sniffers, intrusion detection rules, security-awareness training — and apply AI to problems where reliability matters, like astronaut health monitoring. Web, cloud and networking are the supporting skills I use to ship it.",
  location: 'Kumasi, Ghana',
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
  linkedin: 'https://www.linkedin.com/in/stanley-ansong-32a9a3398/',
  github: 'https://github.com/Ko-dron',
  whatsapp: '233257457533',
  whatsappDisplay: '+233 25 745 7533',
  phone: '+233 25 745 7533',
  phonePublic: false,
} as const

export const whatsappUrl = `https://wa.me/${socials.whatsapp}?text=${encodeURIComponent(
  "Hi Stanley — I found your portfolio and I'd like to get in touch.",
)}`

/* ── Navigation ────────────────────────────────────────────────────────── */

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
] as const

/* ── Skills (ordered by priority: core → specialty → supporting) ───────── */

export interface SkillGroup {
  title: string
  label: string
  icon: LucideIcon
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Security',
    label: 'Core',
    icon: ShieldCheck,
    skills: [
      'Network security & packet analysis',
      'Intrusion detection (Suricata rules)',
      'Cyber risk management',
      'Phishing & social-engineering defense',
      'Fraud prevention',
      'Linux & SQL for security work',
    ],
  },
  {
    title: 'AI',
    label: 'Specialty',
    icon: BrainCircuit,
    skills: [
      'Prompt engineering',
      'AI-assisted development',
      'Applied AI for health monitoring',
      'LLM tooling (Claude)',
    ],
  },
  {
    title: 'Web · Cloud · Networking',
    label: 'Supporting',
    icon: Network,
    skills: [
      'React & TypeScript',
      'Python',
      'REST APIs',
      'Cloud deployment (Vercel)',
      'TCP/IP & networking fundamentals',
    ],
  },
]

export const topSkills = ['Network Security', 'Intrusion Detection', 'Prompt Engineering'] as const

/* ── Projects ──────────────────────────────────────────────────────────── */

const GH_USER = 'Ko-dron'
const repoUrl = (repo: string) => `https://github.com/${GH_USER}/${repo}`

export interface Project {
  title: string
  category: string
  icon: LucideIcon
  summary: string
  stack: string[]
  role?: string
  liveUrl?: string
  repoUrl?: string
  image?: string
  /** Terminal-style preview for CLI tools that have no UI to screenshot. */
  terminal?: string[]
  /** Hidden until the details are filled in. */
  draft?: boolean
}

/** Security & AI — shown first. */
export const featuredProjects: Project[] = [
  {
    title: 'Evexia',
    category: 'AI · NASA Space Apps 2026',
    icon: HeartPulse,
    summary:
      'A crew health console for astronauts, built at NASA Space Apps 2026 (Kumasi). Seven vital readings roll into one health score judged against spaceflight-adjusted ranges, with a 3D body map, mission-history charts, live wearable telemetry, offline self-care guidance, an "Earth link" that holds reports through comms blackouts, and a flight-surgeon view of the whole crew.',
    stack: ['React', 'Vite', 'Recharts', 'PWA / offline'],
    liveUrl: 'https://evexia-nasa-space-app-2026.vercel.app/',
    image: evexiaShot,
  },
  {
    title: 'Network Intrusion Detection System',
    category: 'Security · CodeAlpha Internship',
    icon: ShieldAlert,
    summary:
      'A custom Suricata NIDS with six detection rules covering port scans, ping sweeps, SSH brute force, HTTP scanners, suspicious DNS and oversized ICMP packets, each written and tuned by hand.',
    stack: ['Suricata', 'Linux', 'Network Security'],
    role: 'Solo — CodeAlpha Cybersecurity Internship',
    repoUrl: repoUrl('CodeAlpha_NetworkIDS'),
    terminal: [
      '$ suricata -T -S local.rules   # 6 custom rules',
      '  ✓ port-scan          ✓ ping-sweep',
      '  ✓ ssh-brute-force    ✓ http-scanner',
      '  ✓ suspicious-dns     ✓ large-icmp',
    ],
  },
  {
    title: 'Basic Network Sniffer',
    category: 'Security · CodeAlpha Internship',
    icon: Radar,
    summary:
      'A Python packet sniffer that captures live traffic, identifies TCP/UDP/ICMP/DNS and QUIC, decodes DNS lookups, tracks top talkers and prints a summary report on exit — a hands-on walk through the TCP/IP stack.',
    stack: ['Python', 'Scapy', 'Kali Linux'],
    role: 'Solo — CodeAlpha Cybersecurity Internship',
    repoUrl: repoUrl('CodeAlpha_BasicNetworkSniffer'),
    terminal: [
      '$ sudo python3 sniffer.py',
      '[TCP]  10.0.2.15:52560 → 108.139.200.120:443  S',
      '[TCP]  108.139.200.120:443 → 10.0.2.15:52560  SA',
      '[DNS]  10.0.2.15 → 192.168.100.1  ep2.adtrafficquality.google',
      '[QUIC] 10.0.2.15:34504 → 142.251.216.34:443  74B',
    ],
  },
  {
    title: 'Phishing Awareness Training',
    category: 'Security · CodeAlpha Internship',
    icon: Fish,
    summary:
      'A 12-slide training module for non-technical audiences covering phishing attack types, how to spot red flags, real-world examples and practical defense habits.',
    stack: ['Security Awareness', 'Social Engineering', 'Training Design'],
    role: 'Solo — CodeAlpha Cybersecurity Internship',
    repoUrl: repoUrl('CodeAlpha_PhishingAwareness'),
  },
  {
    // TODO: add the live / GitHub links, real stack and a screenshot when available.
    title: 'GlobalPath',
    category: 'AI · Claude Hackathon 2026',
    icon: Plane,
    summary:
      'An AI-powered platform that guides international students and immigrants through every stage of studying or working abroad. It tackles fragmented information, scams and post-admission challenges with trusted support for applications, housing, banking, careers and community integration.',
    stack: ['Claude', 'AI guidance'],
    role: 'Team project — Claude Hackathon, 30 May 2026',
  },
  {
    // TODO: add summary, stack, role, links and a screenshot, then remove `draft`.
    title: 'CyberForge',
    category: 'Security',
    icon: Swords,
    summary: '',
    stack: [],
    draft: true,
  },
]

/** Web builds — supporting proof of shipping. */
export const supportingProjects: Project[] = [
  {
    title: 'Ridon',
    category: 'Web · Mobility app',
    icon: Car,
    summary:
      'An AI-assisted ride-hailing and delivery web app: fare bidding, a women’s safety mode and multi-modal transport.',
    stack: ['Next.js', 'TypeScript', 'React'],
    liveUrl: 'https://ridon-frontend.vercel.app',
    repoUrl: repoUrl('ridon-frontend'),
    image: ridonShot,
  },
  {
    title: 'Therion Garage',
    category: 'Web · 3D experience',
    icon: Wrench,
    summary: 'A private underground garage in the browser — an interactive 3D car showcase where every car makes an entrance.',
    stack: ['React', 'Three.js', 'GSAP'],
    liveUrl: 'https://therion-alpha.vercel.app',
    repoUrl: repoUrl('therion'),
    image: therionShot,
  },
  // TODO: fill these in (summary, stack, links, screenshot) and remove `draft`.
  { title: 'Evenos', category: 'Web', icon: Globe, summary: '', stack: [], draft: true },
  { title: 'Furnik', category: 'Web', icon: Globe, summary: '', stack: [], draft: true },
  { title: 'Filcon', category: 'Web', icon: Globe, summary: '', stack: [], draft: true },
  { title: 'Filtrax', category: 'Web', icon: Globe, summary: '', stack: [], draft: true },
]

export const publishedFeatured = featuredProjects.filter((p) => !p.draft)
export const publishedSupporting = supportingProjects.filter((p) => !p.draft)

/* ── Experience ────────────────────────────────────────────────────────── */

export interface ExperienceItem {
  role: string
  org: string
  period: string
  kind: 'Internship' | 'Leadership' | 'Hackathon' | 'Volunteering'
  points: string[]
}

export const experience: ExperienceItem[] = [
  {
    role: 'Cybersecurity Intern',
    org: 'CodeAlpha · Remote',
    period: '2026', // TODO: exact start – end months
    kind: 'Internship',
    points: [
      'Built a Python packet sniffer that decodes TCP/UDP/ICMP, DNS and QUIC traffic.',
      'Wrote six custom Suricata rules detecting scans, brute force and suspicious DNS/ICMP.',
      'Designed a phishing-awareness training module for non-technical users.',
    ],
  },
  {
    role: 'Head of Audit Committee',
    org: 'Computer Science Society (CSS), KNUST',
    period: 'Oct 2026 – Present',
    kind: 'Leadership',
    points: [
      'Lead the committee that reviews the society’s finances and records.',
      'Coordinate the audit team and turn the data into clear reports for the executive.',
    ],
  },
  {
    role: 'Participant — Evexia',
    org: 'NASA Space Apps Challenge 2026 · Kumasi',
    period: '2026',
    kind: 'Hackathon',
    points: ['Built Evexia, an astronaut crew-health console, with a team over the challenge weekend.'],
  },
  {
    role: 'Team Project — GlobalPath',
    org: 'Claude Hackathon',
    period: '30 May 2026',
    kind: 'Hackathon',
    points: [
      'Collaborated with a team to build GlobalPath, an AI-powered platform that guides international students and immigrants through every stage of studying or working abroad.',
      'Addressed fragmented information, scams and post-admission challenges with trusted support for applications, housing, banking, careers and community integration.',
    ],
  },
  // TODO: add volunteering — e.g.
  // { role: 'Volunteer', org: '…', period: '…', kind: 'Volunteering', points: ['…'] },
]

/* ── Certifications ────────────────────────────────────────────────────── */

export interface Certification {
  title: string
  issuer: string
  date: string
}

export const certificationGroups: { title: string; items: Certification[] }[] = [
  {
    title: 'Google Cybersecurity Professional Certificate (in progress)',
    items: [
      { title: 'Foundations of Cybersecurity', issuer: 'Google · Coursera', date: 'Jul 2026' },
      { title: 'Play It Safe: Manage Security Risks', issuer: 'Google · Coursera', date: 'Jul 2026' },
      {
        title: 'Connect and Protect: Networks and Network Security',
        issuer: 'Google · Coursera',
        date: 'Jul 2026',
      },
      { title: 'Tools of the Trade: Linux and SQL', issuer: 'Google · Coursera', date: 'Aug 2026' },
      { title: 'Assets, Threats, and Vulnerabilities', issuer: 'Google · Coursera', date: 'Oct 2026' },
    ],
  },
  {
    title: 'Other',
    items: [
      {
        title: 'Certified Online Fraud Prevention Specialist (COFPS)',
        issuer: 'Hack & Fix',
        date: 'Aug 2026',
      },
      { title: 'Claude 101', issuer: 'Anthropic', date: 'May 2026' },
    ],
  },
]

/* ── Section copy ──────────────────────────────────────────────────────── */

export const sections = {
  about: {
    title: 'About',
    lead: 'Security first. AI where it counts. Web and cloud to ship it.',
  },
  skills: {
    title: 'Skills',
    lead: 'Security is the core, AI is the specialty, and the rest is how it ships.',
  },
  projects: {
    title: 'Work',
    lead: 'Security and AI projects first — from packet capture to astronaut health.',
  },
  supporting: {
    title: 'Also shipped',
    lead: 'Web builds that show I can take a product all the way to production.',
  },
  experience: {
    title: 'Experience',
    lead: 'Internship, leadership and hands-on events.',
  },
  certifications: {
    title: 'Certifications',
    lead: 'Credentials behind the security and AI work.',
  },
  contact: {
    title: 'Contact',
    lead: 'Looking for a security or AI intern? Let’s talk.',
    closing: 'I’m open to cybersecurity and AI internships, research collaborations and CTF teams.',
  },
} as const

export const meta = {
  builtWith: 'Kodron Builds',
  year: new Date().getFullYear(),
} as const
