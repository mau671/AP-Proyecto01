export type CourseRouteParams = {
  year: string
  periodType: string
  periodNumber: string
  courseCode: string
  groupNumber: string
}

export type CourseCatalogItem = CourseRouteParams & {
  title: string
}

export const courseCatalog: CourseCatalogItem[] = [
  { year: '2026', periodType: 'S', periodNumber: '1', courseCode: 'CI1230', groupNumber: '7', title: 'Inglés I' },
  { year: '2026', periodType: 'S', periodNumber: '1', courseCode: 'SE1221', groupNumber: '3', title: 'Futbol I' },
  { year: '2026', periodType: 'S', periodNumber: '1', courseCode: 'IC4810', groupNumber: '1', title: 'Administración de proyectos' },
  { year: '2026', periodType: 'S', periodNumber: '1', courseCode: 'IC5701', groupNumber: '1', title: 'Compiladores e intérpretes' },
  { year: '2026', periodType: 'S', periodNumber: '1', courseCode: 'IC6831', groupNumber: '2', title: 'Aseguramiento de la calidad del software' },
  { year: '2026', periodType: 'S', periodNumber: '1', courseCode: 'CS3401', groupNumber: '2', title: 'Seminario de estudios filosóficos históricos' },
  { year: '2026', periodType: 'S', periodNumber: '1', courseCode: 'MA3405', groupNumber: '2', title: 'Estadística' },
  { year: '2025', periodType: 'V', periodNumber: '1', courseCode: 'IC6821', groupNumber: '50', title: 'Diseño de software' },
  { year: '2025', periodType: 'S', periodNumber: '2', courseCode: 'SE1107', groupNumber: '3', title: 'Apreciación de cine' },
  { year: '2025', periodType: 'S', periodNumber: '2', courseCode: 'IC4302', groupNumber: '2', title: 'Bases de datos II' },
  { year: '2025', periodType: 'S', periodNumber: '2', courseCode: 'IC4700', groupNumber: '2', title: 'Lenguajes de programación' },
  { year: '2025', periodType: 'S', periodNumber: '2', courseCode: 'IC5821', groupNumber: '1', title: 'Requerimientos de software' },
  { year: '2025', periodType: 'S', periodNumber: '2', courseCode: 'MA2404', groupNumber: '2', title: 'Probabilidades' },
  { year: '2025', periodType: 'S', periodNumber: '1', courseCode: 'IC3002', groupNumber: '2', title: 'Análisis de algoritmos' },
  { year: '2025', periodType: 'S', periodNumber: '1', courseCode: 'IC4301', groupNumber: '40', title: 'Bases de datos I' },
  { year: '2025', periodType: 'S', periodNumber: '1', courseCode: 'CS2101', groupNumber: '7', title: 'Ambiente humano' },
  { year: '2025', periodType: 'S', periodNumber: '1', courseCode: 'MA1103', groupNumber: '2', title: 'Cálculo y álgebra lineal' },
  { year: '2025', periodType: 'H', periodNumber: '2', courseCode: 'FH0051', groupNumber: '60', title: 'La bomba atómica en Hiroshima y Nagasaki y los esfuerzos de desarme' },
  { year: '2024', periodType: 'V', periodNumber: '1', courseCode: 'MA1102', groupNumber: '1', title: 'Cálculo diferencial e integral' },
  { year: '2024', periodType: 'S', periodNumber: '2', courseCode: 'CI1107', groupNumber: '24', title: 'Comunicación oral' },
  { year: '2024', periodType: 'S', periodNumber: '2', courseCode: 'IC2001', groupNumber: '40', title: 'Estructuras de datos' },
  { year: '2024', periodType: 'S', periodNumber: '2', courseCode: 'IC2101', groupNumber: '1', title: 'Programación orientada a objetos' },
  { year: '2024', periodType: 'S', periodNumber: '2', courseCode: 'IC3101', groupNumber: '1', title: 'Arquitectura de computadores' },
  { year: '2024', periodType: 'S', periodNumber: '2', courseCode: 'MA0101', groupNumber: '14', title: 'Matemática general' },
  { year: '2024', periodType: 'H', periodNumber: '6', courseCode: 'FH0129', groupNumber: '60', title: 'Historia del arte universal' },
  { year: '2024', periodType: 'H', periodNumber: '5', courseCode: 'FH0211', groupNumber: '40', title: 'El cuento policial' },
  { year: '2024', periodType: 'S', periodNumber: '1', courseCode: 'CI1106', groupNumber: '14', title: 'Comunicación escrita' },
  { year: '2024', periodType: 'S', periodNumber: '1', courseCode: 'CI0200', groupNumber: '107', title: 'Examen diagnóstico' },
  { year: '2024', periodType: 'S', periodNumber: '1', courseCode: 'SE1205', groupNumber: '4', title: 'Juegos y deportes en conjunto' },
  { year: '2024', periodType: 'S', periodNumber: '1', courseCode: 'IC1400', groupNumber: '2', title: 'Fundamentos de organización de computadoras' },
  { year: '2024', periodType: 'S', periodNumber: '1', courseCode: 'IC1802', groupNumber: '4', title: 'Introducción a la programación' },
  { year: '2024', periodType: 'S', periodNumber: '1', courseCode: 'IC1803', groupNumber: '4', title: 'Taller de programación' },
  { year: '2024', periodType: 'S', periodNumber: '1', courseCode: 'MA1403', groupNumber: '6', title: 'Matemática discreta' },
]

export function getCourseByParams(params: CourseRouteParams) {
  return courseCatalog.find(
    (course) =>
      course.year === params.year &&
      course.periodType === params.periodType &&
      course.periodNumber === params.periodNumber &&
      course.courseCode === params.courseCode &&
      course.groupNumber === params.groupNumber,
  )
}

export function getPeriodLabel(periodType: string, periodNumber: string) {
  const t = periodType.toUpperCase()
  if (t === 'S') return `Semestre ${periodNumber}`
  if (t === 'V') return `Verano ${periodNumber}`
  if (t === 'H') return `Humanística ${periodNumber}`
  return `${t} ${periodNumber}`
}
