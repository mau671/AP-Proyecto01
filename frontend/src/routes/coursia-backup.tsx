import { Link, createFileRoute } from '@tanstack/react-router'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/coursia-backup')({ component: Home })

type CommunityNode = {
  id: string
  label: string
  defaultOpen?: boolean
  children?: CommunityNode[]
}

type CourseNode = {
  id: string
  title: string
  groupNumber: string
  courseCode: string
}

type SemesterNode = {
  id: string
  label: string
  periodType: string
  periodNumber: string
  courses: CourseNode[]
  defaultOpen?: boolean
}

type PeriodNode = {
  id: string
  label: string
  semesters: SemesterNode[]
  defaultOpen?: boolean
}

const communities: CommunityNode[] = [
  {
    id: 'escuela-computacion',
    label: 'Escuela de Ingeniería en Computación',
    defaultOpen: true,
    children: [
      {
        id: 'estudiantes-ca',
        label: 'Estudiantes CA',
      },
      {
        id: 'computacion-cartago',
        label: 'Computación Cartago',
        children: [
          { id: 'estudiantes-ic-cartago', label: 'Estudiantes IC Cartago' },
          {
            id: 'estudiantes-nuevos-ic-cartago',
            label: 'Estudiantes Nuevos IC-Cartago',
          },
        ],
      },
    ],
  },
  {
    id: 'catedras',
    label: 'Cátedras',
    children: [
      { id: 'catedra-estadistica', label: 'Cátedra de Estadística' },
    ],
  },
  {
    id: 'estudiantes',
    label: 'Estudiantes',
    children: [
      {
        id: 'campus-central-cartago',
        label: 'Campus Tecnológico Central Cartago',
      },
    ],
  },
]

const periods: PeriodNode[] = [
  {
    id: '2026',
    label: '2026',
    defaultOpen: true,
    semesters: [
      {
        id: '2026-semestre-1',
        label: 'Semestre 1',
        periodType: 'S',
        periodNumber: '1',
        defaultOpen: true,
        courses: [
          { id: 'ingles-i-gr-7', title: 'Inglés I', groupNumber: '7', courseCode: 'CI1230' },
          { id: 'futbol-i-gr-3', title: 'Futbol I', groupNumber: '3', courseCode: 'SE1221' },
          {
            id: 'administracion-de-proyectos-gr-1',
            title: 'Administración de proyectos',
            groupNumber: '1',
            courseCode: 'IC4810',
          },
          {
            id: 'compiladores-e-interpretes-gr-1',
            title: 'Compiladores e intérpretes',
            groupNumber: '1',
            courseCode: 'IC5701',
          },
          {
            id: 'aseguramiento-calidad-software-gr-2',
            title: 'Aseguramiento de la calidad del software',
            groupNumber: '2',
            courseCode: 'IC6831',
          },
          {
            id: 'seminario-estudios-filosoficos-historicos-gr-2',
            title: 'Seminario de estudios filosóficos históricos',
            groupNumber: '2',
            courseCode: 'CS3401',
          },
          { id: 'estadistica-gr-2', title: 'Estadística', groupNumber: '2', courseCode: 'MA3405' },
        ],
      },
    ],
  },
  {
    id: '2025',
    label: '2025',
    semesters: [
      {
        id: '2025-verano-1',
        label: 'Verano 1',
        periodType: 'V',
        periodNumber: '1',
        courses: [
          { id: 'diseno-software-gr-50', title: 'Diseño de software', groupNumber: '50', courseCode: 'IC6821' },
        ],
      },
      {
        id: '2025-semestre-2',
        label: 'Semestre 2',
        periodType: 'S',
        periodNumber: '2',
        courses: [
          { id: 'apreciacion-cine-gr-3', title: 'Apreciación de cine', groupNumber: '3', courseCode: 'SE1107' },
          { id: 'bases-datos-ii-gr-2', title: 'Bases de datos II', groupNumber: '2', courseCode: 'IC4302' },
          {
            id: 'lenguajes-programacion-gr-2',
            title: 'Lenguajes de programación',
            groupNumber: '2',
            courseCode: 'IC4700',
          },
          {
            id: 'requerimientos-software-gr-1',
            title: 'Requerimientos de software',
            groupNumber: '1',
            courseCode: 'IC5821',
          },
          { id: 'probabilidades-gr-2', title: 'Probabilidades', groupNumber: '2', courseCode: 'MA2404' },
        ],
      },
      {
        id: '2025-semestre-1',
        label: 'Semestre 1',
        periodType: 'S',
        periodNumber: '1',
        courses: [
          { id: 'analisis-algoritmos-gr-2', title: 'Análisis de algoritmos', groupNumber: '2', courseCode: 'IC3002' },
          { id: 'bases-datos-i-gr-40', title: 'Bases de datos I', groupNumber: '40', courseCode: 'IC4301' },
          { id: 'ambiente-humano-gr-7', title: 'Ambiente humano', groupNumber: '7', courseCode: 'CS2101' },
          {
            id: 'calculo-algebra-lineal-gr-2',
            title: 'Cálculo y álgebra lineal',
            groupNumber: '2',
            courseCode: 'MA1103',
          },
        ],
      },
      {
        id: '2025-humanistica-2',
        label: 'Humanística 2',
        periodType: 'H',
        periodNumber: '2',
        courses: [
          {
            id: 'bomba-atomica-hiroshima-nagasaki-gr-60',
            title:
              'La bomba atómica en Hiroshima y Nagasaki y los esfuerzos de desarme',
            groupNumber: '60',
            courseCode: 'FH0051',
          },
        ],
      },
    ],
  },
  {
    id: '2024',
    label: '2024',
    semesters: [
      {
        id: '2024-verano-1',
        label: 'Verano 1',
        periodType: 'V',
        periodNumber: '1',
        courses: [
          {
            id: 'calculo-diferencial-integral-gr-1',
            title: 'Cálculo diferencial e integral',
            groupNumber: '1',
            courseCode: 'MA1102',
          },
        ],
      },
      {
        id: '2024-semestre-2',
        label: 'Semestre 2',
        periodType: 'S',
        periodNumber: '2',
        courses: [
          { id: 'comunicacion-oral-gr-24', title: 'Comunicación oral', groupNumber: '24', courseCode: 'CI1107' },
          { id: 'estructuras-datos-gr-40', title: 'Estructuras de datos', groupNumber: '40', courseCode: 'IC2001' },
          {
            id: 'programacion-orientada-objetos-gr-1',
            title: 'Programación orientada a objetos',
            groupNumber: '1',
            courseCode: 'IC2101',
          },
          {
            id: 'arquitectura-computadores-gr-1',
            title: 'Arquitectura de computadores',
            groupNumber: '1',
            courseCode: 'IC3101',
          },
          { id: 'matematica-general-gr-14', title: 'Matemática general', groupNumber: '14', courseCode: 'MA0101' },
        ],
      },
      {
        id: '2024-humanistica-6',
        label: 'Humanística 6',
        periodType: 'H',
        periodNumber: '6',
        courses: [
          {
            id: 'historia-arte-universal-gr-60',
            title: 'Historia del arte universal',
            groupNumber: '60',
            courseCode: 'FH0129',
          },
        ],
      },
      {
        id: '2024-humanistica-5',
        label: 'Humanística 5',
        periodType: 'H',
        periodNumber: '5',
        courses: [{ id: 'cuento-policial-gr-40', title: 'El cuento policial', groupNumber: '40', courseCode: 'FH0211' }],
      },
      {
        id: '2024-semestre-1',
        label: 'Semestre 1',
        periodType: 'S',
        periodNumber: '1',
        courses: [
          { id: 'comunicacion-escrita-gr-14', title: 'Comunicación escrita', groupNumber: '14', courseCode: 'CI1106' },
          { id: 'examen-diagnostico-gr-107', title: 'Examen diagnóstico', groupNumber: '107', courseCode: 'CI0200' },
          {
            id: 'juegos-deportes-conjunto-gr-4',
            title: 'Juegos y deportes en conjunto',
            groupNumber: '4',
            courseCode: 'SE1205',
          },
          {
            id: 'fundamentos-organizacion-computadoras-gr-2',
            title: 'Fundamentos de organización de computadoras',
            groupNumber: '2',
            courseCode: 'IC1400',
          },
          {
            id: 'introduccion-programacion-gr-4',
            title: 'Introducción a la programación',
            groupNumber: '4',
            courseCode: 'IC1802',
          },
          { id: 'taller-programacion-gr-4', title: 'Taller de programación', groupNumber: '4', courseCode: 'IC1803' },
          { id: 'matematica-discreta-gr-6', title: 'Matemática discreta', groupNumber: '6', courseCode: 'MA1403' },
        ],
      },
    ],
  },
]

function CollapseSquare() {
  return (
    <>
      <span className="text-base leading-none group-data-[panel-open]:hidden">+</span>
      <span className="hidden text-base leading-none group-data-[panel-open]:block">-</span>
    </>
  )
}

function CommunityItem({
  node,
  depth = 0,
  parentSegments = [],
}: {
  node: CommunityNode
  depth?: number
  parentSegments?: string[]
}) {
  const hasChildren = !!node.children?.length
  const indent = depth * 16
  const currentSegments = [...parentSegments, node.id]
  const communityPath = `/communities/${currentSegments.join('/')}`

  if (!hasChildren) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5" style={{ marginLeft: `${indent}px` }}>
        <span className="grid size-6 shrink-0 place-items-center text-muted-foreground">&bull;</span>
        <Link
          to={communityPath}
          className="flex-1 rounded-md text-base underline-offset-4 hover:underline"
        >
          {node.label}
        </Link>
      </div>
    )
  }

  return (
    <Collapsible defaultOpen={node.defaultOpen} className="space-y-1">
      <div
        className="flex items-center gap-2 rounded-md px-2 py-1.5"
        style={{ marginLeft: `${indent}px` }}
      >
        <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
          <CollapseSquare />
        </CollapsibleTrigger>
        <Link
          to={communityPath}
          className="flex-1 text-left text-base underline-offset-4 hover:underline"
        >
          {node.label}
        </Link>
      </div>
      <CollapsibleContent className="space-y-1 pl-1 md:pl-2">
        {node.children?.map((child) => (
          <CommunityItem
            key={child.id}
            node={child}
            depth={depth + 1}
            parentSegments={currentSegments}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

function CoursesTree() {
  return (
    <div className="space-y-2">
      {periods.map((period) => (
        <Collapsible key={period.id} defaultOpen={period.defaultOpen} className="space-y-1">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
              <CollapseSquare />
            </CollapsibleTrigger>
            <span className="text-base font-medium underline-offset-4 hover:underline">
              {period.label}
            </span>
          </div>
          <CollapsibleContent className="ml-4 space-y-1 md:ml-8">
            {period.semesters.map((semester) => (
              <Collapsible
                key={semester.id}
                defaultOpen={semester.defaultOpen}
                className="space-y-1"
              >
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
                    <CollapseSquare />
                  </CollapsibleTrigger>
                  <span className="text-base underline-offset-4 hover:underline">
                    {semester.label}
                  </span>
                </div>
                <CollapsibleContent className="ml-4 space-y-1 md:ml-8">
                  {semester.courses.map((course) => (
                    <div key={course.id} className="flex items-center gap-2 px-2 py-1.5">
                      <span className="grid size-6 shrink-0 place-items-center text-muted-foreground">
                        &bull;
                      </span>
                      <Link
                        to="/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber"
                        params={{
                          year: period.label,
                          periodType: semester.periodType,
                          periodNumber: semester.periodNumber,
                          courseCode: course.courseCode,
                          groupNumber: course.groupNumber,
                        }}
                        className="group flex flex-1 items-center justify-between gap-3 rounded-md text-base"
                      >
                        <span className="underline-offset-4 group-hover:underline">{course.title}</span>
                        <Badge variant="secondary" className="font-mono">
                          <span className="hidden sm:inline">Grupo </span>
                          <span className="sm:hidden">GR</span>
                          {course.groupNumber.padStart(2, '0')}
                        </Badge>
                      </Link>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}

function Home() {
  return (
    <div className="flex grow px-4 py-7 md:px-8">
      <div className="w-full max-w-2xl space-y-4">
        <section className="space-y-3">
          <Collapsible defaultOpen>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
                <CollapseSquare />
              </CollapsibleTrigger>
              <h2 className="text-xl font-semibold">Comunidades</h2>
            </div>
            <CollapsibleContent className="pt-1 pl-4 md:pl-8">
              <div className="space-y-2">
                {communities.map((community) => (
                  <CommunityItem key={community.id} node={community} />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>

        <section className="space-y-3">
          <Collapsible defaultOpen>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
                <CollapseSquare />
              </CollapsibleTrigger>
              <h2 className="text-xl font-semibold">Cursos</h2>
            </div>
            <CollapsibleContent className="pt-1 pl-4 md:pl-8">
              <CoursesTree />
            </CollapsibleContent>
          </Collapsible>
        </section>
      </div>
    </div>
  )
}
