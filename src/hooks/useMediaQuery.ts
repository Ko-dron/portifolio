import { useEffect, useState } from 'react'

/**
 * Reactive matchMedia. Used to switch the pinned/horizontal Projects showcase
 * to a stacked vertical fallback below the desktop breakpoint, and to gate
 * pointer-based effects on `(pointer: fine)`.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
