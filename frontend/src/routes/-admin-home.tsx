import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { UsersIcon, BookOpenIcon, CalendarIcon, LayoutDashboardIcon, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card'
import type { DemoUser } from '@/lib/demo-auth'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, LabelList } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const quickLinks = [
  { label: 'Estudiantes', description: 'Gestión de estudiantes', route: '/management/students', icon: UsersIcon },
  { label: 'Docentes', description: 'Gestión de docentes', route: '/management/teachers', icon: UsersIcon },
  { label: 'Cursos', description: 'Gestión de cursos', route: '/management/courses', icon: BookOpenIcon },
  { label: 'Periodos', description: 'Gestión de periodos académicos', route: '/management/periods', icon: CalendarIcon },
] as const

const academicData = [
  { metric: "Tasa de retención", value: 92 },
  { metric: "Promedio general", value: 84.5 },
  { metric: "Cursos aprobados", value: 78 },
]

const academicConfig = {
  value: { label: "Porcentaje (%)", color: "var(--chart-1)" },
} satisfies ChartConfig

const interactiveData = [
  { date: "2024-04-01", estudiantes: 1102, docentes: 171, cursos: 301, ingresos: 121 },
  { date: "2024-04-02", estudiantes: 1195, docentes: 181, cursos: 310, ingresos: 135 },
  { date: "2024-04-03", estudiantes: 1080, docentes: 168, cursos: 290, ingresos: 110 },
  { date: "2024-04-04", estudiantes: 1210, docentes: 185, cursos: 320, ingresos: 140 },
  { date: "2024-04-05", estudiantes: 1150, docentes: 175, cursos: 305, ingresos: 125 },
  { date: "2024-04-06", estudiantes: 1220, docentes: 184, cursos: 325, ingresos: 145 },
  { date: "2024-04-07", estudiantes: 1125, docentes: 170, cursos: 300, ingresos: 120 },
  { date: "2024-04-08", estudiantes: 1180, docentes: 178, cursos: 315, ingresos: 130 },
  { date: "2024-04-09", estudiantes: 1050, docentes: 160, cursos: 280, ingresos: 105 },
  { date: "2024-04-10", estudiantes: 1135, docentes: 172, cursos: 305, ingresos: 125 },
  { date: "2024-04-11", estudiantes: 1240, docentes: 188, cursos: 330, ingresos: 150 },
  { date: "2024-04-12", estudiantes: 1142, docentes: 176, cursos: 306, ingresos: 129 },
  { date: "2024-04-13", estudiantes: 1185, docentes: 180, cursos: 315, ingresos: 135 },
  { date: "2024-04-14", estudiantes: 1110, docentes: 170, cursos: 295, ingresos: 120 },
  { date: "2024-04-15", estudiantes: 1155, docentes: 177, cursos: 308, ingresos: 132 },
  { date: "2024-04-16", estudiantes: 1190, docentes: 182, cursos: 318, ingresos: 142 },
  { date: "2024-04-17", estudiantes: 1065, docentes: 165, cursos: 285, ingresos: 115 },
  { date: "2024-04-18", estudiantes: 1170, docentes: 179, cursos: 310, ingresos: 135 },
  { date: "2024-04-19", estudiantes: 1225, docentes: 186, cursos: 325, ingresos: 146 },
  { date: "2024-04-20", estudiantes: 1180, docentes: 180, cursos: 311, ingresos: 137 },
  { date: "2024-04-21", estudiantes: 1145, docentes: 175, cursos: 302, ingresos: 128 },
  { date: "2024-04-22", estudiantes: 1190, docentes: 181, cursos: 312, ingresos: 139 },
  { date: "2024-04-23", estudiantes: 1235, docentes: 187, cursos: 328, ingresos: 148 },
  { date: "2024-04-24", estudiantes: 1100, docentes: 168, cursos: 294, ingresos: 121 },
  { date: "2024-04-25", estudiantes: 1210, docentes: 182, cursos: 315, ingresos: 142 },
  { date: "2024-04-26", estudiantes: 1175, docentes: 178, cursos: 306, ingresos: 133 },
  { date: "2024-04-27", estudiantes: 1220, docentes: 183, cursos: 317, ingresos: 144 },
  { date: "2024-04-28", estudiantes: 1190, docentes: 180, cursos: 310, ingresos: 138 },
  { date: "2024-04-29", estudiantes: 1240, docentes: 184, cursos: 319, ingresos: 145 },
  { date: "2024-04-30", estudiantes: 1245, docentes: 184, cursos: 320, ingresos: 146 },
]

const interactiveConfig = {
  estudiantes: { label: "Estudiantes", color: "var(--chart-1)" },
  docentes: { label: "Docentes", color: "var(--chart-2)" },
  cursos: { label: "Cursos", color: "var(--chart-3)" },
  ingresos: { label: "Ingresos", color: "var(--chart-4)" },
} satisfies ChartConfig

export function AdminHome({ user }: { user: DemoUser }) {
  if (user.role !== 'admin') return null

  return (
    <main className="w-full grow px-4 py-6 md:px-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Bienvenido, {user.name}
            </h1>
            <p className="text-muted-foreground mt-1">Dashboard ejecutivo institucional</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estudiantes activos</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground">+5.2% este mes</p>
                <div className="mt-4 h-[80px]">
                  <ChartContainer config={{ estudiantes: interactiveConfig.estudiantes }} className="h-full w-full">
                    <LineChart data={interactiveData}>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Line type="monotone" dataKey="estudiantes" stroke="var(--color-estudiantes)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Docentes</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">184</div>
                <p className="text-xs text-muted-foreground">+1.2% este mes</p>
                <div className="mt-4 h-[80px]">
                  <ChartContainer config={{ docentes: interactiveConfig.docentes }} className="h-full w-full">
                    <LineChart data={interactiveData}>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Line type="monotone" dataKey="docentes" stroke="var(--color-docentes)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cursos activos</CardTitle>
                <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">320</div>
                <p className="text-xs text-muted-foreground">+8.4% este mes</p>
                <div className="mt-4 h-[80px]">
                  <ChartContainer config={{ cursos: interactiveConfig.cursos }} className="h-full w-full">
                    <LineChart data={interactiveData}>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Line type="monotone" dataKey="cursos" stroke="var(--color-cursos)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₡145.5M</div>
                <p className="text-xs text-muted-foreground">+12.5% este mes</p>
                <div className="mt-4 h-[80px]">
                  <ChartContainer config={{ ingresos: interactiveConfig.ingresos }} className="h-full w-full">
                    <LineChart data={interactiveData}>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Line type="monotone" dataKey="ingresos" stroke="var(--color-ingresos)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Métricas académicas</CardTitle>
              <CardDescription>2026: Semestre I</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <ChartContainer config={academicConfig} className="h-[250px] w-full">
                <BarChart
                  accessibilityLayer
                  data={academicData}
                  margin={{ top: 20 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="metric"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis hide domain={[0, 100]} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={8}>
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                      formatter={(value: number) => `${value}%`}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Tendencia positiva de 5.2% este mes <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Mostrando los promedios y métricas de retención de toda la institución
              </div>
            </CardFooter>
          </Card>
        </div>

        <aside className="h-fit rounded-xl border border-border p-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-muted">
              <LayoutDashboardIcon className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold">Accesos rápidos</h2>
              <p className="text-sm text-muted-foreground">Gestión universitaria</p>
            </div>
          </div>

          <div className="space-y-3">
            {quickLinks.map(({ label, description, route, icon: Icon }) => (
              <Link key={label} to={route}>
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
    </main>
  )
}
