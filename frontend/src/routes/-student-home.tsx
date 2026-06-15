import { Link, useNavigate } from '@tanstack/react-router'
import { BookOpenIcon, ListChecksIcon, UserRoundIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { DemoUser } from '@/lib/demo-auth'
import {
  academicYears,
  accountSummary,
  enrolledCourses,
  formatCurrency,
  studentProfile,
} from '@/lib/student-data'

const quickLinks = [
  { label: 'Matrícula', description: 'Seleccionar cursos del periodo', route: '/enrollment', icon: ListChecksIcon },
  { label: 'Horario', description: 'Ver mi horario de clases', route: '/schedule', icon: BookOpenIcon },
  { label: 'Financiero', description: 'Revisar estado de cuenta y pagos', route: '/finance', icon: UserRoundIcon },
] as const

export function StudentHome({ user }: { user: DemoUser }) {
  if (user.role !== 'student') return null

  return (
    <main className="mx-auto w-full max-w-7xl grow px-4 py-6 md:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="min-w-0 space-y-5">
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
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">Avance académico</h2>
                <p className="truncate text-sm text-muted-foreground">{studentProfile.career}</p>
              </div>
              <span className="text-sm font-medium">{studentProfile.academicProgress}%</span>
            </div>
            <Progress value={studentProfile.academicProgress} />
          </div>
        </div>

        <aside className="min-w-0 rounded-xl border border-border p-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted">
              <UserRoundIcon className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-semibold">Perfil rápido</h2>
              <p className="truncate text-sm text-muted-foreground">{studentProfile.campus}</p>
            </div>
          </div>

          <div className="space-y-3">
            {quickLinks.map(({ label, description, route, icon: Icon }) => (
              <Link key={label} to={route as any}>
                <button
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
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Cursos</h2>

        <div className="space-y-2">
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
      </section>
    </main>
  )
}

export function getCourseRouteParams(year: string, period: string, courseCode: string, groupNumber: string) {
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

export function romanToNumber(value: string) {
  if (/^\d+$/.test(value)) return Number(value)

  const numerals: Record<string, number> = {
    I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10,
  }

  return numerals[value] ?? 1
}

export function Stat({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={muted ? 'truncate text-lg font-semibold text-muted-foreground' : 'truncate text-lg font-semibold'}>{value}</p>
    </div>
  )
}

export function CollapseSquare() {
  return (
    <>
      <span className="text-base leading-none group-data-[panel-open]:hidden">+</span>
      <span className="hidden text-base leading-none group-data-[panel-open]:block">-</span>
    </>
  )
}
