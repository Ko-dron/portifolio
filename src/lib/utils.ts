/** Tiny classNames helper — filters falsy values and joins with spaces. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/** Clamp a number to the [min, max] range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Linear interpolation between a and b by t (0..1). */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
