import { createFileRoute } from '@tanstack/react-router'
import { CalendarioTab } from '../../course-page/-calendar-tab'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/_tabs/calendar',
)({
  component: CalendarioTab,
})
