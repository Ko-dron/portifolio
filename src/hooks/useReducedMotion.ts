import { useEffect, useState } from 'react'

/**
 * Reactively tracks the user's `prefers-reduced-motion` setting.
 * Every motion-heavy piece (3D auto-rotation, scroll scrubbing, reveals) reads
 * this so it can disable or greatly reduce animation when requested.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}
