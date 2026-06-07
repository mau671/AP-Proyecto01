import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/communities/$')({
  component: CommunityHierarchyPage,
})

function CommunityHierarchyPage() {
  return <div className="flex grow" />
}
