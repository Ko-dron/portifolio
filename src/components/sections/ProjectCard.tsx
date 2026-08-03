import { ArrowUpRight, Github } from 'lucide-react'
import type { Project } from '@/data/content'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  /** Fixed-width variant for the horizontal track vs. fluid for the stack. */
  variant?: 'horizontal' | 'stacked'
}

/**
 * A single project card. Hover: subtle lift, preview scale, and the arrow
 * shifts. The preview is a marked gradient placeholder until a real screenshot
 * is supplied via `project.image`.
 */
export function ProjectCard({ project, variant = 'stacked' }: ProjectCardProps) {
  const Icon = project.icon

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="hover"
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 transition-all duration-500 ease-expo hover:-translate-y-1 hover:border-accent-dim',
        variant === 'horizontal' ? 'h-full w-[80vw] shrink-0 sm:w-[62vw] lg:w-[38vw]' : 'w-full',
      )}
      aria-label={`${project.title} — open on GitHub`}
    >
      {/* Preview */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-base">
        {project.image ? (
          <img
            src={project.image}
            alt={`Screenshot of the ${project.title} project`}
            className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          // PREVIEW PLACEHOLDER — swap for a real screenshot via project.image.
          <div className="relative h-full w-full" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-br from-surface-2 via-surface to-base transition-transform duration-700 ease-expo group-hover:scale-105" />
            <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,theme(colors.body)_1px,transparent_0)] [background-size:22px_22px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon size={44} strokeWidth={1} className="text-muted transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>
        )}

        {/* Category chip */}
        <span className="absolute left-4 top-4 rounded-full border border-border bg-base/80 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted backdrop-blur">
          {project.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-heading">{project.title}</h3>
          <ArrowUpRight
            size={22}
            className="shrink-0 text-muted transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          />
        </div>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-body">{project.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-sm text-muted transition-colors group-hover:text-accent">
          <Github size={16} />
          <span className="font-mono text-xs">Ko-dron/{project.repo}</span>
        </div>
      </div>
    </a>
  )
}
