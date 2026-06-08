import { Navigate, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/')({
  component: ProfileIndex,
})

function ProfileIndex() {
  return <Navigate to="/profile/personal" replace />
}
