import { ArrowUpRight, Github, UserRound } from 'lucide-react'
import type { Project } from '@/data/content'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  /** horizontal = fixed width for the pinned track; stacked = fluid; compact = supporting grid. */
  variant?: 'horizontal' | 'stacked' | 'compact'
}

/**
 * Project card: preview (screenshot, terminal mock for CLI tools, or icon
 * placeholder), summary, role, stack, and separate Live / GitHub links.
 */
export function ProjectCard({ project, variant = 'stacked' }: ProjectCardProps) {
  const compact = variant === 'compact'

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 transition-[border-color,transform] duration-500 ease-expo hover:-translate-y-1 hover:border-accent-dim',
        variant === 'horizontal' ? 'max-h-[86svh] w-[80vw] shrink-0 sm:w-[62vw] lg:w-[40vw]' : 'h-full w-full',
      )}
    >
      <Preview project={project} />

      <div className={cn('flex flex-1 flex-col', compact ? 'p-5' : 'p-6')}>
        <h3 className={cn('font-semibold text-heading', compact ? 'text-lg' : 'text-xl')}>
          {project.title}
        </h3>

        <p
          className={cn(
            'mt-3 flex-1 text-sm leading-relaxed text-body',
            variant === 'horizontal' && 'line-clamp-5',
          )}
        >
          {project.summary}
        </p>

        {project.role && (
          <p className="mt-4 flex items-center gap-2 text-xs text-muted">
            <UserRound size={14} aria-hidden="true" />
            <span>
              <span className="sr-only">Role: </span>
              {project.role}
            </span>
          </p>
        )}

        <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Stack">
          {project.stack.map((s) => (
            <li key={s}>
              <Tag>{s}</Tag>
            </li>
          ))}
        </ul>

        {(project.liveUrl || project.repoUrl) && (
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-sm">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="inline-flex items-center gap-1.5 text-heading transition-colors hover:text-accent"
              >
                Live site
                <ArrowUpRight size={15} aria-hidden="true" />
                <span className="sr-only">for {project.title} (opens in a new tab)</span>
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="inline-flex items-center gap-1.5 text-body transition-colors hover:text-accent"
              >
                <Github size={15} aria-hidden="true" />
                GitHub
                <span className="sr-only">repository for {project.title} (opens in a new tab)</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

function Preview({ project }: { project: Project }) {
  const Icon = project.icon
  return (
    <div className="relative aspect-[16/9] shrink-0 overflow-hidden border-b border-border bg-base">
      {project.image ? (
        <img
          src={project.image}
          alt={`Screenshot of ${project.title}`}
          width={1440}
          height={900}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-expo group-hover:scale-[1.03]"
        />
      ) : project.terminal ? (
        <div
          className="flex h-full w-full flex-col bg-[#0b0d10] font-mono text-[0.7rem] leading-relaxed sm:text-xs"
          role="img"
          aria-label={`Terminal output from ${project.title}`}
        >
          <div className="flex items-center justify-end gap-1.5 px-4 py-2.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <pre className="flex-1 overflow-hidden whitespace-pre px-4 pb-4 pt-8 text-[#9fb3a6]" aria-hidden="true">
            {project.terminal.map((line, i) => (
              <div key={i} className={i === 0 ? 'text-heading' : undefined}>
                {line}
              </div>
            ))}
          </pre>
        </div>
      ) : (
        <div className="relative h-full w-full" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-surface-2 via-surface to-base" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,theme(colors.body)_1px,transparent_0)] [background-size:22px_22px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon size={44} strokeWidth={1} className="text-muted" />
          </div>
        </div>
      )}

      <span className="absolute left-4 top-4 rounded-full border border-border bg-base/80 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted backdrop-blur">
        {project.category}
      </span>
    </div>
  )
}
