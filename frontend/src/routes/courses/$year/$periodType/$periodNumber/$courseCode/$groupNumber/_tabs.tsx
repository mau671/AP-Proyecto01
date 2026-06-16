import { createFileRoute, Outlet } from '@tanstack/react-router'
import { CourseTabs } from '../course-page/-course-tabs'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/_tabs',
)({
  component: TabsLayout,
})

function TabsLayout() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <CourseTabs />
      <div className="flex-1 overflow-y-auto flex flex-col [scrollbar-gutter:stable]">
        <Outlet />
      </div>
    </div>
  )
}
