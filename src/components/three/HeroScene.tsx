import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Lighting } from './Lighting'
import { IsoDesk } from './IsoDesk'
import { Particles } from './Particles'
import { Effects } from './Effects'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { clamp } from '@/lib/utils'

/**
 * Detect low-power / mobile devices so we can gracefully degrade: fewer
 * particles, no postprocessing, lower pixel ratio. Cheap heuristics only.
 */
function detectLowPower(): boolean {
  if (typeof navigator === 'undefined') return false
  const cores = navigator.hardwareConcurrency ?? 8
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  const coarse = window.matchMedia('(pointer: coarse)').matches
  return cores <= 4 || mem <= 4 || coarse
}

/**
 * Keeps the orthographic camera aimed at the desk and rescales its zoom with the
 * viewport, so the isometric scene stays a sensible size on any screen.
 */
function IsoCameraRig() {
  const { camera, size } = useThree()

  useEffect(() => {
    camera.lookAt(0, 0.1, 0)
  }, [camera])

  useEffect(() => {
    const ortho = camera as THREE.OrthographicCamera
    // Zoom = pixels-per-world-unit; scale to the smaller viewport dimension.
    ortho.zoom = clamp(Math.min(size.width, size.height * 1.5) / 9.5, 30, 118)
    ortho.updateProjectionMatrix()
  }, [camera, size])

  return null
}

/**
 * The 3D hero canvas — an isometric coding desk. Lazy-loaded and Suspense-wrapped
 * by the Hero section. Responsibilities:
 *   • orthographic isometric projection,
 *   • cap devicePixelRatio,
 *   • pause the render loop when the tab is hidden or the hero scrolls offscreen,
 *   • degrade gracefully on low-power devices,
 *   • hold a calm static frame under prefers-reduced-motion.
 */
export default function HeroScene() {
  const reduced = useReducedMotion()
  const lowPower = useMemo(detectLowPower, [])
  const containerRef = useRef<HTMLDivElement>(null)

  const [onScreen, setOnScreen] = useState(true)
  const [tabVisible, setTabVisible] = useState(true)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      rootMargin: '100px',
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    if (!reduced) return
    const t = setTimeout(() => setSettled(true), 1200)
    return () => clearTimeout(t)
  }, [reduced])

  const paused = !onScreen || !tabVisible
  const frameloop = paused || (reduced && settled) ? 'never' : 'always'

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden="true">
      <Canvas
        orthographic
        dpr={lowPower ? [1, 1.5] : [1, 2]}
        frameloop={frameloop}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [8, 6.5, 8], zoom: 100, near: 0.1, far: 200 }}
      >
        <IsoCameraRig />
        <Suspense fallback={null}>
          <Lighting />
          {/* Offset the desk toward the right so it clears the left-aligned
              headline; on narrow screens it recenters. */}
          <group position={[1.7, -0.35, 0.6]}>
            <IsoDesk reduced={reduced} />
          </group>
          <Particles reduced={reduced} count={lowPower ? 120 : 220} />
          {!lowPower && <Effects />}
        </Suspense>
      </Canvas>
    </div>
  )
}
