import { Link } from '@tanstack/react-router'
import { UserRoundIcon, UsersIcon } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { DemoUser } from '@/lib/demo-auth'
import { teacherProfile, taughtCourses } from '@/lib/teacher-data'
import { Stat, CollapseSquare, getCourseRouteParams } from './-student-home'

export function TeacherHome({ user }: { user: DemoUser }) {
  if (user.role !== 'teacher') return null

  // Calculate some stats
  const activeCourses = taughtCourses[0]?.periods[0]?.courses.length || 0
  const totalStudents = taughtCourses[0]?.periods[0]?.courses.reduce((acc, c) => acc + c.enrolled, 0) || 0

  return (
    <main className="mx-auto w-full max-w-7xl grow px-4 py-6 md:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-5">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Bienvenida, {teacherProfile.name}
            </h1>
          </div>

          <div className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-3">
            <Stat label="ID Docente" value={teacherProfile.id} />
            <Stat label="Cursos Activos" value={String(activeCourses)} />
            <Stat label="Estudiantes (Este periodo)" value={String(totalStudents)} />
          </div>
        </div>

        <aside className="rounded-xl border border-border p-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-muted">
              <UserRoundIcon className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold">Perfil docente</h2>
              <p className="text-sm text-muted-foreground">{teacherProfile.campus}</p>
            </div>
          </div>
          
          <div className="space-y-1 text-sm text-muted-foreground">
            <p><strong>Departamento:</strong> {teacherProfile.department}</p>
            <p><strong>Email:</strong> {teacherProfile.email}</p>
          </div>
        </aside>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Cursos Impartidos</h2>

        <div className="space-y-2">
          {taughtCourses.map((yearObj, index) => (
            <Collapsible key={yearObj.year} defaultOpen={index === 0}>
              <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
                  <CollapseSquare />
                </CollapsibleTrigger>
                <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <h3 className="truncate text-base font-semibold">{yearObj.year}</h3>
                  <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
                    <span>{yearObj.periods.reduce((acc, p) => acc + p.courses.length, 0)} cursos</span>
                  </div>
                </div>
              </div>
              <CollapsibleContent className="pl-8 pt-2">
                <div className="space-y-2">
                  {yearObj.periods.map((periodObj, pIndex) => (
                    <Collapsible key={periodObj.period} defaultOpen={index === 0 && pIndex === 0}>
                      <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                        <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
                          <CollapseSquare />
                        </CollapsibleTrigger>
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                          <h4 className="truncate text-base font-medium">{periodObj.period}</h4>
                          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
                            <span>{periodObj.courses.length} cursos</span>
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
                              <TableHead>Horario</TableHead>
                              <TableHead>Modalidad</TableHead>
                              <TableHead className="text-right"><span className="sr-only">Estudiantes</span><UsersIcon className="inline size-4" /></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {periodObj.courses.map((course) => (
                              <TableRow key={`${course.code}-${course.group}`}>
                                <TableCell className="font-mono">{course.code}</TableCell>
                                <TableCell className="font-medium">
                                  <Link
                                    to="/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber"
                                    params={getCourseRouteParams(yearObj.year, periodObj.period, course.code, course.group)}
                                    className="underline-offset-4 hover:underline"
                                  >
                                    {course.name}
                                  </Link>
                                </TableCell>
                                <TableCell className="text-right">{course.group}</TableCell>
                                <TableCell>{course.schedule}</TableCell>
                                <TableCell>{course.modality}</TableCell>
                                <TableCell className="text-right">{course.enrolled}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </section>
    </main>
  )
}
