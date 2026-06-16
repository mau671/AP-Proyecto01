import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/management/')({
  beforeLoad: () => {
    throw redirect({
      to: '/management/students',
    })
  },
})
