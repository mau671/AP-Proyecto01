import { createFileRoute } from '@tanstack/react-router'
import { DocumentsTab } from '../../course-page/-documents-tab'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/_tabs/documents',
)({
  component: DocumentsTab,
})
