import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const IDLE_SIZE = 30 // px — reticle size when free-floating
const LOCK_PAD = 10 // px — breathing room around a locked-on element

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]'

/**
 * HUD "target-lock" cursor. A crisp dot tracks the pointer 1:1; four corner
 * brackets trail behind it and, over anything interactive, snap out to frame
 * the element like a targeting lock (accent red). Clicking pulses the
 * brackets inward. Fine-pointer devices only — touch keeps the native cursor.
 * Under reduced motion everything moves instantly with no idle pulse.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const reticleRef = useRef<HTMLDivElement>(null)
  const isFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!isFinePointer) return
    const dot = dotRef.current
    const reticle = reticleRef.current
    if (!dot || !reticle) return

    document.body.classList.add('has-custom-cursor')
    gsap.set([dot, reticle], { xPercent: -50, yPercent: -50, x: -100, y: -100 })
    gsap.set(reticle, { width: IDLE_SIZE, height: IDLE_SIZE })

    const d = reduced ? 0 : 0.45
    const rx = gsap.quickTo(reticle, 'x', { duration: d, ease: 'expo.out' })
    const ry = gsap.quickTo(reticle, 'y', { duration: d, ease: 'expo.out' })
    const rw = gsap.quickTo(reticle, 'width', { duration: d, ease: 'expo.out' })
    const rh = gsap.quickTo(reticle, 'height', { duration: d, ease: 'expo.out' })

    let target: HTMLElement | null = null
    let shown = false

    /** Frame the locked element, or float a small reticle at the pointer. */
    const aim = (px: number, py: number) => {
      if (target && target.isConnected) {
        const r = target.getBoundingClientRect()
        rx(r.left + r.width / 2)
        ry(r.top + r.height / 2)
        rw(r.width + LOCK_PAD * 2)
        rh(r.height + LOCK_PAD * 2)
      } else {
        rx(px)
        ry(py)
        rw(IDLE_SIZE)
        rh(IDLE_SIZE)
      }
    }

    let lastX = -100
    let lastY = -100

    const onMove = (e: PointerEvent) => {
      lastX = e.clientX
      lastY = e.clientY
      gsap.set(dot, { x: lastX, y: lastY })
      if (!shown) {
        gsap.set(reticle, { x: lastX, y: lastY })
        dot.classList.add('cursor--visible')
        reticle.classList.add('cursor--visible')
        shown = true
      }
      aim(lastX, lastY)
    }

    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(INTERACTIVE)
      if (!el || el === target) return
      // Don't frame huge targets (e.g. whole cards) — it reads as noise.
      const r = el.getBoundingClientRect()
      if (r.width > 520 || r.height > 320) return
      target = el
      reticle.classList.add('cursor-reticle--locked')
      dot.classList.add('cursor-dot--locked')
      aim(lastX, lastY)
    }
    const onOut = (e: PointerEvent) => {
      if (!target) return
      const next = e.relatedTarget as Node | null
      if (next && target.contains(next)) return
      target = null
      reticle.classList.remove('cursor-reticle--locked')
      dot.classList.remove('cursor-dot--locked')
      aim(lastX, lastY)
    }

    const onDown = () => reticle.classList.add('cursor-reticle--down')
    const onUp = () => reticle.classList.remove('cursor-reticle--down')
    const onScroll = () => target && aim(lastX, lastY)
    const onLeave = () => {
      dot.classList.remove('cursor--visible')
      reticle.classList.remove('cursor--visible')
    }
    const onEnter = () => {
      if (!shown) return
      dot.classList.add('cursor--visible')
      reticle.classList.add('cursor--visible')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerout', onOut, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.documentElement.addEventListener('pointerenter', onEnter)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerout', onOut)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('scroll', onScroll)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.documentElement.removeEventListener('pointerenter', onEnter)
    }
  }, [isFinePointer, reduced])

  if (!isFinePointer) return null

  return (
    <>
      <div ref={reticleRef} className="cursor-reticle" aria-hidden="true">
        <div className={reduced ? 'cursor-reticle__frame' : 'cursor-reticle__frame cursor-reticle__frame--pulse'}>
          <span className="cursor-reticle__corner cursor-reticle__corner--tl" />
          <span className="cursor-reticle__corner cursor-reticle__corner--tr" />
          <span className="cursor-reticle__corner cursor-reticle__corner--bl" />
          <span className="cursor-reticle__corner cursor-reticle__corner--br" />
        </div>
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
