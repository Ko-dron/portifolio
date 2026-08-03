/**
 * Central GSAP setup. Registers ScrollTrigger once so any component can import
 * the same configured instances. Lenis ↔ ScrollTrigger syncing is wired in the
 * ScrollProvider (see components/layout/ScrollProvider.tsx).
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
