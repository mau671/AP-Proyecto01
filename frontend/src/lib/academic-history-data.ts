import { academicYears, enrolledCourses } from './student-data'

export interface GradeRecord {
  code: string
  name: string
  group: string
  professor: string
  credits: number
  grade: number
  year: string
  period: string
  status: 'Aprobado' | 'Reprobado' | 'En curso' | 'Retirado' | 'Reconocido' | 'Suficiencia'
  statusColor: string
  modality: 'S' | 'V' | 'H'
}

// Map academicYears into historical courses
const historicalCourses: GradeRecord[] = academicYears.flatMap((year) =>
  year.periods.flatMap((period) =>
    period.courses.map((course) => {
      const isApproved = course.grade >= 70
      return {
        code: course.code,
        name: course.name,
        group: course.group,
        professor: course.professor,
        credits: course.credits,
        grade: course.grade,
        year: year.year,
        period: period.period,
        status: isApproved ? 'Aprobado' : 'Reprobado',
        statusColor: isApproved ? 'bg-emerald-500' : 'bg-rose-500',
        modality: period.period.includes('Semestre')
          ? 'S'
          : period.period.includes('Verano')
            ? 'V'
            : 'H',
      }
    })
  )
)

// Active courses from the current period (2026 Semestre I)
const activeCourses: GradeRecord[] = enrolledCourses.map((course) => ({
  code: course.code,
  name: course.name,
  group: course.group,
  professor: course.professor,
  credits: course.credits,
  grade: course.grade,
  year: '2026',
  period: 'Semestre I',
  status: 'En curso',
  statusColor: 'bg-amber-500',
  modality: 'S',
}))

// Add some extra simulated records to make the status counts and interface more realistic
const extraSimulatedCourses: GradeRecord[] = [
  {
    code: 'MA1001',
    name: 'Precálculo',
    group: '10',
    professor: 'Marta Gomez Alvarado',
    credits: 0,
    grade: 0,
    year: '2024',
    period: 'Semestre I',
    status: 'Reconocido',
    statusColor: 'bg-blue-500',
    modality: 'S',
  },
  {
    code: 'IC2000',
    name: 'Introducción a la Computación',
    group: '1',
    professor: 'Carlos Ortega Rojas',
    credits: 2,
    grade: 0,
    year: '2024',
    period: 'Semestre I',
    status: 'Retirado',
    statusColor: 'bg-purple-500',
    modality: 'S',
  },
  {
    code: 'FH0011',
    name: 'Taller de Teatro por Suficiencia',
    group: '90',
    professor: 'Luis Diego Solano',
    credits: 2,
    grade: 95,
    year: '2025',
    period: 'Verano I',
    status: 'Suficiencia',
    statusColor: 'bg-cyan-500',
    modality: 'H',
  }
]

export const gradeRegistry = [...activeCourses, ...historicalCourses, ...extraSimulatedCourses]

// Sort registry: 2026 desc, then year desc, then period, then name
export const getSortedGradeRegistry = () => {
  return [...gradeRegistry].sort((a, b) => {
    if (a.year !== b.year) {
      return b.year.localeCompare(a.year)
    }
    // Simple order for periods within the same year
    const periodOrder: Record<string, number> = {
      'Semestre II': 1,
      'Semestre I': 2,
      'Verano I': 3,
      'Humanística VI': 4,
      'Humanística V': 5,
      'Humanística II': 6,
    }
    const orderA = periodOrder[a.period] || 99
    const orderB = periodOrder[b.period] || 99
    return orderA - orderB
  })
}

// Compute statistics dynamically
const gradedHistorical = historicalCourses.filter((c) => c.credits > 0)
const totalCreditsForGPA = gradedHistorical.reduce((sum, c) => sum + c.credits, 0)
const totalWeightedGrade = gradedHistorical.reduce((sum, c) => sum + c.grade * c.credits, 0)
const gpa = totalCreditsForGPA > 0 ? Number((totalWeightedGrade / totalCreditsForGPA).toFixed(2)) : 84.47

const hoursCursadas = gradeRegistry.reduce((sum, c) => sum + c.credits, 0)

const counts = {
  Aprobadas: gradeRegistry.filter((c) => c.status === 'Aprobado').length,
  'En curso': gradeRegistry.filter((c) => c.status === 'En curso').length,
  Reprobadas: gradeRegistry.filter((c) => c.status === 'Reprobado').length,
  Retiradas: gradeRegistry.filter((c) => c.status === 'Retirado').length,
  Reconocidas: gradeRegistry.filter((c) => c.status === 'Reconocido').length,
  'Aprobadas por suficiencia': gradeRegistry.filter((c) => c.status === 'Suficiencia').length,
  Pendientes: 1, // Simulated pending course in curriculum
  Congeladas: 0,
}

const approvedCourses = gradeRegistry.filter((c) => c.status === 'Aprobado' || c.status === 'Suficiencia')
const failedCourses = gradeRegistry.filter((c) => c.status === 'Reprobado')

const approvedCount = approvedCourses.length
const failedCount = failedCourses.length
const totalHistoricalCount = approvedCount + failedCount

const approvedCredits = approvedCourses.reduce((sum, c) => sum + c.credits, 0)
const failedCredits = failedCourses.reduce((sum, c) => sum + c.credits, 0)

const approvedAverage =
  approvedCount > 0
    ? Number((approvedCourses.reduce((sum, c) => sum + c.grade, 0) / approvedCount).toFixed(2))
    : 0
const failedAverage =
  failedCount > 0
    ? Number((failedCourses.reduce((sum, c) => sum + c.grade, 0) / failedCount).toFixed(2))
    : 0

const approvedPercent = totalHistoricalCount > 0 ? Number(((approvedCount / totalHistoricalCount) * 100).toFixed(0)) : 95
const failedPercent = totalHistoricalCount > 0 ? 100 - approvedPercent : 5

export const academicStats = {
  gpa,
  hoursCursadas,
  counts,
  approval: {
    approvedPercent,
    failedPercent,
    approvedCount,
    failedCount,
    approvedCredits,
    failedCredits,
    approvedAverage,
    failedAverage,
  },
}

// Weighted averages per period
export const weightedAverages = academicYears.flatMap((year) =>
  year.periods.map((period) => ({
    year: year.year,
    period: period.period,
    modality: period.period.includes('Semestre')
      ? 'S'
      : period.period.includes('Verano')
        ? 'V'
        : 'H',
    average: period.average,
    credits: period.credits,
  }))
)
