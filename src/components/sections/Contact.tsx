import { useState } from 'react'
import { ArrowUpRight, FileDown, Github, Linkedin, Mail, Phone } from 'lucide-react'
import { cvUrl, sections, socials, whatsappUrl } from '@/data/content'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

/**
 * Contact section. The form posts to Web3Forms (free, no server to run) when
 * `VITE_WEB3FORMS_KEY` is set — get a key at https://web3forms.com and add it
 * to `.env.local` locally and to the host's environment variables (Vercel →
 * Settings → Environment Variables). Without a key it falls back to opening
 * the visitor's mail app via `mailto:`.
 */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function Contact() {
  const { contact } = sections
  const [form, setForm] = useState({ name: '', email: '', message: '', botcheck: '' })
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!WEB3FORMS_KEY) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${form.name || 'someone'}`)
      const body = encodeURIComponent(
        `${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ''}`,
      )
      window.location.href = `mailto:${socials.email}?subject=${subject}&body=${body}`
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio enquiry from ${form.name}`,
          from_name: 'Portfolio contact form',
          name: form.name,
          email: form.email,
          message: form.message,
          botcheck: form.botcheck,
        }),
      })
      const data = (await res.json()) as { success?: boolean }
      if (!res.ok || !data.success) throw new Error('Submit failed')
      setStatus('sent')
      setForm({ name: '', email: '', message: '', botcheck: '' })
    } catch {
      setStatus('error')
    }
  }

  const contactLinks = [
    { label: 'Email', value: socials.email, href: `mailto:${socials.email}`, icon: Mail },
    { label: 'GitHub', value: 'Ko-dron', href: socials.github, icon: Github },
    {
      label: 'LinkedIn',
      value: 'stanley-ansong',
      href: socials.linkedin,
      icon: Linkedin,
    },
    {
      label: 'WhatsApp',
      value: socials.whatsappDisplay,
      href: whatsappUrl,
      icon: WhatsAppIcon,
    },
    { label: 'CV', value: 'Download PDF', href: cvUrl, icon: FileDown },
    ...(socials.phonePublic
      ? [{ label: 'Phone', value: socials.phone, href: `tel:${socials.phone}`, icon: Phone }]
      : []),
  ]

  return (
    <section id="contact" className="container-x scroll-mt-24 py-section">
      <SectionHeading title={contact.title} lead={contact.lead} />

      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        {/* Left: pitch + direct links */}
        <div>
          <Reveal>
            <p className="text-balance text-3xl font-semibold leading-tight text-heading md:text-4xl">
              Let&rsquo;s work together.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 max-w-md leading-relaxed text-body">{contact.closing}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <MagneticButton href={`mailto:${socials.email}`}>
                <Mail size={16} />
                {socials.email}
              </MagneticButton>
              <MagneticButton href={whatsappUrl} variant="ghost">
                <WhatsAppIcon size={16} />
                WhatsApp
              </MagneticButton>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="mt-10 flex flex-col divide-y divide-border border-t border-border">
              {contactLinks.map(({ label, value, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group flex items-center justify-between py-4 text-body transition-colors hover:text-heading"
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={18} className="text-muted group-hover:text-accent" />
                      <span className="text-sm text-muted">{label}</span>
                    </span>
                    <span className="flex items-center gap-2 text-sm">
                      {value}
                      <ArrowUpRight
                        size={16}
                        className="text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Right: quick message form (mailto-based, no backend) */}
        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 rounded-2xl border border-border bg-surface/50 p-6 md:p-8"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs uppercase tracking-[0.15em] text-muted">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="rounded-lg border border-border bg-base px-4 py-3 text-heading outline-none transition-colors placeholder:text-muted focus:border-accent"
                placeholder="Your name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs uppercase tracking-[0.15em] text-muted">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="rounded-lg border border-border bg-base px-4 py-3 text-heading outline-none transition-colors placeholder:text-muted focus:border-accent"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-xs uppercase tracking-[0.15em] text-muted">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="resize-none rounded-lg border border-border bg-base px-4 py-3 text-heading outline-none transition-colors placeholder:text-muted focus:border-accent"
                placeholder="What would you like to build?"
              />
            </div>

            {/* Honeypot: hidden from people, filled in by spam bots. */}
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
              checked={form.botcheck === 'on'}
              onChange={(e) => setForm((f) => ({ ...f, botcheck: e.target.checked ? 'on' : '' }))}
            />

            <button
              type="submit"
              data-cursor="hover"
              disabled={status === 'sending'}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-heading px-6 py-3 text-sm font-medium text-base transition-colors duration-300 hover:bg-white disabled:cursor-wait disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
              <ArrowUpRight size={16} aria-hidden="true" />
            </button>
            <p className="text-center text-xs text-muted" role="status" aria-live="polite">
              {status === 'sent'
                ? 'Thanks — your message is on its way. I’ll reply by email.'
                : status === 'error'
                  ? `Something went wrong. Please email me directly at ${socials.email}.`
                  : WEB3FORMS_KEY
                    ? 'Your message goes straight to my inbox.'
                    : 'Opens in your mail app.'}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
