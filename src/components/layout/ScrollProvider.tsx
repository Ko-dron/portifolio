import { createContext, useContext, useLayoutEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ScrollAPI {
  /** Smooth-scroll to an element (by selector) or a numeric offset. */
  scrollTo: (target: string | number, opts?: { offset?: number }) => void
  /** Pause / resume Lenis (used by the intro loader). */
  stop: () => void
  start: () => void
}

const ScrollContext = createContext<ScrollAPI | null>(null)

export function useSmoothScroll(): ScrollAPI {
  const ctx = useContext(ScrollContext)
  if (!ctx) {
    // Safe no-op fallback so consumers never crash if used outside the provider.
    return { scrollTo: () => {}, stop: () => {}, start: () => {} }
  }
  return ctx
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const reduced = useReducedMotion()

  // useLayoutEffect so ScrollTrigger's pinned sections measure against the
  // smooth-scroll transform from the very first paint.
  useLayoutEffect(() => {
    // Under reduced-motion we skip Lenis entirely and let the browser scroll
    // natively — no momentum, no scroll hijacking.
    if (reduced) {
      ScrollTrigger.defaults({ scroller: undefined })
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })
    lenisRef.current = lenis

    // ── Sync Lenis with GSAP ScrollTrigger ──────────────────────────────
    // 1) Drive ScrollTrigger.update from every Lenis scroll event.
    lenis.on('scroll', ScrollTrigger.update)
    // 2) Drive Lenis's RAF from GSAP's ticker so both share one clock
    //    (prevents jitter between pinned/scrubbed animations and smooth scroll).
    const onTick = (time: number) => lenis.raf(time * 1000) // gsap ticker is in seconds
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', ScrollTrigger.update)
      gsap.ticker.remove(onTick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  const api: ScrollAPI = {
    scrollTo: (target, opts) => {
      const offset = opts?.offset ?? 0
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset, duration: 1.2 })
      } else if (typeof target === 'string') {
        // Reduced-motion / native path.
        const el = document.querySelector(target)
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY + offset
          window.scrollTo({ top, behavior: 'auto' })
        }
      } else {
        window.scrollTo({ top: target + offset })
      }
    },
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
  }

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>
}
