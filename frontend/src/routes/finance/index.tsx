import { Navigate, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/finance/')({
  component: FinanceIndex,
})

function FinanceIndex() {
  return <Navigate to="/finance/account" replace />
}
