import { LinkIcon, LockIcon, UnlockIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { CurriculumCourse, CurriculumPlanDetail } from '@/lib/curriculum-data'

import { CurriculumCourseCard, type RelationType } from './course-card'

export function CurriculumGrid({ planDetail, zoom = 1 }: { planDetail: CurriculumPlanDetail; zoom?: number }) {
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)
  const [contentHeight, setContentHeight] = useState<number | null>(null)
  const [contentWidth, setContentWidth] = useState<number | null>(null)
  const scaledContentRef = useRef<HTMLDivElement>(null)

  const courseById = useMemo(() => {
    const courses = planDetail.periods.flatMap((period) => period.courses)
    return new Map(courses.map((course) => [course.id, course]))
  }, [planDetail.periods])

  useEffect(() => {
    const el = scaledContentRef.current
    if (!el) return

    const updateSize = () => {
      setContentHeight(el.scrollHeight)
      setContentWidth(el.scrollWidth)
    }

    const ro = new ResizeObserver(updateSize)
    ro.observe(el)
    updateSize()
    return () => ro.disconnect()
  }, [zoom, planDetail.periods])

  const getRelationType = useCallback(
    (targetId: string, courseId: string): RelationType => {
      const target = courseById.get(targetId)
      const course = courseById.get(courseId)
      if (!target || !course) return null

      if (target.prerequisites.includes(courseId)) return 'prerequisite'
      if (target.corequisites.includes(courseId)) return 'corequisite'
      if (course.prerequisites.includes(targetId)) return 'postrequisite'
      return null
    },
    [courseById],
  )

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="relative z-0 min-h-0 flex-1 overflow-x-auto overflow-y-auto">
        <div
          className="origin-top-left px-4"
          style={{
            transform: `scale(${zoom})`,
            width: contentHeight && contentWidth ? `${(contentWidth + 32) * zoom}px` : `${100 / zoom}%`,
            height: contentHeight ? `${contentHeight * zoom}px` : undefined,
          }}
        >
          <div ref={scaledContentRef} className="flex gap-4 py-4">
            {planDetail.periods.map((period) => (
              <div key={period.levelNumber} className="w-48 flex-shrink-0">
                <div className="mb-4 border-b border-border pb-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger render={<h2 className="inline-block cursor-pointer text-lg font-semibold text-foreground underline-offset-4 transition hover:underline" />}>
                        {period.levelLabel}
                      </TooltipTrigger>
                      <TooltipContent side="top" align="start">
                        <SemesterTooltip courses={period.courses} />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="space-y-4">
                  {period.courses.map((course) => (
                    <button
                      type="button"
                      key={course.id}
                      className="block w-full text-left"
                      onMouseEnter={() => setHoveredCourse(course.id)}
                      onMouseLeave={() => setHoveredCourse(null)}
                    >
                      <CurriculumCourseCard
                        course={course}
                        isHovered={hoveredCourse === course.id}
                        relationType={hoveredCourse ? getRelationType(hoveredCourse, course.id) : null}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-border px-4 pb-2 pt-1">
        <div className="flex flex-col gap-5 md:flex-row md:gap-8">
          <Legend title="Leyenda de estados" items={[
            ['bg-emerald-500/20 border-emerald-500/30', 'Aprobado'],
            ['bg-blue-500/20 border-blue-500/30', 'En curso'],
            ['bg-muted border-border', 'No cursado'],
            ['bg-red-500/20 border-red-500/30', 'Reprobado'],
            ['bg-amber-500/20 border-amber-500/30', 'Retirado'],
          ]} />
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Relaciones</h3>
            <div className="flex flex-wrap gap-4">
              <RelationLegend icon={<LockIcon className="size-3 shrink-0" />} label="Requisito" className="border-amber-500 text-amber-600" />
              <RelationLegend icon={<LinkIcon className="size-3 shrink-0" />} label="Correquisito" className="border-blue-500 text-blue-600" />
              <RelationLegend icon={<UnlockIcon className="size-3 shrink-0" />} label="Desbloquea" className="border-emerald-500 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SemesterTooltip({ courses }: { courses: CurriculumCourse[] }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
      <span className="font-semibold">Cursos</span>
      <span className="text-right">{courses.length}</span>
      <span className="font-semibold">Créditos</span>
      <span className="text-right">{courses.reduce((acc, course) => acc + course.credits, 0)}</span>
      <span className="font-semibold">Horas</span>
      <span className="text-right">{courses.reduce((acc, course) => acc + course.hours, 0)}</span>
    </div>
  )
}

function Legend({ title, items }: { title: string; items: Array<[string, string]> }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <div className="flex flex-wrap gap-4">
        {items.map(([className, label]) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`size-6 rounded border-2 ${className}`} />
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RelationLegend({ icon, label, className }: { icon: React.ReactNode; label: string; className: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 bg-background shadow-sm ${className}`}>
        {icon}
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}
