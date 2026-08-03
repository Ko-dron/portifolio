import { useEffect, useRef } from 'react'

export interface Pointer {
  x: number
  y: number
  /** Normalised to [-1, 1] with origin at viewport centre. */
  nx: number
  ny: number
}

/**
 * Tracks the pointer without triggering React re-renders. Returns a ref whose
 * `.current` is updated on every pointermove — read it inside rAF loops
 * (e.g. the 3D scene, custom cursor) to stay cheap.
 */
export function useMousePosition() {
  const pointer = useRef<Pointer>({ x: 0, y: 0, nx: 0, ny: 0 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const { innerWidth: w, innerHeight: h } = window
      pointer.current = {
        x: e.clientX,
        y: e.clientY,
        nx: (e.clientX / w) * 2 - 1,
        ny: (e.clientY / h) * 2 - 1,
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return pointer
}
