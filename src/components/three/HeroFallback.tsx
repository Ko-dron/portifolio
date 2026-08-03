/**
 * Pure-CSS stand-in for the 3D hero — shown as the Suspense fallback while the
 * WebGL scene loads (and a graceful degrade if WebGL is unavailable). A soft
 * glowing orb that matches the palette.
 */
export function HeroFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div className="relative h-64 w-64 md:h-80 md:w-80">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-soft via-accent to-accent-dim opacity-30 blur-3xl" />
        <div className="absolute inset-6 rounded-full border border-border/60" />
        <div className="absolute inset-12 rounded-full border border-border/40" />
      </div>
    </div>
  )
}
