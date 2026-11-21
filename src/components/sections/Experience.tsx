import { experience, sections } from '@/data/content'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'

export function Experience() {
  const { experience: copy } = sections

  return (
    <section id="experience" className="container-x scroll-mt-24 py-section">
      <SectionHeading title={copy.title} lead={copy.lead} />

      <RevealGroup className="flex flex-col divide-y divide-border border-y border-border" stagger={0.06}>
        {experience.map((item) => (
          <RevealItem
            key={`${item.role}-${item.org}`}
            className="grid gap-4 py-8 md:grid-cols-12 md:gap-8"
          >
            <div className="md:col-span-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                {item.kind}
              </span>
              <p className="mt-2 text-sm text-muted">{item.period}</p>
            </div>
            <div className="md:col-span-8">
              <h3 className="text-xl font-semibold text-heading">{item.role}</h3>
              <p className="mt-1 text-body">{item.org}</p>
              <ul className="mt-4 flex flex-col gap-2">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-body">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
