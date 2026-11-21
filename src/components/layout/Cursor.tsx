import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** Angle (deg) the plane rests at: nose pointing up-left, like an arrow cursor. */
const REST_ANGLE = -135

/**
 * Origami paper-plane cursor. The plane's nose is the hotspot. It glides after
 * the pointer with a little lag, banks to face the direction of travel, bobs
 * gently while idle, grows and turns accent-red over interactive elements, and
 * dips on click. Fine-pointer devices only; touch keeps the native cursor.
 * Under reduced motion it tracks 1:1 with a fixed heading and no idle float.
 */
export function Cursor() {
  const planeRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const isFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!isFinePointer) return
    const plane = planeRef.current
    const body = bodyRef.current
    if (!plane || !body) return

    document.body.classList.add('has-custom-cursor')
    gsap.set(plane, { x: -100, y: -100, rotation: REST_ANGLE })

    const moveX = gsap.quickTo(plane, 'x', { duration: reduced ? 0 : 0.18, ease: 'power3.out' })
    const moveY = gsap.quickTo(plane, 'y', { duration: reduced ? 0 : 0.18, ease: 'power3.out' })
    const turn = gsap.quickTo(plane, 'rotation', { duration: 0.45, ease: 'power3.out' })

    let lastX = 0
    let lastY = 0
    let angle = REST_ANGLE // unwrapped, so the plane always turns the short way
    let shown = false

    const onMove = (e: PointerEvent) => {
      if (!shown) {
        gsap.set(plane, { x: e.clientX, y: e.clientY })
        plane.classList.add('cursor-plane--visible')
        shown = true
      }
      moveX(e.clientX)
      moveY(e.clientY)

      if (!reduced) {
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        // Only re-aim on deliberate movement, so jitter doesn't spin the plane.
        if (dx * dx + dy * dy > 36) {
          const target = (Math.atan2(dy, dx) * 180) / Math.PI
          // Shortest signed difference, in [-180, 180).
          const delta = ((((target - angle + 180) % 360) + 360) % 360) - 180
          angle += delta * 0.6
          turn(angle)
          lastX = e.clientX
          lastY = e.clientY
        }
      }
    }

    const interactiveSelector = 'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]'
    const onOver = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest(interactiveSelector)) body.classList.add('cursor-plane--hover')
    }
    const onOut = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest(interactiveSelector)) body.classList.remove('cursor-plane--hover')
    }
    const onDown = () => body.classList.add('cursor-plane--down')
    const onUp = () => body.classList.remove('cursor-plane--down')
    const onLeave = () => plane.classList.remove('cursor-plane--visible')
    const onEnter = () => shown && plane.classList.add('cursor-plane--visible')

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerout', onOut, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.documentElement.addEventListener('pointerenter', onEnter)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerout', onOut)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.documentElement.removeEventListener('pointerenter', onEnter)
    }
  }, [isFinePointer, reduced])

  if (!isFinePointer) return null

  return (
    // Outer: positioned + rotated by GSAP, origin at the nose (the hotspot).
    <div ref={planeRef} className="cursor-plane" aria-hidden="true">
      {/* Inner: hover / press scaling and the idle float (CSS). */}
      <div ref={bodyRef} className="cursor-plane__body">
        {/* Drawn nose-right; the nose sits at (30, 12) in the viewBox. */}
        <svg
          width="30"
          height="24"
          viewBox="0 0 30 24"
          className={reduced ? 'cursor-plane__svg' : 'cursor-plane__svg cursor-plane__svg--float'}
        >
          {/* upper wing */}
          <path d="M0 3 L30 12 L11 13 Z" className="cursor-plane__wing" />
          {/* keel fold */}
          <path d="M11 13 L30 12 L15 23 Z" className="cursor-plane__keel" />
          {/* lower wing tip */}
          <path d="M11 13 L15 23 L12.5 16.5 Z" className="cursor-plane__tip" />
          {/* centre crease */}
          <path d="M3 4 L30 12" className="cursor-plane__crease" />
        </svg>
      </div>
    </div>
  )
}
