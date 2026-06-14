import { Link, Outlet, createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { LineTabs } from '@/components/line-tabs'
import { Button } from '@/components/ui/button'
import { getDemoUser, type DemoUser } from '@/lib/demo-auth'

const financeSections = [
  { label: 'Estado de cuenta', to: '/finance/account' },
  { label: 'Realizar pago', to: '/finance/payment' },
  { label: 'Historial de pagos', to: '/finance/history' },
  { label: 'Otros cobros', to: '/finance/other-charges' },
] as const

export const Route = createFileRoute('/finance')({
  component: FinanceLayout,
})

function FinanceLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<DemoUser | null>(null)

  useEffect(() => {
    const currentUser = getDemoUser()
    if (!currentUser) {
      navigate({ to: '/auth/signin' })
      return
    }

    setUser(currentUser)
  }, [navigate])

  if (!user) return null

  if (user.role !== 'student') {
    return (
      <main className="mx-auto flex w-full max-w-4xl grow flex-col justify-center px-6 py-10">
        <div className="space-y-4 rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">{user.roleLabel}</p>
          <h1 className="text-2xl font-semibold">Modo en preparación</h1>
          <p className="text-muted-foreground">
            Por ahora solo está implementado el dashboard estudiantil. Inicia sesión con estudiante@utlm.cr para revisar el flujo actual.
          </p>
          <Button asChild>
            <Link to="/auth/signin">Cambiar usuario</Link>
          </Button>
        </div>
      </main>
    )
  }

  const activeTab = financeSections.some((section) => section.to === location.pathname)
    ? location.pathname
    : '/finance/account'

  return (
    <main className="flex grow flex-col">
      <LineTabs
        tabs={financeSections.map((section) => ({ label: section.label, value: section.to }))}
        value={activeTab}
        onValueChange={(value) => {
          const next = financeSections.find((section) => section.to === value)
          if (!next) return
          navigate({ to: next.to })
        }}
      />

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <Outlet />
      </div>
    </main>
  )
}
