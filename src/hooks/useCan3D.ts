import { useEffect, useState } from 'react'

/**
 * Decides whether the WebGL hero is worth loading. Returns false (static CSS
 * fallback, and the three.js bundle is never downloaded) when:
 *   • the user prefers reduced motion,
 *   • Data Saver is on,
 *   • it's a small touch screen (phones),
 *   • WebGL is unavailable.
 * Starts false so the first paint never waits on the 3D decision.
 */
export function useCan3D(): boolean {
  const [can, setCan] = useState(false)

  useEffect(() => {
    const reducedQ = window.matchMedia('(prefers-reduced-motion: reduce)')
    const phoneQ = window.matchMedia('(pointer: coarse) and (max-width: 767px)')

    const evaluate = () => {
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      if (reducedQ.matches || phoneQ.matches || conn?.saveData) return setCan(false)
      try {
        const c = document.createElement('canvas')
        setCan(!!(c.getContext('webgl2') || c.getContext('webgl')))
      } catch {
        setCan(false)
      }
    }

    evaluate()
    reducedQ.addEventListener('change', evaluate)
    phoneQ.addEventListener('change', evaluate)
    return () => {
      reducedQ.removeEventListener('change', evaluate)
      phoneQ.removeEventListener('change', evaluate)
    }
  }, [])

  return can
}
