import { useState, useEffect, useMemo, useCallback } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format, addDays, startOfWeek, addWeeks, subWeeks, isPast } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Save, Clock, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { getDemoUser } from '@/lib/demo-auth'
import { enrolledStudents, courseMeetings } from './-data'

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

  const [attendanceStore, setAttendanceStore] = useState<Record<string, Record<string, boolean>>>({})
  const [savedAttendanceStore, setSavedAttendanceStore] = useState<Record<string, Record<string, boolean>>>({})

  useEffect(() => {
    setAttendanceStore(prev => {
      let changed = false
      const next = { ...prev }
      for (const session of sessionsOfWeek) {
        if (!next[session.id]) {
          next[session.id] = Object.fromEntries(enrolledStudents.map(s => [s.id, session.status === 'completed']))
          changed = true
        }
      }
      if (changed) {
        setSavedAttendanceStore(s => ({ ...next, ...s }))
      }
      return changed ? next : prev
    })
  }, [sessionsOfWeek])

  if (user?.role === 'student') {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Mi Asistencia</h2>
        <div className="rounded-xl border border-border p-6 bg-muted/20 flex flex-col items-center justify-center text-center">
          <Badge variant="default" className="mb-2">100% Presente</Badge>
          <p className="text-muted-foreground text-sm">Has asistido a todas las clases registradas.</p>
        </div>
      </div>
    )
  }

  const selectedSession = sessionsOfWeek.find(s => s.id === selectedSessionId) || sessionsOfWeek[0]
  const currentAttendance = attendanceStore[selectedSessionId] || {}
  const savedAttendance = savedAttendanceStore[selectedSessionId] || {}

  const hasChanges = JSON.stringify(currentAttendance) !== JSON.stringify(savedAttendance)

  const handleSave = () => {
    setSavedAttendanceStore(prev => ({
      ...prev,
      [selectedSessionId]: currentAttendance
    }))
  }

  const updateAttendance = (studentId: string, isPresent: boolean) => {
    setAttendanceStore(prev => ({
      ...prev,
      [selectedSessionId]: {
        ...prev[selectedSessionId],
        [studentId]: isPresent
      }
    }))
  }

  const columns = [
    {
      accessorKey: 'name',
      header: 'Nombre del estudiante',
    },
    {
      accessorKey: 'email',
      header: 'Correo electrónico',
    },
    {
      id: 'present',
      header: 'Presente',
      cell: ({ row }: any) => {
        const studentId = row.original.id
        const isPresent = currentAttendance[studentId]
        
        return (
          <Checkbox 
            checked={isPresent}
            onCheckedChange={(checked) => updateAttendance(studentId, !!checked)}
            aria-label="Marcar asistencia"
          />
        )
      },
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] h-[calc(100vh-140px)] min-h-[600px] overflow-hidden">
      <div className="border-r border-border bg-muted/10 p-6 flex flex-col space-y-6 overflow-y-auto">
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

      <div className="flex flex-col p-6 overflow-y-auto">
        {selectedSession && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-border">
            <p className="text-muted-foreground">
              {format(selectedSession.date, "EEEE d 'de' MMMM, yyyy", { locale: es }).replace(/^\w/, c => c.toUpperCase())}
            </p>
            <Button className="gap-2" disabled={!hasChanges} onClick={handleSave}>
              <Save className="size-4" />
              Guardar
            </Button>
          </div>
        )}

        <DataTable 
          columns={columns} 
          data={enrolledStudents} 
          filterKey="name" 
          filterPlaceholder="Buscar estudiante..."
        />
      </div>
    </div>
  )
}
