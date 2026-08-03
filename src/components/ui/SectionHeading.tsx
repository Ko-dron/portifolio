import { Reveal } from './Reveal'

interface SectionHeadingProps {
  index: string
  title: string
  lead?: string
}

/**
 * Editorial section header: large numeric index, oversized heading, optional
 * lead line, and a hairline divider.
 */
export function SectionHeading({ index, title, lead }: SectionHeadingProps) {
  return (
    <header className="mb-14 md:mb-20">
      <Reveal>
        <span className="section-index">{index}</span>
      </Reveal>
      <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <Reveal delay={0.05}>
          <h2 className="text-display-md font-semibold text-heading">{title}</h2>
        </Reveal>
        {lead && (
          <Reveal delay={0.12}>
            <p className="max-w-md text-balance text-body md:text-right">{lead}</p>
          </Reveal>
        )}
      </div>
      <Reveal delay={0.15}>
        <div className="hairline mt-8" />
      </Reveal>
    </header>
  )
}
