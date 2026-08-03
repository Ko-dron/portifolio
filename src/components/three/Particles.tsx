import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticlesProps {
  count?: number
  reduced: boolean
}

/**
 * A faint field of background points for depth. Deliberately low-count and
 * slow-drifting so it reads as atmosphere, not decoration. Uses a single
 * BufferGeometry of points (cheap) rather than instanced meshes.
 */
export function Particles({ count = 260, reduced }: ParticlesProps) {
  const points = useRef<THREE.Points>(null)

  // Deterministic-ish random cloud inside a spherical shell.
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi) - 2
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (reduced || !points.current) return
    points.current.rotation.y += delta * 0.015
    points.current.rotation.x += delta * 0.005
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#df2531"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
