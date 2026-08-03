import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react'
import { profile, socials } from '@/data/content'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { HeroFallback } from '@/components/three/HeroFallback'
import { useSmoothScroll } from '@/components/layout/ScrollProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Lazy-load the entire 3D bundle so it never blocks first paint.
const HeroScene = lazy(() => import('@/components/three/HeroScene'))

const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const { scrollTo } = useSmoothScroll()
  const reduced = useReducedMotion()

  // Stagger the intro lines. Starts slightly after the loader lifts.
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.08, delayChildren: 0.3 } },
  }
  const item = {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  }

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      aria-label="Introduction"
    >
      {/* 3D centerpiece */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Suspense fallback={<HeroFallback />}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Legibility scrim: darkens the left (text) side, fades to reveal the
          desk on the right. */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-r from-base via-base/70 to-transparent"
        aria-hidden="true"
      />

      {/* Content overlay */}
      <div className="container-x relative z-10 py-28">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl">
          <motion.p
            variants={item}
            className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-accent"
          >
            <span className="h-px w-8 bg-accent" />
            {profile.kicker}
          </motion.p>

          <motion.h1
            variants={item}
            className="text-display-lg font-semibold text-heading"
          >
            {profile.headline}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-xl text-lg leading-relaxed text-body"
          >
            {profile.bio}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton
              href="#projects"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                scrollTo('#projects')
              }}
            >
              View Projects
            </MagneticButton>
            <MagneticButton
              href={`mailto:${socials.email}`}
              variant="ghost"
            >
              Get in touch
            </MagneticButton>

            <div className="ml-1 flex items-center gap-4 pl-4">
              {[
                { label: 'GitHub', href: socials.github, icon: Github },
                { label: 'LinkedIn', href: socials.linkedin, icon: Linkedin },
                { label: 'Email', href: `mailto:${socials.email}`, icon: Mail },
              ].map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className="text-body transition-colors duration-300 hover:text-accent"
                >
                  <Icon size={20} strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        onClick={() => scrollTo('#about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted transition-colors hover:text-heading"
        aria-label="Scroll to About"
      >
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em]">Scroll</span>
        <span className="relative flex h-10 w-5 justify-center overflow-hidden rounded-full border border-border">
          <ArrowDown size={12} className={reduced ? '' : 'animate-scroll-cue'} />
        </span>
      </motion.button>
    </section>
  )
}
