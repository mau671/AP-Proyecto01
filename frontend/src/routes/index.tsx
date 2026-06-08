import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { startOfWeek } from 'date-fns'
import {
  BookOpenIcon,
  ListChecksIcon,
  UserRoundIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import Calendar from '@/components/calendar/calendar'
import type { CalendarEvent, Mode } from '@/components/calendar/calendar-types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getDemoUser, type DemoUser } from '@/lib/demo-auth'
import {
  academicYears,
  accountYears,
  accountSummary,
  enrolledCourses,
  formatCurrency,
  getStudentScheduleEvents,
  studentProfile,
} from '@/lib/student-data'

const studentTabs = ['courses', 'schedule', 'finance'] as const
type StudentTab = (typeof studentTabs)[number]

function isStudentTab(value: unknown): value is StudentTab {
  return typeof value === 'string' && studentTabs.includes(value as StudentTab)
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: isStudentTab(search.tab) ? search.tab : 'courses',
  }),
  component: StudentHome,
})

const quickLinks = [
  { label: 'Matrícula', description: 'Seleccionar cursos del periodo', icon: ListChecksIcon },
] as const

function StudentHome() {
  const navigate = useNavigate()
  const search = Route.useSearch()
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
          <Badge variant="secondary">{user.roleLabel}</Badge>
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
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-5">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Bienvenido, {studentProfile.name}
            </h1>
          </div>

          <div className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-4">
            <Stat label="Carnet" value={studentProfile.id} />
            <Stat label="Créditos activos" value={String(studentProfile.credits)} />
            <Stat label="Promedio" value={`${studentProfile.gpa.toFixed(1)}%`} />
            <Stat label="Saldo" value={formatCurrency(accountSummary.balance)} muted />
          </div>

          <div className="rounded-xl border border-border p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Avance académico</h2>
                <p className="text-sm text-muted-foreground">{studentProfile.career}</p>
              </div>
              <span className="text-sm font-medium">{studentProfile.academicProgress}%</span>
            </div>
            <Progress value={studentProfile.academicProgress} />
          </div>
        </div>

        <aside className="rounded-xl border border-border p-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-muted">
              <UserRoundIcon className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold">Perfil rápido</h2>
              <p className="text-sm text-muted-foreground">{studentProfile.campus}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            {quickLinks.map(({ label, description, icon: Icon }) => (
              <button
                key={label}
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-accent"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-muted">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="block truncate text-sm text-muted-foreground">{description}</span>
                </span>
              </button>
            ))}
          </div>
        </aside>
      </section>

      <Tabs
        value={search.tab}
        onValueChange={(value) => {
          if (!isStudentTab(value)) return
          navigate({
            search: (prev) => ({ ...prev, tab: value }),
            replace: true,
          })
        }}
        className="mt-8"
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="schedule">Horario</TabsTrigger>
          <TabsTrigger value="finance">Financiero</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-5">
          <div className="space-y-2 rounded-xl border border-border p-3">
            <Collapsible defaultOpen>
              <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
                  <CollapseSquare />
                </CollapsibleTrigger>
                <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <h3 className="truncate text-base font-semibold">2026</h3>
                  <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
                    <span>{studentProfile.credits} créditos</span>
                    <span>Promedio {studentProfile.gpa.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              <CollapsibleContent className="pl-8 pt-2">
                <Collapsible defaultOpen>
                  <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                    <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
                      <CollapseSquare />
                    </CollapsibleTrigger>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <h4 className="truncate text-base font-medium">Semestre I</h4>
                      <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
                        <span>{studentProfile.credits} créditos</span>
                        <span>Promedio {studentProfile.gpa.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  <CollapsibleContent className="pl-8 pt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Curso</TableHead>
                          <TableHead className="text-right">Grupo</TableHead>
                          <TableHead>Profesor</TableHead>
                          <TableHead className="text-right">Créditos</TableHead>
                          <TableHead className="text-right">Nota</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enrolledCourses.map((course) => (
                          <TableRow key={course.code}>
                            <TableCell className="font-mono">{course.code}</TableCell>
                            <TableCell className="font-medium">
                              <Link
                                to="/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber"
                                params={getCourseRouteParams('2026', 'Semestre I', course.code, course.group)}
                                className="underline-offset-4 hover:underline"
                              >
                                {course.name}
                              </Link>
                            </TableCell>
                            <TableCell className="text-right">{course.group}</TableCell>
                            <TableCell>{course.professor}</TableCell>
                            <TableCell className="text-right">{course.credits}</TableCell>
                            <TableCell className="text-right font-mono">{course.grade}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CollapsibleContent>
                </Collapsible>
              </CollapsibleContent>
            </Collapsible>

            {academicYears.map((year) => (
              <Collapsible key={year.year}>
                <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                  <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
                    <CollapseSquare />
                  </CollapsibleTrigger>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <h3 className="truncate text-base font-medium">{year.year}</h3>
                    <div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                      <span>{year.periods.reduce((total, period) => total + period.credits, 0)} créditos</span>
                    </div>
                  </div>
                </div>
                <CollapsibleContent className="space-y-1 pl-8 pt-1 text-sm text-muted-foreground">
                  {year.periods.map((period) => (
                    <Collapsible key={period.period}>
                      <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                        <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
                          <CollapseSquare />
                        </CollapsibleTrigger>
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                          <h4 className="truncate text-base font-medium text-foreground">{period.period}</h4>
                          <div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                            <span>{period.credits} créditos</span>
                            <span className="font-mono text-foreground">{period.average}%</span>
                          </div>
                        </div>
                      </div>
                      <CollapsibleContent className="pl-8 pt-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Código</TableHead>
                              <TableHead>Curso</TableHead>
                              <TableHead className="text-right">Grupo</TableHead>
                              <TableHead>Profesor</TableHead>
                              <TableHead className="text-right">Créditos</TableHead>
                              <TableHead className="text-right">Nota</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {period.courses.map((course) => (
                              <TableRow key={`${period.period}-${course.code}-${course.group}`}>
                                <TableCell className="font-mono">{course.code}</TableCell>
                                <TableCell className="font-medium">
                                  <Link
                                    to="/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber"
                                    params={getCourseRouteParams(year.year, period.period, course.code, course.group)}
                                    className="underline-offset-4 hover:underline"
                                  >
                                    {course.name}
                                  </Link>
                                </TableCell>
                                <TableCell className="text-right">{course.group}</TableCell>
                                <TableCell>{course.professor}</TableCell>
                                <TableCell className="text-right">{course.credits}</TableCell>
                                <TableCell className="text-right font-mono">{course.grade}%</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-5">
          <SectionHeader title="Próximas clases" description="Semestre I 2026: Semana 12" />
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
        </TabsContent>

        <TabsContent value="finance" className="mt-5">
          <div className="space-y-2 rounded-xl border border-border p-3">
            {accountYears.map((year, yearIndex) => (
              <Collapsible key={year.year} defaultOpen={yearIndex === 0}>
                <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                  <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
                    <CollapseSquare />
                  </CollapsibleTrigger>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <h3 className="truncate text-base font-semibold">{year.year}</h3>
                    <div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                      <span>{year.charges.length} cobros</span>
                    </div>
                  </div>
                </div>
                <CollapsibleContent className="space-y-1 pl-8 pt-1">
                  {year.charges.map((charge, chargeIndex) => (
                    <Collapsible key={`${year.year}-${charge.period}`} defaultOpen={yearIndex === 0 && chargeIndex === 0}>
                      <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                        <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
                          <CollapseSquare />
                        </CollapsibleTrigger>
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                          <div className="min-w-0">
                            <h4 className="truncate text-base font-medium">{charge.period}</h4>
                            <p className="truncate text-sm text-muted-foreground">Fecha límite sin recargo: {charge.dueDateWithoutSurcharge}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <Badge variant={charge.status === 'Pagado' ? 'secondary' : 'destructive'}>{charge.status}</Badge>
                            <span className="hidden font-mono text-sm font-medium sm:block">{formatCurrency(charge.balance)}</span>
                          </div>
                        </div>
                      </div>
                      <CollapsibleContent className="pl-8 pt-2">
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell colSpan={2} className="bg-muted/40 font-semibold">Detalle de créditos</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Créditos matriculados</TableCell>
                              <TableCell className="text-right font-mono">{charge.enrolledCredits}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Créditos al cobro</TableCell>
                              <TableCell className="text-right font-mono">{charge.billedCredits}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={2} className="bg-muted/40 font-semibold">Detalle de montos</TableCell>
                            </TableRow>
                            {charge.amounts.map((amount) => (
                              <TableRow key={amount.concept}>
                                <TableCell className="font-medium">{amount.concept}</TableCell>
                                <TableCell className="text-right font-mono">{formatCurrency(amount.amount)}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell className="font-semibold">Saldo</TableCell>
                              <TableCell className="text-right font-mono font-semibold">{formatCurrency(charge.balance)}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </TabsContent>

      </Tabs>
    </main>
  )
}

function getCourseRouteParams(year: string, period: string, courseCode: string, groupNumber: string) {
  const normalizedPeriod = period.toLowerCase()
  const periodType = normalizedPeriod.startsWith('semestre')
    ? 'S'
    : normalizedPeriod.startsWith('verano')
      ? 'V'
      : 'H'

  const periodNumberMatch = period.match(/\b([IVX]+|\d+)$/)
  const periodNumber = periodNumberMatch ? romanToNumber(periodNumberMatch[1]) : 1

  return {
    year,
    periodType,
    periodNumber: String(periodNumber),
    courseCode,
    groupNumber,
  }
}

function romanToNumber(value: string) {
  if (/^\d+$/.test(value)) return Number(value)

  const numerals: Record<string, number> = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
    V: 5,
    VI: 6,
    VII: 7,
    VIII: 8,
    IX: 9,
    X: 10,
  }

  return numerals[value] ?? 1
}

function Stat({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={muted ? 'truncate text-lg font-semibold text-muted-foreground' : 'truncate text-lg font-semibold'}>{value}</p>
    </div>
  )
}

function CollapseSquare() {
  return (
    <>
      <span className="text-base leading-none group-data-[panel-open]:hidden">+</span>
      <span className="hidden text-base leading-none group-data-[panel-open]:block">-</span>
    </>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon?: typeof BookOpenIcon
  title: string
  description: string
}) {
  return (
    <div className="mb-3 flex items-start gap-3">
      {Icon ? (
        <span className="mt-0.5 grid size-9 place-items-center rounded-lg bg-muted">
          <Icon className="size-4" />
        </span>
      ) : null}
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
