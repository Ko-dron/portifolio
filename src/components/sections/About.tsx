import { GraduationCap, MapPin } from 'lucide-react'
import { profile, sections, topSkills } from '@/data/content'
import portrait from '@/assets/profile-pic.jpg'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { Tag } from '@/components/ui/Tag'

export function About() {
  const { about } = sections

  return (
    <section id="about" className="container-x scroll-mt-24 py-section">
      <SectionHeading title={about.title} lead={about.lead} />

      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        {/* Portrait */}
        <div className="md:col-span-4">
          <Reveal>
            <figure className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface">
              <img
                src={portrait}
                alt={`Portrait of ${profile.name}`}
                width={828}
                height={1280}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-expo group-hover:scale-[1.04]"
              />
              {/* Bottom scrim so the caption stays legible over the photo. */}
              <div
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-base/90 to-transparent"
                aria-hidden="true"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 border-t border-border bg-base/70 px-4 py-3 text-sm text-body backdrop-blur">
                {profile.name}
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* Story */}
        <div className="md:col-span-8">
          <Reveal>
            <p className="text-balance text-2xl leading-snug text-heading md:text-3xl">
              Cybersecurity is my core. AI is my specialty.
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="mt-6 max-w-2xl leading-relaxed text-body">{profile.bio}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-4 max-w-2xl leading-relaxed text-body">
              During my CodeAlpha cybersecurity internship I built a packet sniffer, wrote Suricata
              intrusion-detection rules and designed phishing-awareness training. At NASA Space Apps
              2026 I helped build Evexia, a health console for astronaut crews. I also lead the Audit
              Committee of the Computer Science Society at KNUST.
            </p>
          </Reveal>

          {/* Top-skill highlights */}
          <Reveal delay={0.15}>
            <div className="mt-8">
              <span className="mb-3 block font-mono text-xs uppercase tracking-[0.2em] text-muted">
                Top strengths
              </span>
              <div className="flex flex-wrap gap-2">
                {topSkills.map((s) => (
                  <Tag key={s} className="border-accent-dim/60 text-accent-soft">
                    {s}
                  </Tag>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Meta cards */}
          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2">
            <RevealItem className="rounded-xl border border-border bg-surface/60 p-5">
              <div className="flex items-center gap-2 text-accent">
                <GraduationCap size={18} />
                <span className="text-xs uppercase tracking-[0.15em] text-muted">Education</span>
              </div>
              <p className="mt-3 font-medium text-heading">{profile.education.degree}</p>
              <p className="mt-1 text-sm text-body">{profile.education.school}</p>
              <p className="mt-1 text-sm text-muted">
                {profile.education.city} · {profile.education.period}
              </p>
            </RevealItem>

            <RevealItem className="rounded-xl border border-border bg-surface/60 p-5">
              <div className="flex items-center gap-2 text-accent">
                <MapPin size={18} />
                <span className="text-xs uppercase tracking-[0.15em] text-muted">Based in</span>
              </div>
              <p className="mt-3 font-medium text-heading">{profile.location}</p>
              <p className="mt-1 text-sm text-body">
                Open to security and AI internships, on-site or remote.
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
