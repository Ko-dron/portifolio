import { BadgeCheck } from 'lucide-react'
import { certifications, sections } from '@/data/content'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'

export function Certifications() {
  const { certifications: copy } = sections

  return (
    <section id="certifications" className="container-x scroll-mt-24 py-section">
      <SectionHeading title={copy.title} lead={copy.lead} />

      <RevealGroup className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border" stagger={0.06}>
        {certifications.map((cert) => (
          <RevealItem
            key={cert.title}
            className="group flex items-center gap-5 bg-surface/60 p-6 transition-colors duration-300 hover:bg-surface-2"
          >
            <BadgeCheck
              size={22}
              className="shrink-0 text-accent transition-transform duration-300 group-hover:scale-110"
            />
            <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-medium text-heading">{cert.title}</span>
              <span className="text-sm text-muted">{cert.issuer}</span>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
