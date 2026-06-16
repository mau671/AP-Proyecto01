import { createFileRoute } from '@tanstack/react-router'
import { AttendanceTab } from '../../course-page/-attendance-tab'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/_tabs/attendance',
)({
  component: AttendanceTab,
})
