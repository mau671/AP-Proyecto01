import { createFileRoute } from '@tanstack/react-router'

import { CurriculumBoard } from '@/components/curriculum/curriculum-board'
import { CurriculumFilters } from '@/components/curriculum/curriculum-filters'
import { curriculumPlanDetail } from '@/lib/curriculum-data'

export const Route = createFileRoute('/profile/study-plan')({
  component: ProfileStudyPlan,
})

function ProfileStudyPlan() {
  return (
    <div className="flex min-h-[760px] flex-col gap-4">
      <CurriculumFilters />
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-background">
        <CurriculumBoard planDetail={curriculumPlanDetail} />
      </div>
    </div>
  )
}
