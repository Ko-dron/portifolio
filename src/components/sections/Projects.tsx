import { useLayoutEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { projects, sections } from '@/data/content'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { ProjectCard } from './ProjectCard'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Signature scroll moment: on desktop the section PINS while the project cards
 * translate horizontally, driven by vertical scroll via GSAP ScrollTrigger
 * (kept in sync with Lenis through the ScrollProvider). On mobile / reduced
 * motion it falls back to a clean vertical stack.
 */
export function Projects() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const reduced = useReducedMotion()
  const horizontal = isDesktop && !reduced

  return (
    <section id="projects" className="scroll-mt-24">
      {horizontal ? <ProjectsHorizontal /> : <ProjectsStacked />}
    </section>
  )
}

/* ── Pinned horizontal gallery (desktop) ───────────────────────────────── */

function ProjectsHorizontal() {
  const { projects: copy } = sections
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    if (!root || !track) return

    const ctx = gsap.context(() => {
      // Distance the track must travel = its overflow past the viewport.
      const getScrollLen = () => track.scrollWidth - window.innerWidth

      const tween = gsap.to(track, {
        x: () => -getScrollLen(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${getScrollLen()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true, // recompute widths on resize
        },
      })

      // Ensure measurements are correct after fonts/layout settle.
      ScrollTrigger.refresh()
      return () => {
        tween.kill()
      }
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="relative h-[100svh] overflow-hidden">
      <div
        ref={trackRef}
        className="flex h-full items-center gap-6 pl-6 will-change-transform md:pl-10"
      >
        {/* Intro panel travels with the track */}
        <div className="flex h-full w-[86vw] shrink-0 flex-col justify-center pr-10 sm:w-[46vw] lg:w-[34vw]">
          <span className="section-index">{copy.index}</span>
          <h2 className="mt-4 text-display-md font-semibold text-heading">{copy.title}</h2>
          <p className="mt-5 max-w-sm text-body">{copy.lead}</p>
          <p className="mt-8 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Scroll <ArrowRight size={14} />
          </p>
        </div>

        {projects.map((project) => (
          <ProjectCard key={project.repo} project={project} variant="horizontal" />
        ))}

        {/* Tail spacer so the last card clears the edge */}
        <div className="h-full w-[6vw] shrink-0" aria-hidden="true" />
      </div>
    </div>
  )
}

/* ── Vertical stack fallback (mobile / reduced motion) ─────────────────── */

function ProjectsStacked() {
  const { projects: copy } = sections
  return (
    <div className="container-x py-section">
      <SectionHeading index={copy.index} title={copy.title} lead={copy.lead} />
      <RevealGroup className="grid gap-6 sm:grid-cols-2" stagger={0.08}>
        {projects.map((project) => (
          <RevealItem key={project.repo}>
            <ProjectCard project={project} variant="stacked" />
          </RevealItem>
        ))}
      </RevealGroup>
      <Reveal>
        <div className="hairline mt-12" />
      </Reveal>
    </div>
  )
}
