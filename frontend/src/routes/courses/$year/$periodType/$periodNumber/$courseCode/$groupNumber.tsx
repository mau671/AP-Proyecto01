import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber',
)({
  component: () => <Outlet />,
})
