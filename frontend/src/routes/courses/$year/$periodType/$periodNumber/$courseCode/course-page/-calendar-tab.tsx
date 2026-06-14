import { useCallback, useMemo, useState, type CSSProperties } from 'react'
import { addDays, addWeeks, startOfWeek, subWeeks } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SEMESTER_START = new Date(2026, 1, 16)
const SEMANA_SANTA_MONDAY = new Date(2026, 2, 30)

import CalendarBodyDayContent from '@/components/calendar/body/day/calendar-body-day-content'
import CalendarBodyDayMargin, { END_HOUR, START_HOUR } from '@/components/calendar/body/day/calendar-body-day-margin'
import CalendarProvider from '@/components/calendar/calendar-provider'
import { useCalendarContext } from '@/components/calendar/calendar-context'
import type { Mode } from '@/components/calendar/calendar-types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TooltipProvider } from '@/components/ui/tooltip'
import { sessionToEvent } from '@/lib/calendar-utils'
import type { CalendarEvent } from '@/lib/types'

import { courseEvalEvents, courseMeetings } from './-data'

const HEADER_HEIGHT = 33
const COURSE_CODE = 'IC4810'
const COURSE_NAME = 'Administración de proyectos'
const GROUP_CODE = '01'
const PROFESSORS = ['Alicia Marcela Salazar Hernandez']
const COLOR = 'orange'
const CAMPUS = 'CAMPUS TECNOLOGICO CENTRAL CARTAGO'

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

function getCourseEvents(calendarDate: Date): CalendarEvent[] {
  const weekStart = startOfWeek(calendarDate, { weekStartsOn: 1 })

  const meetingEvents = courseMeetings.map((meeting) =>
    sessionToEvent({
      session: meeting,
      courseId: COURSE_CODE,
      courseCode: COURSE_CODE,
      courseName: COURSE_NAME,
      groupCode: GROUP_CODE,
      groupId: `${COURSE_CODE}-${GROUP_CODE}`,
      groupType: 'SEMIPRESENCIAL',
      professors: PROFESSORS,
      classroom: meeting.classroom,
      campusName: CAMPUS,
      color: COLOR,
      weekStart,
    }),
  )

  const weekEnd = addDays(weekStart, 6)
  const evalEvents = courseEvalEvents
    .filter((ev) => ev.date >= weekStart && ev.date <= weekEnd)
    .map((ev, i) => ({
      id: `course-eval-${i}`,
      title: ev.name,
      courseName: COURSE_NAME,
      courseCode: COURSE_CODE,
      groupCode: GROUP_CODE,
      groupId: `${COURSE_CODE}-${GROUP_CODE}`,
      groupType: 'SEMIPRESENCIAL',
      professors: PROFESSORS,
      classroom: null,
      campusName: null,
      color: 'red' as const,
      start: ev.date,
      end: new Date(ev.date.getTime() + 60 * 60 * 1000),
      courseId: COURSE_CODE,
      group: 1,
    }))

  return [...meetingEvents, ...evalEvents]
}

function CourseWeekView() {
  const { date, hourHeight, dayWidth } = useCalendarContext()

  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i))
  const totalHours = END_HOUR - START_HOUR + 1
  const contentHeight = totalHours * hourHeight + HEADER_HEIGHT
  const weekMinWidth = dayWidth * weekDays.length + 48

  return (
    <div className="min-w-0 flex-1 overflow-x-auto">
      <div
        className="relative flex min-w-[var(--week-min-width)] lg:min-w-0"
        style={
          {
            minHeight: contentHeight,
            '--week-min-width': `${weekMinWidth}px`,
          } as CSSProperties
        }
      >
        <CalendarBodyDayMargin />
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="flex min-w-[var(--day-width)] flex-1 flex-col lg:min-w-0"
            style={{ '--day-width': `${dayWidth}px` } as CSSProperties}
          >
            <CalendarBodyDayContent
              date={day}
              showDayNumber
              headerClassName="border-l-0"
              contentClassName="border-l border-border"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CalendarioTab() {
  const [calendarDate, setCalendarDate] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [calendarMode] = useState<Mode>('week')

  const calendarEvents = useMemo(
    () => getCourseEvents(calendarDate),
    [calendarDate],
  )

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

  return (
    <div className="flex h-full min-h-0 flex-col p-4">
      <CalendarProvider
        events={calendarEvents}
        setEvents={() => {}}
        mode={calendarMode}
        setMode={() => {}}
        date={calendarDate}
        setDate={setCalendarDate}
        calendarIconIsToday={false}
        hourHeight={64}
        dayWidth={150}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-sm" onClick={handlePrevWeek} disabled={isPrevDisabled}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={handleNextWeek} disabled={isNextDisabled}>
                <ChevronRight className="size-4" />
              </Button>
              <span className="ml-1 text-sm font-medium tabular-nums">{weekLabel}</span>
            </div>
            <Badge variant="secondary" className="hidden text-xs sm:inline-flex">{COURSE_CODE}: {COURSE_NAME}</Badge>
            <Badge variant="secondary" className="inline-flex text-xs sm:hidden">{COURSE_CODE}</Badge>
          </div>
          <TooltipProvider delay={200}>
            <CourseWeekView />
          </TooltipProvider>
        </div>
      </CalendarProvider>
    </div>
  )
}
