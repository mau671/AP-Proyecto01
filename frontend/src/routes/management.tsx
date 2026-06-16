import { Link, Outlet, createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { LineTabs } from '@/components/line-tabs'
import { Button } from '@/components/ui/button'
import { getDemoUser, type DemoUser } from '@/lib/demo-auth'

const managementSections = [
  { label: 'Estudiantes', to: '/management/students' },
  { label: 'Docentes', to: '/management/teachers' },
  { label: 'Cursos', to: '/management/courses' },
  { label: 'Períodos académicos', to: '/management/periods' },
] as const

export const Route = createFileRoute('/management')({
  component: ManagementLayout,
})

function ManagementLayout() {
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

  if (user.role !== 'admin') {
    return (
      <main className="mx-auto flex w-full max-w-4xl grow flex-col justify-center px-6 py-10">
        <div className="space-y-4 rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">{user.roleLabel}</p>
          <h1 className="text-2xl font-semibold">Acceso Denegado</h1>
          <p className="text-muted-foreground">
            El portal de gestión es exclusivo para usuarios administrativos.
          </p>
          <Button asChild>
            <Link to="/auth/signin">Cambiar usuario</Link>
          </Button>
        </div>
      </main>
    )
  }

  const activeTab = managementSections.some((section) => section.to === location.pathname)
    ? location.pathname
    : '/management/students'

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <LineTabs
        tabs={managementSections.map((section) => ({ label: section.label, value: section.to }))}
        value={activeTab}
        onValueChange={(value) => {
          const next = managementSections.find((section) => section.to === value)
          if (!next) return
          navigate({ to: next.to })
        }}
      />

      <div className="flex-1 overflow-y-auto p-4 [scrollbar-gutter:stable]">
        <Outlet />
      </div>
    </main>
  )
}
