import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

/**
 * Understated postprocessing: a soft mipmap bloom to give the material's
 * highlights a premium glow, plus a gentle vignette to focus the eye. Kept low
 * so it reads as elegant, not flashy. Skipped entirely on low-power devices via
 * the `enabled` gate from the parent Scene.
 */
export function Effects() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.55}
        luminanceThreshold={0.72}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.28} darkness={0.72} />
    </EffectComposer>
  )
}
