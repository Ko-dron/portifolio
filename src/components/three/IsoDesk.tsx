import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, RoundedBox, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { clamp, lerp } from '@/lib/utils'

interface IsoDeskProps {
  reduced: boolean
}

/* Palette — strictly the requested set, kept dark. */
const C = {
  base: '#161616',
  panelDark: '#0f0f0f',
  deskTop: '#211f1d', // warm-dark neutral
  deskEdge: '#2a2724',
  metal: '#2c2c2c',
  device: '#1b1b1b',
  keycap: '#242424',
  white: '#faf9f7',
  accent: '#df2531',
} as const

/**
 * The 3D centerpiece: a stylised low-poly **isometric coding desk**.
 * Monitor + laptop screens glow in the accent red (picked up by the bloom pass),
 * a desk lamp casts a warm pool, and a chair sits in front. The whole rig:
 *   • auto-rotates slowly on Y,
 *   • parallax-tilts toward the pointer,
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

    // Slow auto-rotation.
    g.rotation.y = -0.5 + Math.sin(state.clock.elapsedTime * 0.12) * 0.25

    // Pointer parallax (eased).
    tilt.current.x = lerp(tilt.current.x, state.pointer.y * 0.12, 0.05)
    tilt.current.y = lerp(tilt.current.y, state.pointer.x * 0.18, 0.05)
    g.rotation.x = tilt.current.x
    g.rotation.z = -tilt.current.y * 0.15

    // Scroll-linked drift + scale.
    g.position.y = scroll * 1.6
    g.scale.setScalar(1 - scroll * 0.22)
  })

  return (
    <>
      <Float
        speed={reduced ? 0 : 1}
        rotationIntensity={reduced ? 0 : 0.12}
        floatIntensity={reduced ? 0 : 0.4}
      >
        <group ref={group} rotation={[0, -0.5, 0]} position={[0, 0, 0]}>
          <DeskAssembly />
        </group>
      </Float>

      {/* Soft grounding shadow. */}
      <ContactShadows
        position={[0, -1.15, 0]}
        opacity={0.55}
        scale={12}
        blur={2.6}
        far={4}
        resolution={512}
        color="#000000"
      />
    </>
  )
}

/* ── The desk and everything on it ─────────────────────────────────────── */

/**
 * Layout note: the desk top is 4.6 × 2.3 and its *surface* sits at y = 0.08
 * (a 0.16-thick slab centred on 0). Every prop below is positioned so it rests
 * on that surface — not sunk into it — and so no two props overlap in plan
 * view. Back row: lamp, monitor. Right: laptop (lid hinged, mug well clear of
 * its sweep). Front row: books, keyboard, mouse, plant.
 */
const DESK_Y = 0.08

function DeskAssembly() {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Floor platform */}
      <RoundedBox args={[7, 0.4, 5.6]} radius={0.12} smoothness={3} position={[0, -1, 0]}>
        <meshStandardMaterial color={C.base} roughness={0.9} metalness={0.1} />
      </RoundedBox>
      {/* Rug hint under the desk */}
      <mesh position={[0, -0.79, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.4, 3]} />
        <meshStandardMaterial color={C.deskEdge} roughness={1} />
      </mesh>

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

function Desk() {
  return (
    <group>
      {/* Table top */}
      <RoundedBox args={[4.6, 0.16, 2.3]} radius={0.05} smoothness={3} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color={C.deskTop} roughness={0.55} metalness={0.2} />
      </RoundedBox>
      {/* Legs */}
      {[
        [-2.1, -0.6, -0.95],
        [2.1, -0.6, -0.95],
        [-2.1, -0.6, 0.95],
        [2.1, -0.6, 0.95],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <boxGeometry args={[0.14, 1.2, 0.14]} />
          <meshStandardMaterial color={C.metal} roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function Monitor() {
  // Slight yaw so the glowing screen angles toward the iso camera.
  return (
    <group position={[-0.55, 0, -0.6]} rotation={[0, 0.28, 0]}>
      {/* Stand base + neck */}
      <mesh position={[0, DESK_Y + 0.02, 0]} castShadow>
        <boxGeometry args={[0.8, 0.04, 0.42]} />
        <meshStandardMaterial color={C.metal} roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.5, -0.02]} castShadow>
        <boxGeometry args={[0.1, 0.7, 0.08]} />
        <meshStandardMaterial color={C.metal} roughness={0.4} metalness={0.7} />
      </mesh>
      {/* Bezel */}
      <RoundedBox args={[2.1, 1.25, 0.09]} radius={0.04} smoothness={2} position={[0, 1.15, 0.02]} castShadow>
        <meshStandardMaterial color={C.panelDark} roughness={0.5} metalness={0.4} />
      </RoundedBox>
      {/* Glowing screen */}
      <mesh position={[0, 1.15, 0.072]}>
        <planeGeometry args={[1.92, 1.08]} />
        <meshStandardMaterial
          color={C.base}
          emissive={C.accent}
          emissiveIntensity={0.35}
          roughness={0.3}
        />
      </mesh>
      {/* Code lines (emissive) */}
      <CodeLines />
    </group>
  )
}

/** A little block of faux code on the monitor screen. */
function CodeLines() {
  // [xOffset, y, width, color]
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

function Laptop() {
  return (
    <group position={[1.45, DESK_Y + 0.025, 0.16]} rotation={[0, 0.55, 0]}>
      {/* Base */}
      <RoundedBox args={[1.25, 0.05, 0.85]} radius={0.03} smoothness={2} castShadow>
        <meshStandardMaterial color={C.device} roughness={0.4} metalness={0.6} />
      </RoundedBox>
      {/* Trackpad + keys hint */}
      <mesh position={[0, 0.027, 0.22]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 0.32]} />
        <meshStandardMaterial color={C.keycap} roughness={0.6} />
      </mesh>
      {/*
        Screen, hinged at the back edge of the base. -0.3 rad ≈ 17° of recline:
        an open-laptop pose. (It used to be -1.15 rad — around 66° — which laid
        the lid almost flat across the desk and straight through the mug.) The
        group's +0.55 yaw matches the monitor's, so the lit panel angles toward
        the isometric camera instead of turning its back to it.
      */}
      <group position={[0, 0, -0.42]} rotation={[-0.3, 0, 0]}>
        <RoundedBox args={[1.25, 0.82, 0.04]} radius={0.03} smoothness={2} position={[0, 0.41, 0]} castShadow>
          <meshStandardMaterial color={C.panelDark} roughness={0.5} metalness={0.4} />
        </RoundedBox>
        <mesh position={[0, 0.41, 0.024]}>
          <planeGeometry args={[1.12, 0.7]} />
          <meshStandardMaterial color={C.base} emissive={C.accent} emissiveIntensity={0.4} roughness={0.3} />
        </mesh>
      </group>
    </group>
  )
}

function Keyboard() {
  return (
    <group position={[-0.55, DESK_Y + 0.03, 0.55]}>
      <RoundedBox args={[1.5, 0.06, 0.5]} radius={0.02} smoothness={2} castShadow>
        <meshStandardMaterial color={C.device} roughness={0.6} metalness={0.3} />
      </RoundedBox>
      {/* Accent underglow strip along the front */}
      <mesh position={[0, 0.005, 0.27]}>
        <boxGeometry args={[1.4, 0.02, 0.02]} />
        <meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
      {/* Key grid hint */}
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.36, 0.4]} />
        <meshStandardMaterial color={C.keycap} roughness={0.7} />
      </mesh>
    </group>
  )
}

function Mouse() {
  // Rotated onto its side so the capsule reads as a mouse lying on the desk
  // rather than a pill standing upright.
  return (
    <mesh position={[0.55, DESK_Y + 0.075, 0.62]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <capsuleGeometry args={[0.075, 0.11, 4, 12]} />
      <meshStandardMaterial color={C.device} roughness={0.5} metalness={0.4} />
    </mesh>
  )
}

function Mug() {
  return (
    <group position={[2.0, DESK_Y + 0.16, -0.85]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.15, 0.13, 0.32, 16]} />
        <meshStandardMaterial color={C.white} roughness={0.5} />
      </mesh>
      {/* Accent band */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.153, 0.153, 0.08, 16]} />
        <meshStandardMaterial color={C.accent} roughness={0.5} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.17, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
        <meshStandardMaterial color={C.white} roughness={0.5} />
      </mesh>
    </group>
  )
}

function Lamp() {
  return (
    <group position={[-1.95, DESK_Y + 0.03, -0.35]}>
      {/* Base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.22, 0.06, 20]} />
        <meshStandardMaterial color={C.metal} roughness={0.4} metalness={0.7} />
      </mesh>
      {/* Lower arm */}
      <mesh position={[0.09, 0.52, 0.06]} rotation={[-0.12, 0, -0.2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.05, 8]} />
        <meshStandardMaterial color={C.metal} roughness={0.4} metalness={0.7} />
      </mesh>
      {/* Upper arm — reaches forward over the desk, not sideways into the
          monitor. */}
      <mesh position={[0.37, 0.98, 0.24]} rotation={[-0.35, 0, 0.75]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color={C.metal} roughness={0.4} metalness={0.7} />
      </mesh>
      {/* Head */}
      <group position={[0.6, 1.0, 0.36]} rotation={[0.75, 0, 0.45]}>
        <mesh castShadow>
          <coneGeometry args={[0.16, 0.26, 20, 1, true]} />
          <meshStandardMaterial color={C.metal} roughness={0.4} metalness={0.7} side={THREE.DoubleSide} />
        </mesh>
        {/* Cap the cone's open top so the shade doesn't read as a hollow V. */}
        <mesh position={[0, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.032, 16]} />
          <meshStandardMaterial color={C.metal} roughness={0.4} metalness={0.7} side={THREE.DoubleSide} />
        </mesh>
        {/* Glowing bulb */}
        <mesh position={[0, -0.06, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>
      {/* Warm pool of light on the desk */}
      <pointLight position={[0.62, 0.78, 0.44]} intensity={6} distance={4} color="#ff5a5f" />
    </group>
  )
}

function Books() {
  const stack: Array<[number, number, string]> = [
    [0.0, 0.045, C.accent],
    [0.06, 0.145, C.white],
    [-0.03, 0.245, C.metal],
  ]
  return (
    <group position={[-1.88, DESK_Y, 0.62]} rotation={[0, 0.3, 0]}>
      {stack.map(([dx, y, color], i) => (
        <mesh key={i} position={[dx, y, 0]} castShadow>
          <boxGeometry args={[0.7, 0.09, 0.5]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * A small desk plant. It sits in the pocket between the monitor stand and the
 * laptop — the one spot on the top that nothing else claims — kept deliberately
 * compact so it reads as desk clutter rather than competing with the screens.
 */
function Plant() {
  return (
    <group position={[0.3, DESK_Y + 0.13, 0.02]}>
      {/* Pot */}
      <mesh castShadow>
        <cylinderGeometry args={[0.14, 0.11, 0.26, 16]} />
        <meshStandardMaterial color={C.accent} roughness={0.7} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.03, 16]} />
        <meshStandardMaterial color={C.deskEdge} roughness={0.8} />
      </mesh>
      {/* Foliage — desaturated greys keep it on-palette against the reds */}
      {[
        [0, 0.26, 0, 0.15],
        [0.09, 0.36, 0.04, 0.115],
        [-0.09, 0.34, -0.04, 0.105],
        [0.02, 0.44, 0.02, 0.09],
      ].map((s, i) => (
        <mesh key={i} position={[s[0], s[1], s[2]]} castShadow>
          <sphereGeometry args={[s[3], 12, 12]} />
          <meshStandardMaterial color="#333331" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Chair() {
  return (
    <group position={[-0.2, 0, 1.85]}>
      {/* Seat */}
      <RoundedBox args={[1.1, 0.12, 1.0]} radius={0.06} smoothness={2} position={[0, -0.35, 0]} castShadow>
        <meshStandardMaterial color={C.device} roughness={0.6} metalness={0.2} />
      </RoundedBox>
      {/* Backrest */}
      <RoundedBox args={[1.1, 1.15, 0.14]} radius={0.08} smoothness={2} position={[0, 0.3, 0.5]} castShadow>
        <meshStandardMaterial color={C.device} roughness={0.6} metalness={0.2} />
      </RoundedBox>
      {/* Accent piping on the backrest */}
      <mesh position={[0, 0.3, 0.58]}>
        <boxGeometry args={[0.9, 0.03, 0.02]} />
        <meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      {/* Center post */}
      <mesh position={[0, -0.8, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.7, 12]} />
        <meshStandardMaterial color={C.metal} roughness={0.4} metalness={0.7} />
      </mesh>
      {/* Five-star base */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.28, -1.13, Math.sin(a) * 0.28]}
            rotation={[0, -a, 0]}
            castShadow
          >
            <boxGeometry args={[0.5, 0.06, 0.08]} />
            <meshStandardMaterial color={C.metal} roughness={0.4} metalness={0.7} />
          </mesh>
        )
      })}
    </group>
  )
}
