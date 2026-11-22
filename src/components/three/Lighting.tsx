import { Environment, Lightformer } from '@react-three/drei'

/**
 * Studio lighting tuned for the isometric desk. Soft neutral key + fill for
 * clean readable forms, plus a red accent glow (matching the site accent
 * #df2531) washing in from the monitor side. Environment is built from
 * Lightformers — no external HDR fetch, works fully offline.
 */
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      {/* Key light — soft warm-white from upper-front. */}
      <directionalLight position={[5, 9, 6]} intensity={2.2} color="#fff6f0" />
      {/* Neutral fill from the opposite side to lift shadows. */}
      <directionalLight position={[-6, 4, -3]} intensity={0.6} color="#9a97ff" />
      {/* Rim / back light: a cool edge from behind and above the desk so the
          silhouettes separate from the near-black background. */}
      <directionalLight position={[-6, 1, -8]} intensity={1.2} color="#aab8ff" />
      {/* Dim red kicker from behind-left for a moody edge on the props. */}
      <directionalLight position={[-8, 0.8, 2]} intensity={0.7} color="#ff4d57" />
      {/* Red accent glow near the monitor. */}
      <pointLight position={[-1, 3, -2]} intensity={28} color="#df2531" distance={16} />
      {/* Subtle red underglow beneath the desk. */}
      <pointLight position={[0, -1.5, 2]} intensity={10} color="#df2531" distance={10} />

      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[3, 5, 4]} scale={[9, 9, 1]} />
        <Lightformer form="rect" intensity={2} color="#df2531" position={[-5, 2, -2]} scale={[6, 5, 1]} />
        <Lightformer form="circle" intensity={1.2} color="#d8d5d0" position={[0, -3, 3]} scale={[6, 6, 1]} />
      </Environment>
    </>
  )
}
