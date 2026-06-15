import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { getDemoUser, type DemoUser } from '@/lib/demo-auth'
import { StudentHome } from './-student-home'
import { TeacherHome } from './-teacher-home'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: DashboardEntry,
})

function DashboardEntry() {
  const navigate = useNavigate()
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

  if (user.role === 'student') {
    return <StudentHome user={user} />
  }

  if (user.role === 'teacher') {
    return <TeacherHome user={user} />
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl grow flex-col justify-center px-6 py-10">
      <div className="space-y-4 rounded-xl border border-border p-6">
        <Badge variant="secondary">{user.roleLabel}</Badge>
        <h1 className="text-2xl font-semibold">Modo en preparación</h1>
        <p className="text-muted-foreground">
          Por ahora solo está implementado el dashboard estudiantil y docente.
        </p>
        <Button asChild>
          <Link to="/auth/signin">Cambiar usuario</Link>
        </Button>
      </div>
    </main>
  )
}
