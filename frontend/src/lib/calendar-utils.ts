import { addDays } from "date-fns"

import type { CalendarEvent, ScheduleSession } from "./types"

const DAY_MAP: Record<string, number> = {
  lunes: 1,
  martes: 2,
  miércoles: 3,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sábado: 6,
  sabado: 6,
  domingo: 0,
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
}

export function parseTimeToDate(time: string, dayOfWeek: number, weekStart: Date): Date {
  const [hours, minutes] = time.split(":").map(Number)
  const dayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const date = addDays(weekStart, dayOffset)
  date.setHours(hours, minutes, 0, 0)
  return date
}

export function sessionToEvent({
  session,
  courseId,
  courseCode,
  courseName,
  groupCode,
  groupId,
  groupType,
  professors,
  classroom,
  campusName,
  color,
  weekStart,
}: {
  session: ScheduleSession
  courseId: string
  courseCode: string
  courseName: string
  groupCode: string
  groupId: string
  groupType: string | null
  professors: string[] | null
  classroom: string | null
  campusName: string | null
  color: string
  weekStart: Date
}): CalendarEvent {
  const dayOfWeek = DAY_MAP[String(session.weekday).toLowerCase().trim()]
  if (dayOfWeek === undefined) {
    throw new Error(`Invalid day: ${session.weekday}`)
  }

  const start = parseTimeToDate(session.starts_at, dayOfWeek, weekStart)
  const end = parseTimeToDate(session.ends_at, dayOfWeek, weekStart)

  return {
    id: `${groupId}-${session.weekday}-${session.starts_at}`,
    title: courseName,
    courseName,
    courseCode,
    groupCode,
    groupId,
    groupType,
    professors,
    classroom,
    campusName,
    color,
    start,
    end,
    courseId,
    group: parseInt(groupCode, 10),
  }
}
