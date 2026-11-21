import type { ReactNode } from 'react'
import { useMagnetic } from '@/hooks/useMagnetic'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ghost'

interface BaseProps {
  children: ReactNode
  className?: string
  variant?: Variant
  strength?: number
}

interface LinkProps extends BaseProps {
  href: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  target?: string
  rel?: string
  download?: boolean | string
}

interface ButtonProps extends BaseProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-heading text-base hover:bg-white',
  ghost:
    'border border-border bg-transparent text-heading hover:border-accent hover:text-accent',
}

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300 will-change-transform'

/**
 * A pill button/link with a magnetic hover pull. The inner span gets an
 * opposing micro-shift so the label feels like it lags behind the shell —
 * a subtle premium touch. Renders <a> when `href` is provided, else <button>.
 */
export function MagneticButton(props: LinkProps | ButtonProps) {
  const { children, className, variant = 'primary', strength = 0.35 } = props
  const ref = useMagnetic<HTMLAnchorElement & HTMLButtonElement>({ strength })

  const classes = cn(base, variantClasses[variant], className)
  const inner = (
    <span className="relative z-10 flex items-center gap-2 transition-transform duration-500 ease-expo group-hover:-translate-y-px">
      {children}
    </span>
  )

  if ('href' in props) {
    return (
      <a
        ref={ref}
        href={props.href}
        onClick={props.onClick}
        target={props.target}
        rel={props.rel}
        download={props.download}
        className={classes}
        data-cursor="hover"
      >
        {inner}
      </a>
    )
  }

  return (
    <button
      ref={ref}
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classes}
      data-cursor="hover"
    >
      {inner}
    </button>
  )
}
