import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { format, addDays, startOfWeek, addWeeks, subWeeks, isPast } from 'date-fns'
import { es } from 'date-fns/locale'
import { Clock, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { getDemoUser } from '@/lib/demo-auth'
import { courseMeetings } from './-data'
import { AttendanceTeacher } from './-attendance-teacher'
import { AttendanceStudent } from './-attendance-student'

const SEMESTER_START = new Date(2026, 1, 16)
const SEMANA_SANTA_MONDAY = new Date(2026, 2, 30)

function getAcademicWeekNumber(date: Date): number {
  const monday = startOfWeek(date, { weekStartsOn: 1 })
  const diffMs = monday.getTime() - SEMESTER_START.getTime()
  const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000))
  if (diffWeeks < 6) return diffWeeks + 1
  return diffWeeks
}

function navigateAcademicWeeks(date: Date, delta: number): Date {
  let result = date
  const direction = delta > 0 ? 1 : -1
  for (let i = 0; i < Math.abs(delta); i++) {
    result = direction > 0 ? addWeeks(result, 1) : subWeeks(result, 1)
    const resultMonday = startOfWeek(result, { weekStartsOn: 1 })
    if (resultMonday.getTime() === SEMANA_SANTA_MONDAY.getTime()) {
      result = direction > 0 ? addWeeks(result, 1) : subWeeks(result, 1)
    }
  }
  return result
}

export function AttendanceTab() {
  const [user, setUser] = useState<any>(null)
  const params = useParams({ strict: false }) as any
  const courseCode = params.courseCode || ''
  
  useEffect(() => {
    setUser(getDemoUser())
  }, [])

  const [calendarDate, setCalendarDate] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))

  const weekNumber = useMemo(() => getAcademicWeekNumber(calendarDate), [calendarDate])
  const weekLabel = `Semana ${String(weekNumber).padStart(2, '0')}`
  const isPrevDisabled = weekNumber <= 1
  const isNextDisabled = weekNumber >= 19

  const handlePrevWeek = useCallback(() => {
    setCalendarDate((prev) => navigateAcademicWeeks(prev, -1))
  }, [])

  const handleNextWeek = useCallback(() => {
    setCalendarDate((prev) => navigateAcademicWeeks(prev, 1))
  }, [])

  const sessionsOfWeek = useMemo(() => {
    const weekStart = startOfWeek(calendarDate, { weekStartsOn: 1 })
    return courseMeetings.map(meeting => {
      const date = addDays(weekStart, meeting.weekday - 1)
      return {
        id: `s-${format(date, 'yyyy-MM-dd')}`,
        date,
        type: meeting.classroom.includes('Lab') ? 'Laboratorio' : 'Teoría',
        status: isPast(date) ? 'completed' : 'pending'
      }
    }).sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [calendarDate])

  const [selectedSessionId, setSelectedSessionId] = useState(sessionsOfWeek[0]?.id)
  
  useEffect(() => {
    if (sessionsOfWeek.length > 0 && !sessionsOfWeek.find(s => s.id === selectedSessionId)) {
      setSelectedSessionId(sessionsOfWeek[0].id)
    }
  }, [sessionsOfWeek, selectedSessionId])

  // Mock global student sessions for the student panel to look up presence
  const studentSessions = useMemo(() => {
    const today = new Date()
    let currentWeekStart = startOfWeek(SEMESTER_START, { weekStartsOn: 1 })
    const sessions = []
    
    // Simulate up to current date + 1 week just in case
    while (currentWeekStart <= addWeeks(today, 1)) {
      if (currentWeekStart.getTime() !== SEMANA_SANTA_MONDAY.getTime()) {
        for (const meeting of courseMeetings) {
          const date = addDays(currentWeekStart, meeting.weekday - 1)
          if (date <= today) {
            sessions.push({
              id: `s-${format(date, 'yyyy-MM-dd')}`,
              date,
              type: meeting.classroom.includes('Lab') ? 'Laboratorio' : 'Teoría',
              // Determinist mock: absent on the 3rd session, present for the rest
              present: sessions.length !== 2 
            })
          }
        }
      }
      currentWeekStart = addWeeks(currentWeekStart, 1)
    }
    return sessions
  }, [])

  const selectedSession = sessionsOfWeek.find(s => s.id === selectedSessionId) || sessionsOfWeek[0]

  return (
    <div className="lg:flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] lg:min-h-[600px] lg:overflow-hidden">
      <div className="border-b lg:border-b-0 lg:border-r border-border bg-muted/10 lg:overflow-y-auto">
        <div className="p-6 flex flex-col space-y-6">
          <div className="flex items-center justify-between">
             <Button variant="ghost" size="icon" className="size-8" onClick={handlePrevWeek} disabled={isPrevDisabled}>
               <ChevronLeft className="size-4" />
             </Button>
             <span className="font-semibold">{weekLabel}</span>
             <Button variant="ghost" size="icon" className="size-8" onClick={handleNextWeek} disabled={isNextDisabled}>
               <ChevronRight className="size-4" />
             </Button>
          </div>

          <div className="space-y-2">
            {sessionsOfWeek.map(session => (
              <button 
                key={session.id} 
                onClick={() => setSelectedSessionId(session.id)} 
                className={`w-full flex flex-col gap-1 p-3 rounded-lg border text-left transition-colors hover:bg-accent ${selectedSessionId === session.id ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border bg-background'}`}
              >
                <span className="font-medium text-sm">{format(session.date, "EEEE d MMM", { locale: es }).replace(/^\w/, c => c.toUpperCase())}</span>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-muted-foreground">{session.type}</span>
                  {session.status === 'completed' ? <CheckCircle2 className="size-3.5 text-green-500" /> : <Clock className="size-3.5 text-amber-500" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {user?.role === 'student' ? (
        <AttendanceStudent selectedSession={selectedSession} studentSessions={studentSessions} courseCode={courseCode} weekNumber={weekNumber} />
      ) : (
        <AttendanceTeacher selectedSession={selectedSession} sessionsOfWeek={sessionsOfWeek} />
      )}
    </div>
  )
}
