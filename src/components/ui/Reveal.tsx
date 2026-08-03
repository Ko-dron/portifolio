import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface RevealProps {
  children: ReactNode
  /** Stagger delay in seconds. */
  delay?: number
  /** Travel distance in px. */
  y?: number
  className?: string
  as?: 'div' | 'span' | 'li'
  once?: boolean
}

/**
 * Fade + translate-up on entering the viewport, with gentle stagger support.
 * Under reduced-motion the content is shown immediately with no transform.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = 'div',
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion()

  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: reduced ? 0 : delay },
    },
  }

  const MotionTag = motion[as]

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-10% 0px -10% 0px' }}
    >
      {children}
    </MotionTag>
  )
}

/**
 * Container that staggers the reveal of its `Reveal` children.
 * Use with plain children that each animate via `whileInView`, or wrap items in
 * <Reveal delay={i * 0.08}> for manual control.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode
  className?: string
  stagger?: number
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduced ? 0 : stagger } },
      }}
    >
      {children}
    </motion.div>
  )
}

/** Child item for RevealGroup — inherits the parent's stagger timing. */
export function RevealItem({
  children,
  className,
  y = 24,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  y?: number
  as?: 'div' | 'li' | 'span'
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : y },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </MotionTag>
  )
}
