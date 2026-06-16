import { createFileRoute } from '@tanstack/react-router'
import { GaapTab } from '../../../course-page/-gaap-tab'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/_tabs/gaap/',
)({
  component: GaapTab,
})
