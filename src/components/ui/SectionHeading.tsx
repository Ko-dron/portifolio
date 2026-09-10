import { Reveal } from './Reveal'

interface SectionHeadingProps {
  title: string
  lead?: string
}

/**
 * Editorial section header: oversized heading, optional lead line, and a
 * hairline divider.
 */
export function SectionHeading({ title, lead }: SectionHeadingProps) {
  return (
    <header className="mb-14 md:mb-20">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <h2 className="text-display-md font-semibold text-heading">{title}</h2>
        </Reveal>
        {lead && (
          <Reveal delay={0.08}>
            <p className="max-w-md text-balance text-body md:text-right">{lead}</p>
          </Reveal>
        )}
      </div>
      <Reveal delay={0.12}>
        <div className="hairline mt-8" />
      </Reveal>
    </header>
  )
}
