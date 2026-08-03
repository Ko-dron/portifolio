import { sections, skillGroups } from '@/data/content'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'

export function Skills() {
  const { skills } = sections

  return (
    <section id="skills" className="container-x scroll-mt-24 py-section">
      <SectionHeading index={skills.index} title={skills.title} lead={skills.lead} />

      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
        {skillGroups.map((group) => {
          const Icon = group.icon
          return (
            <RevealItem
              key={group.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 transition-colors duration-500 hover:border-accent-dim"
            >
              {/* subtle hover glow */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-base text-accent transition-colors duration-500 group-hover:border-accent-dim">
                <Icon size={20} strokeWidth={1.6} />
              </div>

              <h3 className="text-lg font-semibold text-heading">{group.title}</h3>

              <ul className="mt-4 flex flex-col gap-2.5">
                {group.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2.5 text-sm text-body">
                    <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
                    {skill}
                  </li>
                ))}
              </ul>
            </RevealItem>
          )
        })}
      </RevealGroup>
    </section>
  )
}
