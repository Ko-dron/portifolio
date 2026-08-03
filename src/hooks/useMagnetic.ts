import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useReducedMotion } from './useReducedMotion'

interface Options {
  /** How strongly the element is pulled toward the cursor (0..1). */
  strength?: number
  /** Extra hit-area padding in px around the element. */
  padding?: number
}

/**
 * Magnetic hover: the returned ref's element subtly attracts toward the pointer
 * while hovered, then springs back on leave. Disabled under reduced-motion and
 * on non-fine pointers (touch).
 */
export function useMagnetic<T extends HTMLElement>({ strength = 0.4, padding = 24 }: Options = {}) {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'expo.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'expo.out' })

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy

      const withinX = Math.abs(dx) < rect.width / 2 + padding
      const withinY = Math.abs(dy) < rect.height / 2 + padding
      if (withinX && withinY) {
        xTo(dx * strength)
        yTo(dy * strength)
      } else {
        xTo(0)
        yTo(0)
      }
    }

    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [strength, padding, reduced])

  return ref
}
