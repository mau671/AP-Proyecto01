import { LinkIcon, LockIcon, UnlockIcon } from 'lucide-react'

import type { CourseStatus, CurriculumCourse } from '@/lib/curriculum-data'
import { cn } from '@/lib/utils'

export type RelationType = 'prerequisite' | 'corequisite' | 'postrequisite' | null

const statusConfig: Record<CourseStatus, { bgClassName: string; borderClassName: string }> = {
  approved: { bgClassName: 'bg-emerald-500/20', borderClassName: 'border-emerald-500/30 hover:border-emerald-500/50' },
  failed: { bgClassName: 'bg-red-500/20', borderClassName: 'border-red-500/30 hover:border-red-500/50' },
  not_taken: { bgClassName: 'bg-muted', borderClassName: 'border-border hover:border-muted-foreground/30' },
  withdrawn: { bgClassName: 'bg-amber-500/20', borderClassName: 'border-amber-500/30 hover:border-amber-500/50' },
  in_progress: { bgClassName: 'bg-blue-500/20', borderClassName: 'border-blue-500/30 hover:border-blue-500/50' },
}

const relationConfig: Record<Exclude<RelationType, null>, { ringClass: string; icon: React.ReactNode }> = {
  prerequisite: { ringClass: 'ring-2 ring-amber-500 shadow-md', icon: <LockIcon className="size-3 text-amber-600" /> },
  corequisite: { ringClass: 'ring-2 ring-blue-500 shadow-md', icon: <LinkIcon className="size-3 text-blue-600" /> },
  postrequisite: { ringClass: 'ring-2 ring-emerald-500 shadow-md', icon: <UnlockIcon className="size-3 text-emerald-600" /> },
}

export function CurriculumCourseCard({
  course,
  isHovered,
  relationType,
}: {
  course: CurriculumCourse
  isHovered: boolean
  relationType?: RelationType
}) {
  const config = statusConfig[course.status]
  const relation = relationType ? relationConfig[relationType] : null

  return (
    <div
      className={cn(
        'relative cursor-pointer overflow-hidden rounded-lg border-2 shadow-sm transition-all duration-200',
        config.borderClassName,
        isHovered && 'ring-primary z-10 scale-105 shadow-lg ring-2',
        relation?.ringClass,
        !isHovered && !relationType && 'hover:border-primary/50',
      )}
    >
      {relation ? (
        <div className="absolute -right-1 -top-1 z-20 rounded-full border border-border bg-background p-1 shadow-sm">
          {relation.icon}
        </div>
      ) : null}

      <div className="border-b border-border bg-card px-3 py-2">
        <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
          <span className="min-w-[3ch] text-right">{course.credits} cr</span>
          <span className="flex-1 px-2 text-center font-semibold">{course.code}</span>
          <span className="min-w-[4ch] text-left">{course.hours} h</span>
        </div>
      </div>

      <div className={cn('relative flex min-h-16 items-center justify-center px-3 py-2 text-center', config.bgClassName)}>
        <h3 className="line-clamp-2 w-full text-xs font-semibold leading-tight text-foreground">{course.name}</h3>
      </div>
    </div>
  )
}
