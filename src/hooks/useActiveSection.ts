import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently in view, for highlighting the active
 * navbar link. Uses IntersectionObserver against the given section ids.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most-visible intersecting section.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])

  return active
}
