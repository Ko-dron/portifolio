import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, RoundedBox, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { clamp, lerp } from '@/lib/utils'

interface IsoDeskProps {
  reduced: boolean
}

/* Palette — dark, but lifted a touch so silhouettes read on near-black. */
const C = {
  base: '#161616',
  floor: '#3b3532',
  panelDark: '#141414',
  deskTop: '#252220',
  deskEdge: '#34302c',
  metal: '#3a3a3a',
  device: '#242424',
  keycap: '#2e2e2e',
  white: '#faf9f7',
  accent: '#df2531',
} as const

/* Shared materials — one instance each, reused by every mesh that needs it. */
const MAT = {
  metal: new THREE.MeshStandardMaterial({ color: C.metal, roughness: 0.4, metalness: 0.7 }),
  device: new THREE.MeshStandardMaterial({ color: C.device, roughness: 0.5, metalness: 0.4 }),
  panel: new THREE.MeshStandardMaterial({ color: C.panelDark, roughness: 0.5, metalness: 0.4 }),
  fabric: new THREE.MeshStandardMaterial({ color: C.device, roughness: 0.7, metalness: 0.15 }),
  keycap: new THREE.MeshStandardMaterial({ color: C.keycap, roughness: 0.7 }),
  white: new THREE.MeshStandardMaterial({ color: C.white, roughness: 0.5 }),
  accentMatte: new THREE.MeshStandardMaterial({ color: C.accent, roughness: 0.6 }),
  accentGlow: new THREE.MeshStandardMaterial({
    color: C.accent,
    emissive: C.accent,
    emissiveIntensity: 1.6,
    toneMapped: false,
  }),
}

/** Tilt / sway limits — kept small so the laptop never swings in front of the monitor. */
const SWAY_Y = 0.16
const TILT_X = 0.08
const TILT_Z = 0.025

/**
 * The 3D centerpiece: a stylised low-poly **isometric coding desk**.
 * Monitor + laptop screens glow (picked up by the bloom pass), a desk lamp
 * casts a warm pool, and a chair is pulled up to the keyboard. The rig:
 *   • sways gently on Y,
 *   • parallax-tilts toward the pointer (clamped),
 *   • drifts up + scales down as the hero scrolls away.
 * Under reduced-motion it holds a calm static pose.
 */
export function IsoDesk({ reduced }: IsoDeskProps) {
  const group = useRef<THREE.Group>(null)
  const tilt = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    const g = group.current
    if (!g) return

    const scroll = clamp(window.scrollY / Math.max(window.innerHeight, 1), 0, 1)

    if (reduced) {
      g.rotation.set(0, -0.5, 0)
      g.position.set(0, 0, 0)
      g.scale.setScalar(1)
      return
    }

    g.rotation.y = -0.5 + Math.sin(state.clock.elapsedTime * 0.12) * SWAY_Y

    tilt.current.x = lerp(tilt.current.x, clamp(state.pointer.y, -1, 1) * TILT_X, 0.05)
    tilt.current.y = lerp(tilt.current.y, clamp(state.pointer.x, -1, 1) * TILT_Z, 0.05)
    g.rotation.x = tilt.current.x
    g.rotation.z = -tilt.current.y

    g.position.y = scroll * 1.6
    g.scale.setScalar(1 - scroll * 0.22)
  })

  return (
    <Float
      speed={reduced ? 0 : 1}
      rotationIntensity={reduced ? 0 : 0.06}
      floatIntensity={reduced ? 0 : 0.3}
    >
      <group ref={group} rotation={[0, -0.5, 0]}>
        <DeskAssembly />
      </group>
    </Float>
  )
}

/* ── The desk and everything on it ─────────────────────────────────────── */

/**
 * Layout (desk-local units): the top is 4.6 × 2.3 with its surface at
 * y = 0.08; the floor is at y = FLOOR_Y (the leg tips). +z is the front of the
 * desk (where the chair is), +x is the right-hand end. No two props overlap in
 * plan view, and everything stays ≥ 0.1 inside the desk edges.
 */
const DESK_Y = 0.08
const FLOOR_Y = -1.2

function DeskAssembly() {
  return (
    <group position={[0, -0.2, 0]}>
      <FadeFloor />
      <ContactShadows
        position={[0, FLOOR_Y + 0.005, 0.3]}
        opacity={0.6}
        scale={9}
        blur={2.4}
        far={3}
        resolution={512}
        color="#000000"
      />

      <Desk />
      <Monitor />
      <Laptop />
      <Keyboard />
      <Mouse />
      <Mug />
      <Lamp />
      <Books />
      <Plant />
      <Chair />
    </group>
  )
}

/**
 * A thin floor that dissolves into the background: a single plane whose alpha
 * falls off radially (a tiny generated gradient texture — no asset). No slab,
 * no hard edges, so nothing reads as "cut off" when the canvas crops it.
 */
function FadeFloor() {
  const alpha = useMemo(() => {
    const size = 128
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, '#ffffff')
    g.addColorStop(0.5, '#b0b0b0')
    g.addColorStop(1, '#000000')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    const t = new THREE.CanvasTexture(c)
    t.needsUpdate = true
    return t
  }, [])

  return (
    <mesh position={[0, FLOOR_Y, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[4.6, 48]} />
      <meshStandardMaterial
        color={C.floor}
        roughness={0.95}
        transparent
        alphaMap={alpha}
        depthWrite={false}
      />
    </mesh>
  )
}

function Desk() {
  return (
    <group>
      <RoundedBox args={[4.6, 0.16, 2.3]} radius={0.05} smoothness={3} castShadow>
        <meshStandardMaterial color={C.deskTop} roughness={0.55} metalness={0.2} />
      </RoundedBox>
      {[
        [-2.1, -0.6, -0.95],
        [2.1, -0.6, -0.95],
        [-2.1, -0.6, 0.95],
        [2.1, -0.6, 0.95],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} material={MAT.metal} castShadow>
          <boxGeometry args={[0.14, 1.2, 0.14]} />
        </mesh>
      ))}
    </group>
  )
}

function Monitor() {
  return (
    <group position={[-0.55, 0, -0.6]} rotation={[0, 0.28, 0]}>
      <mesh position={[0, DESK_Y + 0.02, 0]} material={MAT.metal} castShadow>
        <boxGeometry args={[0.8, 0.04, 0.42]} />
      </mesh>
      <mesh position={[0, 0.5, -0.02]} material={MAT.metal} castShadow>
        <boxGeometry args={[0.1, 0.7, 0.08]} />
      </mesh>
      <RoundedBox args={[2.1, 1.25, 0.09]} radius={0.04} smoothness={2} position={[0, 1.15, 0.02]} material={MAT.panel} castShadow />
      <mesh position={[0, 1.15, 0.072]}>
        <planeGeometry args={[1.92, 1.08]} />
        <meshStandardMaterial color={C.base} emissive={C.accent} emissiveIntensity={0.35} roughness={0.3} />
      </mesh>
      <CodeLines />
    </group>
  )
}

/** A little block of faux code on the monitor screen. */
function CodeLines() {
  const lines: Array<[number, number, number, string]> = [
    [-0.55, 0.42, 0.5, C.accent],
    [-0.3, 0.3, 0.9, C.white],
    [-0.15, 0.18, 1.2, C.accent],
    [-0.4, 0.06, 0.7, C.white],
    [-0.25, -0.06, 1.0, C.accent],
    [-0.5, -0.18, 0.55, C.white],
    [-0.2, -0.3, 1.1, C.accent],
    [-0.45, -0.42, 0.65, C.white],
  ]
  return (
    <group position={[0, 1.15, 0.078]}>
      {lines.map(([x, y, w, color], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <planeGeometry args={[w, 0.045]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={color === C.accent ? 1.4 : 0.7}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/* Laptop terminal: drawn once into a small CanvasTexture. */
const TERM_W = 512
const TERM_H = 320
const TERM_LINES: Array<[string, string]> = [
  ['$ nmap -sV 10.0.2.15', '#e8e6e3'],
  ['Starting Nmap 7.94', '#7d8a82'],
  ['PORT     STATE SERVICE', '#3ddc84'],
  ['22/tcp   open  ssh', '#e8e6e3'],
  ['80/tcp   open  http', '#e8e6e3'],
  ['443/tcp  open  https', '#e8e6e3'],
  ['$ ', '#3ddc84'],
]
const TERM_LINE_H = 40
const TERM_PAD = 26

function useTerminalTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = TERM_W
    c.height = TERM_H
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#0c0607'
    ctx.fillRect(0, 0, TERM_W, TERM_H)
    ctx.font = '600 26px Consolas, "Courier New", monospace'
    ctx.textBaseline = 'top'
    TERM_LINES.forEach(([text, color], i) => {
      ctx.fillStyle = color
      ctx.fillText(text, TERM_PAD, TERM_PAD + i * TERM_LINE_H)
    })
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    return t
  }, [])
}

function Laptop() {
  const term = useTerminalTexture()
  const cursor = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (cursor.current) cursor.current.visible = Math.floor(state.clock.elapsedTime * 2) % 2 === 0
  })

  // Screen plane is 1.12 × 0.7; map the "$ " prompt position on the canvas to it.
  const sw = 1.12
  const sh = 0.7
  const cx = -sw / 2 + ((TERM_PAD + 34) / TERM_W) * sw
  const cy = sh / 2 - ((TERM_PAD + (TERM_LINES.length - 1) * TERM_LINE_H + 15) / TERM_H) * sh

  return (
    // Pulled right/forward so the lid never covers the bottom of the monitor.
    <group position={[1.5, DESK_Y + 0.025, 0.35]} rotation={[0, 0.55, 0]}>
      <RoundedBox args={[1.25, 0.05, 0.85]} radius={0.03} smoothness={2} material={MAT.device} castShadow />
      <mesh position={[0, 0.027, 0.22]} rotation={[-Math.PI / 2, 0, 0]} material={MAT.keycap}>
        <planeGeometry args={[0.5, 0.32]} />
      </mesh>
      {/* Lid hinged at the back edge, ~17° recline. */}
      <group position={[0, 0, -0.42]} rotation={[-0.3, 0, 0]}>
        <RoundedBox args={[1.25, 0.82, 0.04]} radius={0.03} smoothness={2} position={[0, 0.41, 0]} material={MAT.panel} castShadow />
        <mesh position={[0, 0.41, 0.022]}>
          <planeGeometry args={[sw, sh]} />
          <meshStandardMaterial
            color="#000000"
            emissive="#ffffff"
            emissiveMap={term}
            emissiveIntensity={1.15}
            roughness={0.35}
            toneMapped={false}
          />
        </mesh>
        {/* Blinking block cursor */}
        <mesh ref={cursor} position={[cx, 0.41 + cy, 0.024]}>
          <planeGeometry args={[0.03, 0.05]} />
          <meshBasicMaterial color="#3ddc84" toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

function Keyboard() {
  return (
    <group position={[-0.55, DESK_Y + 0.03, 0.55]}>
      <RoundedBox args={[1.5, 0.06, 0.5]} radius={0.02} smoothness={2} material={MAT.device} castShadow />
      <mesh position={[0, 0.005, 0.27]} material={MAT.accentGlow}>
        <boxGeometry args={[1.4, 0.02, 0.02]} />
      </mesh>
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]} material={MAT.keycap}>
        <planeGeometry args={[1.36, 0.4]} />
      </mesh>
    </group>
  )
}

function Mouse() {
  return (
    <mesh position={[0.55, DESK_Y + 0.075, 0.62]} rotation={[Math.PI / 2, 0, 0]} material={MAT.device} castShadow>
      <capsuleGeometry args={[0.075, 0.11, 4, 12]} />
    </mesh>
  )
}

function Mug() {
  // Well inside the right-hand end of the desk (edge at x = 2.3).
  return (
    <group position={[1.78, DESK_Y + 0.16, -0.72]}>
      <mesh material={MAT.white} castShadow>
        <cylinderGeometry args={[0.15, 0.13, 0.32, 16]} />
      </mesh>
      <mesh position={[0, -0.02, 0]} material={MAT.accentMatte}>
        <cylinderGeometry args={[0.153, 0.153, 0.08, 16]} />
      </mesh>
      <mesh position={[0.17, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={MAT.white}>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
      </mesh>
    </group>
  )
}

/** A cylinder spanning two points — used for the lamp's arm segments. */
function Segment({ from, to, radius }: { from: THREE.Vector3; to: THREE.Vector3; radius: number }) {
  const { pos, quat, len } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(to, from)
    const len = dir.length()
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
    const pos = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5)
    return { pos, quat, len }
  }, [from, to])
  return (
    <mesh position={pos} quaternion={quat} material={MAT.metal} castShadow>
      <cylinderGeometry args={[radius, radius, len, 12]} />
    </mesh>
  )
}

/**
 * Architect-style desk lamp at the back-left corner, beside the books. Its arm
 * rises, then reaches *forward* (+z) over the front-left of the desk — away
 * from the monitor, whose left edge is at x ≈ -1.56, z ≈ -0.31.
 */
function Lamp() {
  const pts = useMemo(
    () => ({
      base: new THREE.Vector3(0, 0.05, 0),
      elbow: new THREE.Vector3(-0.12, 1.0, -0.05),
      head: new THREE.Vector3(0.12, 1.12, 0.62),
    }),
    [],
  )
  // Aim the shade's axis from the head down onto the desk in front of it.
  const shadeQuat = useMemo(() => {
    const aim = new THREE.Vector3(0.15, -1, 0.35).normalize()
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), aim)
  }, [])

  return (
    <group position={[-1.95, DESK_Y, -0.55]}>
      {/* Round weighted base */}
      <mesh position={[0, 0.03, 0]} material={MAT.metal} castShadow>
        <cylinderGeometry args={[0.26, 0.29, 0.06, 28]} />
      </mesh>
      {/* Arms + joints */}
      <Segment from={pts.base} to={pts.elbow} radius={0.045} />
      <Segment from={pts.elbow} to={pts.head} radius={0.04} />
      {[pts.base, pts.elbow].map((p, i) => (
        <mesh key={i} position={p} material={MAT.metal}>
          <sphereGeometry args={[0.07, 14, 14]} />
        </mesh>
      ))}
      {/* Shade: a proper cone, opening downward toward the desk */}
      <group position={pts.head} quaternion={shadeQuat}>
        <mesh position={[0, -0.12, 0]} material={MAT.metal} castShadow>
          <cylinderGeometry args={[0.08, 0.27, 0.3, 28, 1, true]} />
        </mesh>
        {/* Inner face, lit warm so the opening reads clearly */}
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.075, 0.26, 0.29, 28, 1, true]} />
          <meshStandardMaterial color="#3a1a1a" emissive="#ff5a5f" emissiveIntensity={0.35} side={THREE.BackSide} />
        </mesh>
        {/* Cap */}
        <mesh material={MAT.metal}>
          <sphereGeometry args={[0.09, 16, 12]} />
        </mesh>
        {/* Bulb */}
        <mesh position={[0, -0.2, 0]} material={MAT.accentGlow}>
          <sphereGeometry args={[0.075, 14, 14]} />
        </mesh>
        {/* Warm pool of light on the desk */}
        <pointLight position={[0, -0.45, 0]} intensity={6} distance={4} color="#ff5a5f" />
      </group>
    </group>
  )
}

function Books() {
  const stack: Array<[number, number, THREE.Material]> = [
    [0.0, 0.045, MAT.accentMatte],
    [0.06, 0.145, MAT.white],
    [-0.03, 0.245, MAT.metal],
  ]
  return (
    <group position={[-1.8, DESK_Y, 0.62]} rotation={[0, 0.3, 0]}>
      {stack.map(([dx, y, mat], i) => (
        <mesh key={i} position={[dx, y, 0]} material={mat} castShadow>
          <boxGeometry args={[0.7, 0.09, 0.5]} />
        </mesh>
      ))}
    </group>
  )
}

function Plant() {
  return (
    <group position={[0.3, DESK_Y + 0.13, 0.02]}>
      <mesh material={MAT.accentMatte} castShadow>
        <cylinderGeometry args={[0.14, 0.11, 0.26, 16]} />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.03, 16]} />
        <meshStandardMaterial color={C.deskEdge} roughness={0.8} />
      </mesh>
      {[
        [0, 0.26, 0, 0.15],
        [0.09, 0.36, 0.04, 0.115],
        [-0.09, 0.34, -0.04, 0.105],
        [0.02, 0.44, 0.02, 0.09],
      ].map((s, i) => (
        <mesh key={i} position={[s[0], s[1], s[2]]} castShadow>
          <sphereGeometry args={[s[3], 12, 12]} />
          <meshStandardMaterial color="#3c3c3a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Office chair in front of the keyboard, facing the desk (-z), slightly pulled
 * out. One continuous frame: seat → support spine → backrest, on a gas post
 * with a five-star base and casters that stand on the floor.
 */
function Chair() {
  const SEAT_Y = -0.38
  return (
    <group position={[-0.5, 0, 1.72]} rotation={[0, -0.12, 0]}>
      {/* Seat */}
      <RoundedBox args={[1.0, 0.13, 0.92]} radius={0.06} smoothness={2} position={[0, SEAT_Y, 0]} material={MAT.fabric} castShadow />
      {/* Seat pan under the cushion */}
      <mesh position={[0, SEAT_Y - 0.1, 0]} material={MAT.metal}>
        <boxGeometry args={[0.6, 0.06, 0.55]} />
      </mesh>
      {/* Spine: rises from the seat pan behind the cushion into the backrest */}
      <mesh position={[0, SEAT_Y - 0.1, 0.4]} material={MAT.metal} castShadow>
        <boxGeometry args={[0.16, 0.06, 0.3]} />
      </mesh>
      <mesh position={[0, SEAT_Y + 0.22, 0.54]} material={MAT.metal} castShadow>
        <boxGeometry args={[0.16, 0.66, 0.06]} />
      </mesh>
      {/* Backrest, slightly reclined, overlapping the spine so it reads as one piece */}
      <group position={[0, SEAT_Y + 0.72, 0.56]} rotation={[0.1, 0, 0]}>
        <RoundedBox args={[0.98, 0.95, 0.13]} radius={0.08} smoothness={2} material={MAT.fabric} castShadow />
        <mesh position={[0, 0.05, 0.07]} material={MAT.accentGlow}>
          <boxGeometry args={[0.78, 0.03, 0.02]} />
        </mesh>
      </group>
      {/* Gas post: from under the seat pan to the star base */}
      <mesh position={[0, (SEAT_Y - 0.13 + FLOOR_Y + 0.12) / 2, 0]} material={MAT.metal} castShadow>
        <cylinderGeometry args={[0.055, 0.07, SEAT_Y - 0.13 - (FLOOR_Y + 0.12), 14]} />
      </mesh>
      {/* Five-star base + casters, resting on the floor */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2 + 0.3
        return (
          <group key={i} rotation={[0, -a, 0]}>
            <mesh position={[0.24, FLOOR_Y + 0.12, 0]} material={MAT.metal} castShadow>
              <boxGeometry args={[0.48, 0.05, 0.08]} />
            </mesh>
            <mesh position={[0.46, FLOOR_Y + 0.045, 0]} material={MAT.device}>
              <sphereGeometry args={[0.045, 10, 10]} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
