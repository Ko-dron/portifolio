import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useProgress } from '@react-three/drei'
import { profile } from '@/data/content'

interface LoaderProps {
  /** Called once the intro has fully revealed the page. */
  onComplete: () => void
}

/**
 * Minimal intro loader. Eases a counter toward the real drei/three loading
 * progress (or straight to 100 when the procedural scene has nothing async to
 * load), holds for a short minimum so the reveal never flashes, and always
 * resolves via a safety timeout so it can never hang the page.
 */
export function Loader({ onComplete }: LoaderProps) {
  const { progress, active } = useProgress()
  const [display, setDisplay] = useState(0)
  const [done, setDone] = useState(false)

  // Refs so the single rAF loop always reads the latest values without
  // restarting on every progress change.
  const startRef = useRef<number>(performance.now())
  const displayRef = useRef(0)
  const progressRef = useRef(0)
  const activeRef = useRef(false)
  progressRef.current = progress
  activeRef.current = active

  useEffect(() => {
    let raf = 0
    const MIN_DURATION = 1200 // ms — minimum time the loader is visible
    const MAX_DURATION = 5000 // ms — hard cap so we never hang on a stalled load

    const tick = () => {
      // While assets are loading, chase the real value; otherwise ease to 100.
      const target = activeRef.current ? progressRef.current : 100
      displayRef.current += (target - displayRef.current) * 0.08
      if (displayRef.current > 99.5) displayRef.current = 100
      setDisplay(displayRef.current)

      const elapsed = performance.now() - startRef.current
      const reachedEnd = displayRef.current >= 99.5 && !activeRef.current
      const timedOut = elapsed > MAX_DURATION

      if ((reachedEnd && elapsed > MIN_DURATION) || timedOut) {
        setDisplay(100)
        setDone(true)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-base"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          aria-hidden="true"
        >
          <div className="relative flex flex-col items-center gap-6">
            <motion.span
              className="font-display text-2xl font-semibold tracking-tight text-heading"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {profile.name}
            </motion.span>

            {/* Progress bar */}
            <div className="h-px w-40 overflow-hidden bg-border">
              <motion.div className="h-full bg-accent" style={{ width: `${display}%` }} />
            </div>

            <span className="font-mono text-xs tabular-nums tracking-widest text-muted">
              {String(Math.round(display)).padStart(3, '0')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
