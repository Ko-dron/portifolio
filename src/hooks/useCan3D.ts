import { useEffect, useState } from 'react'

/**
 * Decides whether the WebGL hero is worth loading. Returns false (static CSS
 * fallback, and the three.js bundle is never downloaded) when:
 *   • the user prefers reduced motion,
 *   • Data Saver is on,
 *   • the viewport is ≤768px wide (phones, narrow windows),
 *   • WebGL is unavailable.
 * Starts false so the first paint never waits on the 3D decision.
 */
export function useCan3D(): boolean {
  const [can, setCan] = useState(false)

  useEffect(() => {
    const reducedQ = window.matchMedia('(prefers-reduced-motion: reduce)')
    // ≤768px: the hero text spans the full width, so the desk would sit behind it.
    const phoneQ = window.matchMedia('(max-width: 768px)')

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
