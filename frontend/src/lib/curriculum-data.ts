export type CourseStatus = 'approved' | 'failed' | 'not_taken' | 'withdrawn' | 'in_progress'

export type CurriculumCourse = {
  id: string
  code: string
  name: string
  credits: number
  hours: number
  status: CourseStatus
  prerequisites: string[]
  corequisites: string[]
}

export type CurriculumPeriod = {
  levelNumber: number
  levelLabel: string
  courses: CurriculumCourse[]
}

export type CurriculumPlanDetail = {
  plan: {
    id: number
    externalPlanId: number
    name: string
    academicDegree: string
    modalityName: string
  }
  periods: CurriculumPeriod[]
}

type CourseRow = [number, number, string, number, number, number, string, string]
type RelationRow = [number, number, 'PREREQUISITE' | 'COREQUISITE']

const currentCourseCodes = new Set(['CI1230', 'CS3401', 'IC4810', 'IC5701', 'IC6831', 'MA3405'])
const approvedCourseCodes = new Set([
  'CI0200', 'CI0202', 'MA0101', 'CI1106', 'IC1400', 'IC1802', 'IC1803', 'MA1403', 'SE1100',
  'CI1107', 'FH1000', 'IC2001', 'IC2101', 'IC3101', 'MA1102', 'SE1200', 'CI1231', 'IC3002',
  'IC4301', 'IC5821', 'MA1103', 'SE1400', 'CS2101', 'IC4302', 'IC4700', 'IC6821', 'MA2404',
])

const courseRows: CourseRow[] = [
  [537, 0, 'SEMESTRE 0', 0, 0, 0, 'CI0200', 'EXAMEN DIAGNÓSTICO'],
  [539, 0, 'SEMESTRE 0', 2, 3, 10, 'CI0202', 'INGLÉS BÁSICO'],
  [563, 0, 'SEMESTRE 0', 2, 5, 20, 'MA0101', 'MATEMÁTICA GENERAL'],
  [554, 1, 'SEMESTRE 1', 2, 6, 0, 'CI1106', 'COMUNICACIÓN ESCRITA'],
  [1017, 1, 'SEMESTRE 1', 3, 9, 10, 'IC1400', 'FUNDAMENTOS DE ORGANIZACIÓN DE COMPUTADORAS'],
  [1020, 1, 'SEMESTRE 1', 3, 4, 20, 'IC1802', 'INTRODUCCIÓN A LA PROGRAMACIÓN'],
  [1022, 1, 'SEMESTRE 1', 3, 4, 30, 'IC1803', 'TALLER DE PROGRAMACIÓN'],
  [1018, 1, 'SEMESTRE 1', 4, 4, 40, 'MA1403', 'MATEMÁTICA DISCRETA'],
  [497, 1, 'SEMESTRE 1', 0, 2, 50, 'SE1100', 'ACTIVIDAD CULTURAL I'],
  [600, 2, 'SEMESTRE 2', 1, 3, 0, 'CI1107', 'COMUNICACIÓN ORAL'],
  [545, 2, 'SEMESTRE 2', 2, 6, 10, 'CI1230', 'INGLÉS I'],
  [648, 2, 'SEMESTRE 2', 0, 2, 20, 'FH1000', 'CENTROS DE FORMACIÓN HUMANÍSTICA'],
  [1029, 2, 'SEMESTRE 2', 4, 12, 30, 'IC2001', 'ESTRUCTURAS DE DATOS'],
  [1030, 2, 'SEMESTRE 2', 3, 9, 40, 'IC2101', 'PROGRAMACIÓN ORIENTADA A OBJETOS'],
  [1032, 2, 'SEMESTRE 2', 4, 4, 50, 'IC3101', 'ARQUITECTURA DE COMPUTADORES'],
  [605, 2, 'SEMESTRE 2', 4, 5, 60, 'MA1102', 'CÁLCULO DIFERENCIAL E INTEGRAL'],
  [490, 2, 'SEMESTRE 2', 0, 2, 70, 'SE1200', 'ACTIVIDAD DEPORTIVA I'],
  [625, 3, 'SEMESTRE 3', 2, 3, 0, 'CI1231', 'INGLÉS II'],
  [1035, 3, 'SEMESTRE 3', 4, 12, 10, 'IC3002', 'ANÁLISIS DE ALGORITMOS'],
  [1037, 3, 'SEMESTRE 3', 4, 9, 20, 'IC4301', 'BASES DE DATOS I'],
  [1039, 3, 'SEMESTRE 3', 4, 12, 30, 'IC5821', 'REQUERIMIENTOS DE SOFTWARE'],
  [634, 3, 'SEMESTRE 3', 4, 4, 40, 'MA1103', 'CÁLCULO Y ÁLGEBRA LINEAL'],
  [647, 3, 'SEMESTRE 3', 0, 2, 50, 'SE1400', 'ACTIVIDAD CULTURAL-DEPORTIVA'],
  [628, 4, 'SEMESTRE 4', 2, 6, 0, 'CS2101', 'AMBIENTE HUMANO'],
  [1043, 4, 'SEMESTRE 4', 3, 9, 10, 'IC4302', 'BASES DE DATOS II'],
  [1045, 4, 'SEMESTRE 4', 4, 4, 20, 'IC4700', 'LENGUAJES DE PROGRAMACIÓN'],
  [1047, 4, 'SEMESTRE 4', 4, 12, 30, 'IC6821', 'DISEÑO DE SOFTWARE'],
  [1049, 4, 'SEMESTRE 4', 4, 4, 40, 'MA2404', 'PROBABILIDADES'],
  [981, 5, 'SEMESTRE 5', 2, 3, 0, 'CS3401', 'SEMINARIO DE ESTUDIOS FILOSÓFICOS HISTÓRICOS'],
  [1052, 5, 'SEMESTRE 5', 4, 4, 10, 'IC4810', 'ADMINISTRACIÓN DE PROYECTOS'],
  [1054, 5, 'SEMESTRE 5', 4, 4, 20, 'IC5701', 'COMPILADORES E INTERPRETES'],
  [1056, 5, 'SEMESTRE 5', 3, 9, 30, 'IC6831', 'ASEGURAMIENTO DE LA CALIDAD DEL SOFTWARE'],
  [1057, 5, 'SEMESTRE 5', 4, 4, 40, 'MA3405', 'ESTADÍSTICA'],
  [1004, 6, 'SEMESTRE 6', 2, 3, 0, 'CS4402', 'SEMINARIO DE ESTUDIOS COSTARRICENSES'],
  [1059, 6, 'SEMESTRE 6', 3, 4, 10, 'IC4003', 'ELECTIVA I'],
  [1151, 6, 'SEMESTRE 6', 4, 4, 20, 'IC6400', 'INVESTIGACIÓN DE OPERACIONES'],
  [1154, 6, 'SEMESTRE 6', 4, 4, 30, 'IC6600', 'PRINCIPIOS DE SISTEMAS OPERATIVOS'],
  [1156, 6, 'SEMESTRE 6', 2, 7, 40, 'IC7900', 'COMPUTACIÓN Y SOCIEDAD'],
  [1158, 6, 'SEMESTRE 6', 3, 9, 50, 'IC8071', 'SEGURIDAD DEL SOFTWARE'],
  [965, 7, 'SEMESTRE 7', 4, 12, 0, 'AE4208', 'DESARROLLO DE EMPRENDEDORES'],
  [1160, 7, 'SEMESTRE 7', 3, 4, 10, 'IC5001', 'ELECTIVA II'],
  [1162, 7, 'SEMESTRE 7', 4, 4, 20, 'IC6200', 'INTELIGENCIA ARTIFICIAL'],
  [1163, 7, 'SEMESTRE 7', 4, 12, 30, 'IC7602', 'REDES'],
  [1159, 7, 'SEMESTRE 7', 3, 9, 40, 'IC7841', 'PROYECTO DE INGENIERÍA DE SOFTWARE'],
  [1166, 8, 'SEMESTRE 8', 12, 40, 0, 'IC8842', 'PRÁCTICA PROFESIONAL'],
]

const relationRows: RelationRow[] = [
  [545, 537, 'PREREQUISITE'], [545, 539, 'PREREQUISITE'], [600, 554, 'PREREQUISITE'],
  [605, 563, 'PREREQUISITE'], [605, 1018, 'PREREQUISITE'], [625, 545, 'PREREQUISITE'],
  [628, 600, 'PREREQUISITE'], [634, 605, 'PREREQUISITE'], [965, 1159, 'COREQUISITE'],
  [981, 628, 'PREREQUISITE'], [1004, 981, 'PREREQUISITE'], [1017, 1018, 'COREQUISITE'],
  [1029, 1030, 'COREQUISITE'], [1030, 1020, 'PREREQUISITE'], [1030, 1022, 'PREREQUISITE'],
  [1032, 1017, 'PREREQUISITE'], [1032, 1022, 'PREREQUISITE'], [1035, 605, 'PREREQUISITE'],
  [1035, 1029, 'PREREQUISITE'], [1037, 634, 'COREQUISITE'], [1037, 1029, 'PREREQUISITE'],
  [1039, 1037, 'COREQUISITE'], [1043, 1037, 'PREREQUISITE'], [1045, 1032, 'PREREQUISITE'],
  [1045, 1035, 'PREREQUISITE'], [1047, 1039, 'PREREQUISITE'], [1049, 634, 'PREREQUISITE'],
  [1052, 1039, 'PREREQUISITE'], [1054, 1045, 'PREREQUISITE'], [1056, 1047, 'PREREQUISITE'],
  [1056, 1052, 'COREQUISITE'], [1057, 1049, 'PREREQUISITE'], [1151, 1057, 'PREREQUISITE'],
  [1154, 1054, 'PREREQUISITE'], [1156, 1004, 'COREQUISITE'], [1156, 1052, 'PREREQUISITE'],
  [1158, 1052, 'PREREQUISITE'], [1158, 1056, 'PREREQUISITE'], [1159, 1043, 'PREREQUISITE'],
  [1159, 1056, 'PREREQUISITE'], [1159, 1158, 'PREREQUISITE'], [1162, 1054, 'PREREQUISITE'],
  [1162, 1151, 'PREREQUISITE'], [1163, 1154, 'PREREQUISITE'], [1166, 490, 'PREREQUISITE'],
  [1166, 497, 'PREREQUISITE'], [1166, 647, 'PREREQUISITE'], [1166, 648, 'PREREQUISITE'],
  [1166, 965, 'PREREQUISITE'], [1166, 1059, 'PREREQUISITE'], [1166, 1159, 'PREREQUISITE'],
  [1166, 1160, 'PREREQUISITE'], [1166, 1162, 'PREREQUISITE'], [1166, 1163, 'PREREQUISITE'],
]

function getStatus(courseCode: string): CourseStatus {
  if (currentCourseCodes.has(courseCode)) return 'in_progress'
  if (approvedCourseCodes.has(courseCode)) return 'approved'
  return 'not_taken'
}

export const curriculumFilters = {
  campus: 'Sede Central',
  career: 'CA: Escuela de Ingeniería en Computación',
  plan: '412: Ingeniería en Computación-2022',
}

export const curriculumPlanDetail: CurriculumPlanDetail = (() => {
  const relationMap = new Map<number, { prerequisites: string[]; corequisites: string[] }>()
  for (const [from, to, type] of relationRows) {
    const entry = relationMap.get(from) ?? { prerequisites: [], corequisites: [] }
    if (type === 'PREREQUISITE') entry.prerequisites.push(String(to))
    if (type === 'COREQUISITE') entry.corequisites.push(String(to))
    relationMap.set(from, entry)
  }

  const periodMap = new Map<number, CurriculumPeriod>()
  for (const [id, levelNumber, levelLabel, credits, hours, sortOrder, code, name] of courseRows) {
    const period = periodMap.get(levelNumber) ?? { levelNumber, levelLabel, courses: [] }
    const relations = relationMap.get(id) ?? { prerequisites: [], corequisites: [] }
    period.courses.push({
      id: String(id),
      code,
      name,
      credits,
      hours,
      status: getStatus(code),
      prerequisites: relations.prerequisites,
      corequisites: relations.corequisites,
    })
    period.courses.sort((a, b) => {
      const rowA = courseRows.find((row) => String(row[0]) === a.id)
      const rowB = courseRows.find((row) => String(row[0]) === b.id)
      return (rowA?.[5] ?? 0) - (rowB?.[5] ?? 0)
    })
    periodMap.set(levelNumber, period)
  }

  return {
    plan: {
      id: 48,
      externalPlanId: 412,
      name: 'Ingeniería en Computación-2022',
      academicDegree: 'Bachillerato universitario',
      modalityName: 'Semestre',
    },
    periods: Array.from(periodMap.values()).sort((a, b) => a.levelNumber - b.levelNumber),
  }
})()
