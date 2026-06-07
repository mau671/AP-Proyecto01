import { createFileRoute } from '@tanstack/react-router'

import { Separator } from '@/components/ui/separator'

import { CourseTabs } from './course-page/-course-tabs'
import { courseTabs } from './course-page/-data'
import { DocumentsTab } from './course-page/-documents-tab'
import { EvaluationsTab } from './course-page/-evaluations-tab'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber',
)({
  validateSearch: (search: Record<string, unknown>) => {
    const rawTab = Number(search.tab)
    const tab = Number.isInteger(rawTab) ? rawTab : 0

    return {
      tab: Math.min(Math.max(tab, 0), courseTabs.length - 1),
    }
  },
  component: CoursePage,
})

function CoursePage() {
  const navigate = Route.useNavigate()
  const search = Route.useSearch()
  const tabIndex = search.tab

  return (
    <div className="flex grow flex-col">
      <CourseTabs
        tabIndex={tabIndex}
        onTabChange={(nextTab) => {
          navigate({
            search: (prev) => ({ ...prev, tab: nextTab }),
            replace: true,
          })
        }}
      />
      <Separator />
      <div className="flex-1 overflow-y-auto">
        {tabIndex === 2 && <DocumentsTab />}
        {tabIndex === 3 && <EvaluationsTab />}
      </div>
    </div>
  )
}
