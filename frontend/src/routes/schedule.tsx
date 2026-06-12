import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { startOfWeek } from 'date-fns'
import { useEffect, useState } from 'react'

import Calendar from '@/components/calendar/calendar'
import type { CalendarEvent, Mode } from '@/components/calendar/calendar-types'
import { Button } from '@/components/ui/button'
import { getDemoUser, type DemoUser } from '@/lib/demo-auth'
import { getStudentScheduleEvents, studentProfile } from '@/lib/student-data'

export const Route = createFileRoute('/schedule')({
  component: StudentSchedulePage,
})

function StudentSchedulePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<DemoUser | null>(null)
  const [calendarMode, setCalendarMode] = useState<Mode>('week')
  const [calendarDate, setCalendarDate] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => getStudentScheduleEvents())

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

  return (
    <main className="mx-auto w-full max-w-7xl grow px-4 py-6 md:px-8">
      <section className="mb-6">
        <p className="text-sm font-medium text-muted-foreground">{studentProfile.career}</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Horario</h1>
        <p className="text-sm text-muted-foreground">Semestre I 2026: Semana 12</p>
      </section>

      <div className="h-[1060px] overflow-hidden rounded-xl border border-border bg-background">
        <Calendar
          events={calendarEvents}
          setEvents={setCalendarEvents}
          mode={calendarMode}
          setMode={setCalendarMode}
          date={calendarDate}
          setDate={setCalendarDate}
          calendarIconIsToday={false}
          hourHeight={64}
          dayWidth={150}
        />
      </div>
    </main>
  )
}
