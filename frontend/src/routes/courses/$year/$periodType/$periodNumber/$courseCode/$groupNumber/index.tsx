import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/',
)({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: `/courses/${params.year}/${params.periodType}/${params.periodNumber}/${params.courseCode}/${params.groupNumber}/home`
    })
  }
})
