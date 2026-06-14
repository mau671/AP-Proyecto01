import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { FileDown, Calendar, GraduationCap, Award, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataTable } from '@/components/ui/data-table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Pie, PieChart, Label } from 'recharts'
import type { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import {
  academicStats,
  getSortedGradeRegistry,
  weightedAverages,
  type GradeRecord,
} from '@/lib/academic-history-data'

export const Route = createFileRoute('/profile/academic-history')({
  component: ProfileAcademicHistory,
})

function ProfileAcademicHistory() {
  const [activeView, setActiveView] = useState<'stats' | 'notes' | 'weighted'>('stats')

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Segmented Control RadioGroup */}
      <RadioGroup
        value={activeView}
        onValueChange={(val) => setActiveView(val as any)}
        className="flex flex-col sm:flex-row gap-1 rounded-lg border border-border p-1 bg-muted/30"
      >
        <label
          className={cn(
            'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all select-none',
            activeView === 'stats'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          )}
        >
          <RadioGroupItem value="stats" className="sr-only" />
          <Award className="size-4" />
          Estadísticas académicas
        </label>
        <label
          className={cn(
            'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all select-none',
            activeView === 'notes'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          )}
        >
          <RadioGroupItem value="notes" className="sr-only" />
          <GraduationCap className="size-4" />
          Registro de notas
        </label>
        <label
          className={cn(
            'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all select-none',
            activeView === 'weighted'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          )}
        >
          <RadioGroupItem value="weighted" className="sr-only" />
          <Calendar className="size-4" />
          Promedio ponderado
        </label>
      </RadioGroup>

      {/* Sub-view Rendering */}
      <div className="pt-2">
        {activeView === 'stats' && <AcademicStatsView />}
        {activeView === 'notes' && <GradeRegistryView />}
        {activeView === 'weighted' && <WeightedAverageView />}
      </div>

      {/* Footer and PDF Download */}
      <div className="flex justify-end pt-4 mt-2">
        <Button
          onClick={() => {
            toast.success('Descarga iniciada', {
              description: 'El documento de Historial Académico PDF se está generando.',
            })
          }}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <FileDown className="mr-2 size-4" />
          Descargar PDF
        </Button>
      </div>
    </div>
  )
}

/* ==========================================================================
   1. Sub-vista: Estadísticas académicas
   ========================================================================== */
function AcademicStatsView() {
  const { gpa, hoursCursadas, counts, approval } = academicStats

  // Data for the Donut Chart
  const chartData = useMemo(() => {
    return [
      { status: 'Aprobadas', count: counts['Aprobadas'] || 0, fill: 'var(--color-aprobadas)' },
      { status: 'En curso', count: counts['En curso'] || 0, fill: 'var(--color-encurso)' },
      { status: 'Reprobadas', count: counts['Reprobadas'] || 0, fill: 'var(--color-reprobadas)' },
      { status: 'Retiradas', count: counts['Retiradas'] || 0, fill: 'var(--color-retiradas)' },
      { status: 'Reconocidas', count: counts['Reconocidas'] || 0, fill: 'var(--color-reconocidas)' },
      { status: 'Suficiencia', count: counts['Aprobadas por suficiencia'] || 0, fill: 'var(--color-suficiencia)' },
      { status: 'Pendientes', count: counts['Pendientes'] || 0, fill: 'var(--color-pendientes)' },
      { status: 'Congeladas', count: counts['Congeladas'] || 0, fill: 'var(--color-congeladas)' },
    ].filter((d) => d.count > 0)
  }, [counts])

  const totalSubjects = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [chartData])

  const chartConfig = {
    count: { label: 'Materias' },
    aprobadas: { 
      label: 'Aprobadas', 
      theme: { light: '#059669', dark: '#10b981' } // emerald-600 / emerald-500
    },
    encurso: { 
      label: 'En curso', 
      theme: { light: '#d97706', dark: '#f59e0b' } // amber-600 / amber-500
    },
    reprobadas: { 
      label: 'Reprobadas', 
      theme: { light: '#e11d48', dark: '#f43f5e' } // rose-600 / rose-500
    },
    retiradas: { 
      label: 'Retiradas', 
      theme: { light: '#9333ea', dark: '#a855f7' } // purple-600 / purple-500
    },
    reconocidas: { 
      label: 'Reconocidas', 
      theme: { light: '#2563eb', dark: '#3b82f6' } // blue-600 / blue-500
    },
    suficiencia: { 
      label: 'Suficiencia', 
      theme: { light: '#0891b2', dark: '#06b6d4' } // cyan-600 / cyan-500
    },
    pendientes: { label: 'Pendientes', color: 'hsl(var(--muted-foreground))' },
    congeladas: { label: 'Congeladas', color: 'hsl(var(--muted))' },
  } satisfies ChartConfig

  return (
    <div className="space-y-6">
      {/* Promedio Ponderado General Card */}
      <Card className="p-6 gap-6 border-border shadow-sm">
        <h3 className="text-base font-semibold text-foreground">Promedio ponderado general</h3>
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Circular GPA Visualizer */}
          <div className="relative flex size-28 shrink-0 items-center justify-center rounded-full border-4 border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="text-center">
              <span className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                {gpa}
              </span>
              <span className="block text-[10px] uppercase font-bold text-muted-foreground mt-0.5">
                Ponderado
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-2">
              <div className="relative">
                <Progress
                  value={gpa}
                  className="h-8 [&_[data-slot=progress-track]]:h-8 [&_[data-slot=progress-indicator]]:bg-emerald-500/85 [&_[data-slot=progress-indicator]]:dark:bg-emerald-600/85 rounded-md"
                />
                <div className="absolute inset-0 flex items-center justify-between px-4 text-xs sm:text-sm font-semibold text-foreground">
                  <span>Rendimiento global: {gpa}%</span>
                  <span>{hoursCursadas} créditos cursados</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              El promedio ponderado general incluye todas las asignaturas aprobadas y reprobadas. Los cursos convalidados o retirados no afectan este cálculo.
            </p>
          </div>
        </div>
      </Card>

      {/* Aprobación de Cursos Card */}
      <Card className="p-6 gap-6 border-border shadow-sm">
        <h3 className="text-base font-semibold text-foreground">Distribución de cursos aprobados</h3>
        <div className="space-y-6">
          {/* Segmented bar */}
          <div className="relative flex h-8 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
            <div
              className="bg-teal-600 dark:bg-teal-500 transition-all text-white flex items-center justify-center text-xs font-bold"
              style={{ width: `${approval.approvedPercent}%` }}
            >
              {approval.approvedPercent}% Aprobados
            </div>
            <div
              className="bg-muted-foreground/30 transition-all text-foreground dark:text-muted-foreground flex items-center justify-center text-xs font-bold"
              style={{ width: `${approval.failedPercent}%` }}
            >
              {approval.failedPercent > 0 ? `${approval.failedPercent}% Reprobados` : ''}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Left: Aprobados */}
            <div className="space-y-3 sm:border-r sm:border-border/60 sm:pr-6">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-teal-600 dark:bg-teal-500" />
                <span className="font-semibold text-sm">Cursos aprobados / suficiencia</span>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Total cursos</span>
                  <span className="font-semibold">{approval.approvedCount}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Créditos obtenidos</span>
                  <span className="font-semibold">{approval.approvedCredits}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Promedio aprobado</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">{approval.approvedAverage}</span>
                </div>
              </div>
            </div>

            {/* Right: Reprobados */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-muted-foreground/40" />
                <span className="font-semibold text-sm">Cursos reprobados</span>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Total cursos</span>
                  <span className="font-semibold">{approval.failedCount}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Créditos perdidos</span>
                  <span className="font-semibold">{approval.failedCredits}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Promedio reprobado</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">{approval.failedAverage}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Detalle del Curso - Stat Grid */}
      <Card className="p-6 gap-6 border-border shadow-sm">
        <h3 className="text-base font-semibold text-foreground">Resumen de asignaturas</h3>
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 gap-4">
            {chartData.map((item) => {
              return (
                <div key={item.status} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-xs text-muted-foreground font-medium">{item.status}</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground ml-5">{item.count}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="w-full md:w-[300px] shrink-0">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
                paddingAngle={2}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalSubjects}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground text-xs"
                          >
                            Materias
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
        </div>
      </Card>
    </div>
  )
}

/* ==========================================================================
   2. Sub-vista: Registro de notas (con Collapsibles)
   ========================================================================== */
function GradeRegistryView() {
  const [filter, setFilter] = useState<'all' | 'approved' | 'failed'>('all')
  const [openYears, setOpenYears] = useState<Record<string, boolean>>({ '2026': true, '2025': true })

  const handleToggleYear = (year: string) => {
    setOpenYears((prev) => ({ ...prev, [year]: !prev[year] }))
  }

  // Filter registry
  const filteredGrades = getSortedGradeRegistry().filter((item) => {
    if (filter === 'all') return true
    if (filter === 'approved') return item.status === 'Aprobado' || item.status === 'Suficiencia' || item.status === 'Reconocido'
    if (filter === 'failed') return item.status === 'Reprobado'
    return true
  })

  // Group by year
  const gradesByYear: Record<string, GradeRecord[]> = {}
  filteredGrades.forEach((item) => {
    if (!gradesByYear[item.year]) {
      gradesByYear[item.year] = []
    }
    gradesByYear[item.year].push(item)
  })

  // Unique sorted years list desc
  const years = Object.keys(gradesByYear).sort((a, b) => b.localeCompare(a))

  const modalityLabels = {
    S: 'Semestre',
    V: 'Verano',
    H: 'Humanística',
  }

  const gradeColumns: ColumnDef<GradeRecord>[] = [
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center gap-2">
            <span className={cn('size-2.5 rounded-full shrink-0', item.statusColor)} />
            <span className="text-xs font-semibold text-foreground md:hidden block">
              {item.status}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'name',
      header: 'Materia',
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-medium text-foreground text-sm line-clamp-2 md:line-clamp-none">
              {item.code}: {item.name}
            </span>
            <Badge variant="secondary" className="text-[10px] uppercase font-mono px-1.5 py-0 h-5 leading-none">
              GR {item.group}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: 'period',
      header: 'Periodo',
      cell: ({ row }) => <span className="text-sm font-medium">{row.getValue('period')}</span>,
    },
    {
      accessorKey: 'modality',
      header: 'Modalidad',
      cell: ({ row }) => {
        const modality = row.getValue('modality') as 'S' | 'V' | 'H'
        return <span className="text-xs font-semibold">{modalityLabels[modality]}</span>
      },
    },
    {
      accessorKey: 'credits',
      header: () => <div className="text-center">Créditos</div>,
      cell: ({ row }) => <div className="text-center font-mono text-sm font-medium">{row.getValue('credits')}</div>,
    },
    {
      accessorKey: 'grade',
      header: () => <div className="text-right">Nota</div>,
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="text-right font-mono text-sm font-bold">
            {item.status === 'En curso' ? (
              <span className="text-amber-600 dark:text-amber-400">EC</span>
            ) : item.status === 'Reconocido' ? (
              <span className="text-blue-600 dark:text-blue-400">REC</span>
            ) : (
              <span
                className={cn(
                  item.grade >= 70
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                )}
              >
                {item.grade}
              </span>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      {/* Filter Selector */}
      <div className="flex items-center justify-between pb-3">
        <span className="text-sm font-semibold">Filtrar materias:</span>
        <Tabs value={filter} onValueChange={(val) => setFilter(val as any)}>
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="approved">Aprobadas</TabsTrigger>
            <TabsTrigger value="failed">Reprobadas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Grouped Tables in Collapsibles */}
      <div className="space-y-3">
        {years.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            No se encontraron materias con el filtro seleccionado.
          </div>
        ) : (
          years.map((year) => {
            const items = gradesByYear[year]
            const isOpen = openYears[year] ?? false

            return (
              <Collapsible key={year} open={isOpen} onOpenChange={() => handleToggleYear(year)}>
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  {/* Trigger Header */}
                  <CollapsibleTrigger className="group flex w-full items-center justify-between px-4 py-3 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold tracking-tight text-foreground">{year}</span>
                      <Badge variant="secondary" className="font-mono">
                        {items.length} {items.length === 1 ? 'materia' : 'materias'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-center size-8 text-muted-foreground group-hover:text-foreground transition-colors">
                      {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </div>
                  </CollapsibleTrigger>

                  {/* Collapsible Content */}
                  <CollapsibleContent>
                    <div className="p-4 pt-0">
                      <DataTable
                        columns={gradeColumns}
                        data={items}
                        columnLabels={{
                          status: 'Estado',
                          name: 'Materia',
                          period: 'Periodo',
                          modality: 'Modalidad',
                          credits: 'Créditos',
                          grade: 'Nota',
                        }}
                      />
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )
          })
        )}
      </div>

      {/* Legend & Symbology */}
      <Card className="p-4 border-border/80 bg-muted/10">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Simbología de estados
        </h4>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-emerald-500" />
            <span className="font-medium">Aprobado (≥ 70)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-amber-500" />
            <span className="font-medium">En curso (cursando actual)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-500" />
            <span className="font-medium">Reprobado (&lt; 70)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-purple-500" />
            <span className="font-medium">Retirado (retiro formal)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-blue-500" />
            <span className="font-medium">Reconocido (equivalencia)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-cyan-500" />
            <span className="font-medium">Aprobado por suficiencia</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

/* ==========================================================================
   3. Sub-vista: Promedio ponderado (por periodos)
   ========================================================================== */
function WeightedAverageView() {
  const modalityLabels = {
    S: 'Semestral',
    V: 'Verano',
    H: 'Humanística',
  }

  // Sort averages: 2025 Semestre II, 2025 Semestre I, etc.
  const sortedAverages = [...weightedAverages].sort((a, b) => {
    if (a.year !== b.year) {
      return b.year.localeCompare(a.year)
    }
    const order: Record<string, number> = {
      'Semestre II': 1,
      'Semestre I': 2,
      'Verano I': 3,
      'Humanística VI': 4,
      'Humanística V': 5,
      'Humanística II': 6,
    }
    return (order[a.period] || 99) - (order[b.period] || 99)
  })

  const columns: ColumnDef<typeof sortedAverages[0]>[] = [
    {
      accessorKey: 'year',
      header: 'Año académico',
      cell: ({ row }) => <span className="font-bold text-foreground">{row.getValue('year')}</span>,
    },
    {
      accessorKey: 'modality',
      header: 'Modalidad',
      cell: ({ row }) => {
        const modality = row.getValue('modality') as string
        return (
          <Badge
            variant={
              modality === 'S'
                ? 'default'
                : modality === 'V'
                  ? 'secondary'
                  : 'outline'
            }
          >
            {modalityLabels[modality as keyof typeof modalityLabels]}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'period',
      header: 'Periodo',
      cell: ({ row }) => <span className="font-medium">{row.getValue('period')}</span>,
    },
    {
      accessorKey: 'credits',
      header: () => <div className="text-center">Créditos cursados</div>,
      cell: ({ row }) => <div className="text-center font-mono text-sm">{row.getValue('credits')}</div>,
    },
    {
      accessorKey: 'average',
      header: () => <div className="text-right">Promedio ponderado</div>,
      cell: ({ row }) => {
        const average = row.getValue('average') as number
        return (
          <div className="text-right font-mono font-bold text-sm text-foreground">
            <span
              className={cn(
                average >= 70
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              )}
            >
              {average.toFixed(2)}
            </span>
          </div>
        )
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={sortedAverages}
      columnLabels={{
        year: 'Año académico',
        modality: 'Modalidad',
        period: 'Periodo',
        credits: 'Créditos cursados',
        average: 'Promedio ponderado',
      }}
    />
  )
}
