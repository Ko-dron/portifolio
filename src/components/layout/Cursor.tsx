import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Custom cursor: a crisp dot that tracks the pointer 1:1 and a ring that trails
 * with a little lag. The ring grows over interactive elements. Rendered only on
 * fine-pointer devices; touch keeps the native cursor.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const isFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!isFinePointer) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.body.classList.add('has-custom-cursor')

    // Dot follows instantly; ring trails with a quickTo tween for lag.
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'expo.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'expo.out' })

    const onMove = (e: PointerEvent) => {
      gsap.set(dot, { x: e.clientX, y: e.clientY })
      if (reduced) {
        gsap.set(ring, { x: e.clientX, y: e.clientY })
      } else {
        ringX(e.clientX)
        ringY(e.clientY)
      }
    }

    // Grow the ring over anything interactive.
    const interactiveSelector = 'a, button, [role="button"], input, textarea, [data-cursor="hover"]'
    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      if (target.closest(interactiveSelector)) ring.classList.add('cursor-ring--hover')
    }
    const onOut = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      if (target.closest(interactiveSelector)) ring.classList.remove('cursor-ring--hover')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerout', onOut, { passive: true })

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerout', onOut)
    }
  }, [isFinePointer, reduced])

  if (!isFinePointer) return null

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
