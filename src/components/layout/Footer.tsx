import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react'
import { profile, socials, meta, whatsappUrl } from '@/data/content'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { useSmoothScroll } from './ScrollProvider'

export function Footer() {
  const { scrollTo } = useSmoothScroll()

  const links = [
    { label: 'Email', href: `mailto:${socials.email}`, icon: Mail },
    { label: 'GitHub', href: socials.github, icon: Github },
    { label: 'LinkedIn', href: socials.linkedin, icon: Linkedin },
    { label: 'WhatsApp', href: whatsappUrl, icon: WhatsAppIcon },
  ]

  return (
    <footer className="border-t border-border">
      <div className="container-x flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-heading">
            {profile.name}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            {meta.builtWith} · © {meta.year}
          </p>
        </div>

        <div className="flex items-center gap-5">
          {links.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={label}
              className="text-body transition-colors duration-300 hover:text-accent"
            >
              <Icon size={20} strokeWidth={1.6} />
            </a>
          ))}

          <button
            type="button"
            onClick={() => scrollTo(0)}
            aria-label="Back to top"
            className="ml-2 flex h-10 w-10 items-center justify-center rounded-full border border-border text-body transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  )
}
