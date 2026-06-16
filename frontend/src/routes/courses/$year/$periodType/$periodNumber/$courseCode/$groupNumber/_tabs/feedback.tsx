import { createFileRoute } from '@tanstack/react-router'
import { FeedbackTab } from '../../course-page/-feedback-tab'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/_tabs/feedback',
)({
  component: FeedbackTab,
})
