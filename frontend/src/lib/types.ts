export interface CalendarEvent {
  id: string
  title: string
  courseName: string
  courseCode: string
  groupCode: string
  groupId: string
  groupType: string | null
  professors: string[] | null
  classroom: string | null
  campusName: string | null
  color: string
  start: Date
  end: Date
  courseId: string
  group: number
}

export interface ScheduleSession {
  weekday: number
  starts_at: string
  ends_at: string
  classroom: string | null
}

export interface ScheduleGroup {
  group_id: number
  group_code: string
  group_type: string
  capacity: number
  enrolled_count: number
  professors: string[] | null
  meetings: ScheduleSession[] | null
  campus_id?: number | null
}
