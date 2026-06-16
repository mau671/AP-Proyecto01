import { createFileRoute } from '@tanstack/react-router'
import { EvaluationsTab } from '../../../course-page/-evaluations-tab'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/_tabs/evaluations/',
)({
  component: EvaluationsTab,
})
