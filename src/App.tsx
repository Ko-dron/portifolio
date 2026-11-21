import { useEffect, useState } from 'react'
import { ScrollProvider, useSmoothScroll } from '@/components/layout/ScrollProvider'
import { Loader } from '@/components/layout/Loader'
import { Cursor } from '@/components/layout/Cursor'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Skills } from '@/components/sections/Skills'
import { Projects } from '@/components/sections/Projects'
import { Certifications } from '@/components/sections/Certifications'
import { Experience } from '@/components/sections/Experience'
import { Contact } from '@/components/sections/Contact'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ScrollTrigger } from '@/lib/gsap'

function Site() {
  const [loading, setLoading] = useState(true)
  const { stop, start } = useSmoothScroll()
  const reduced = useReducedMotion()

  // Freeze smooth scroll while the intro loader is on screen.
  useEffect(() => {
    if (loading) stop()
    else start()
  }, [loading, stop, start])

  // Recompute ScrollTrigger positions once the page is revealed and fonts/
  // layout have settled — keeps the pinned Projects section accurate.
  useEffect(() => {
    if (loading) return
    const t = setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => clearTimeout(t)
  }, [loading])

  return (
    <>
      {/* Skip-to-content for keyboard / screen-reader users. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-heading focus:px-5 focus:py-2 focus:text-sm focus:font-medium focus:text-base"
      >
        Skip to content
      </a>

      {/* Atmosphere layers */}
      <div className="atmos" aria-hidden="true" />
      <div className={reduced ? 'grain' : 'grain grain--animate'} aria-hidden="true" />

      <Cursor />
      {!reduced && <Loader onComplete={() => setLoading(false)} />}
      {/* Under reduced-motion we skip the loader entirely. */}
      {reduced && <ReducedMotionInit onReady={() => setLoading(false)} />}

      <Navbar />

      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Certifications />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

/** Immediately marks the page ready when motion is reduced (no intro). */
function ReducedMotionInit({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady()
  }, [onReady])
  return null
}

export default function App() {
  return (
    <ScrollProvider>
      <Site />
    </ScrollProvider>
  )
}
