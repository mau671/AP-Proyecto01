import { createFileRoute } from '@tanstack/react-router'
import { InicioTab } from '../../course-page/-inicio-tab'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/_tabs/home',
)({
  component: InicioTab,
})
