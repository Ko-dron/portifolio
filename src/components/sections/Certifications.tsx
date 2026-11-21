import { BadgeCheck } from 'lucide-react'
import { certificationGroups, sections } from '@/data/content'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'

export function Certifications() {
  const { certifications: copy } = sections

  return (
    <section id="certifications" className="container-x scroll-mt-24 py-section">
      <SectionHeading title={copy.title} lead={copy.lead} />

      <div className="flex flex-col gap-12">
        {certificationGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {group.title}
            </h3>
            <RevealGroup
              className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border"
              stagger={0.05}
            >
              {group.items.map((cert) => (
                <RevealItem
                  key={cert.title}
                  className="group flex items-center gap-5 bg-surface/60 p-5 transition-colors duration-300 hover:bg-surface-2 md:p-6"
                >
                  <BadgeCheck
                    size={22}
                    aria-hidden="true"
                    className="shrink-0 text-accent transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                    <span className="font-medium text-heading">{cert.title}</span>
                    <span className="shrink-0 text-sm text-muted">
                      {cert.issuer} · {cert.date}
                    </span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        ))}
      </div>
    </section>
  )
}
