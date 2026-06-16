export const courseTabs = [
  'Inicio',
  'Asistencia',
  'Evaluaciones',
  'Calendario',
  'Documentos',
  'GAAP',
  'Evaluación docente',
] as const

// ---- Course Home page data ----
export type CourseInfo = {
  professor: string
  email: string
  zoomLink: string
  schedule: string
  classroom: string
  modality: string
}

export type Topic = {
  week: number
  title: string
  description: string
}

export type PartialExam = {
  name: string
  date: string
  time: string
  scope: string
  percentage: string
}

export type NewsItem = {
  title: string
  date: string
  description: string
  type: 'info' | 'warning' | 'important'
}

export const courseInfo: CourseInfo = {
  professor: 'Alicia Marcela Salazar Hernandez',
  email: 'asalazar@utlm.cr',
  zoomLink: 'https://zoom.us/j/1234567890',
  schedule: 'Miércoles 19:00 - 20:50 | Viernes 19:00 - 20:50',
  classroom: 'B3-08',
  modality: 'Semipresencial',
}

export const topics: Topic[] = [
  { week: 1, title: 'Introducción a la gestión de proyectos', description: 'Conceptos fundamentales, ciclo de vida del proyecto, roles y responsabilidades.' },
  { week: 2, title: 'Metodologías ágiles vs tradicionales', description: 'Comparación entre enfoques predictivos y adaptativos.' },
  { week: 3, title: 'Gestión del alcance', description: 'Definición de objetivos, requisitos y estructura de desglose de trabajo (WBS).' },
  { week: 4, title: 'Gestión del tiempo', description: 'Cronogramas, ruta crítica y estimación de duraciones.' },
  { week: 5, title: 'Gestión de costos', description: 'Estimación de costos, presupuesto y control de costos.' },
  { week: 6, title: 'Gestión de calidad', description: 'Plan de calidad, aseguramiento y control de calidad.' },
  { week: 7, title: 'Gestión de recursos humanos', description: 'Planificación de RRHH, adquisición y desarrollo del equipo.' },
  { week: 8, title: 'Gestión de comunicaciones', description: 'Plan de comunicaciones, canales y reportes.' },
  { week: 9, title: 'Gestión de riesgos', description: 'Identificación, análisis, planificación de respuesta a riesgos.' },
  { week: 10, title: 'Gestión de adquisiciones', description: 'Procesos de compra, contratos y proveedores.' },
  { week: 11, title: 'Gestión de interesados', description: 'Identificación y gestión de stakeholders.' },
  { week: 12, title: 'Herramientas de software para gestión de proyectos', description: 'Uso de herramientas como MS Project, Jira, Trello.' },
  { week: 13, title: 'Proyecto final - Avance 1', description: 'Presentación del avance del proyecto final.' },
  { week: 14, title: 'Proyecto final - Avance 2', description: 'Revisión de avances y retroalimentación.' },
  { week: 15, title: 'Proyecto final - Entregas', description: 'Entrega final de proyectos y exposición.' },
  { week: 16, title: 'Repaso y cierre', description: 'Repaso general y preparación para examen de reposición.' },
]

export const partialExams: PartialExam[] = [
  { name: 'Examen parcial 1', date: '15/03/2026', time: '19:00 - 20:50', scope: 'Semanas 1 a 4', percentage: '20%' },
  { name: 'Examen parcial 2', date: '20/04/2026', time: '19:00 - 20:50', scope: 'Semanas 5 a 9', percentage: '20%' },
]

export const news: NewsItem[] = [
  { title: 'Bienvenida al curso', date: '10/02/2026', description: 'Bienvenidos al curso de Administración de Proyectos. Revisar el programa del curso en la sección de documentos.', type: 'info' },
  { title: 'Cambio de aula temporal', date: '10/03/2026', description: 'La clase del 15 de marzo se trasladará al aula B2-12 debido a mantenimiento en B3-08.', type: 'warning' },
  { title: 'Recordatorio examen parcial 1', date: '12/03/2026', description: 'El examen parcial 1 cubre los temas de las semanas 1 a 4. Revisar materiales en la sección de documentos.', type: 'important' },
  { title: 'Suspensión de clase', date: '25/03/2026', description: 'La clase del viernes 27 de marzo se suspende por capacitación docente. El contenido se repondrá la semana siguiente.', type: 'warning' },
  { title: 'Publicación de notas parcial 1', date: '22/03/2026', description: 'Las calificaciones del primer parcial ya están disponibles en la sección de evaluaciones.', type: 'info' },
  { title: 'Invitación charla invitado', date: '05/04/2026', description: 'El Dr. Roberto Jiménez dará una charla sobre "Gestión de proyectos en la industria" el 10/04 a las 19:00 vía Zoom.', type: 'info' },
]

// ---- Course Calendar data ----
export const courseMeetings: import('@/lib/types').ScheduleSession[] = [
  { weekday: 3, starts_at: '19:00:00', ends_at: '20:50:00', classroom: 'B3-08' },
  { weekday: 5, starts_at: '19:00:00', ends_at: '20:50:00', classroom: 'B3-08' },
]

export type CourseEvalEvent = {
  name: string
  date: Date
  type: 'exam' | 'assignment' | 'project'
}

export const courseEvalEvents: CourseEvalEvent[] = [
  { name: 'Entrega tarea 1', date: new Date(2026, 2, 10, 23, 59), type: 'assignment' },
  { name: 'Examen parcial 1', date: new Date(2026, 2, 15, 19, 0), type: 'exam' },
  { name: 'Entrega tarea 2', date: new Date(2026, 2, 27, 23, 59), type: 'assignment' },
  { name: 'Entrega propuesta proyecto', date: new Date(2026, 3, 5, 22, 0), type: 'project' },
  { name: 'Examen parcial 2', date: new Date(2026, 3, 20, 19, 0), type: 'exam' },
  { name: 'Entrega tarea 3', date: new Date(2026, 3, 22, 23, 59), type: 'assignment' },
  { name: 'Entrega proyecto final', date: new Date(2026, 4, 30, 23, 0), type: 'project' },
]

export type FileLeaf = { name: string; sizeBytes: number; modifiedAt: string }
export type FileTreeItem = FileLeaf | { name: string; items: FileTreeItem[]; modifiedAt: string }

export const documentsTree: FileTreeItem[] = [
  {
    name: 'Unidad 1',
    items: [
      {
        name: 'Semana 1',
        items: [
          { name: 'Guía del curso.pdf', sizeBytes: 24576, modifiedAt: '2026-01-10T09:20:00' },
          { name: 'Diapositivas semana 1.pdf', sizeBytes: 5767168, modifiedAt: '2026-01-12T11:45:00' },
          { name: 'Recursos.zip', sizeBytes: 14582784, modifiedAt: '2026-01-12T13:15:00' },
        ],
        modifiedAt: '2026-01-12T13:15:00',
      },
      {
        name: 'Lecturas',
        items: [
          { name: 'Lectura introductoria.pdf', sizeBytes: 1536000, modifiedAt: '2026-01-11T14:05:00' },
          { name: 'notas-clase.txt', sizeBytes: 945, modifiedAt: '2026-01-11T16:08:00' },
        ],
        modifiedAt: '2026-01-11T16:08:00',
      },
    ],
    modifiedAt: '2026-01-12T11:45:00',
  },
  {
    name: 'Unidad 2',
    items: [
      {
        name: 'Laboratorio',
        items: [
          { name: 'starter-template.ts', sizeBytes: 7168, modifiedAt: '2026-02-01T08:10:00' },
          { name: 'config.json', sizeBytes: 2048, modifiedAt: '2026-02-01T08:11:00' },
          { name: 'dataset.xlsx', sizeBytes: 2392064, modifiedAt: '2026-02-02T16:32:00' },
        ],
        modifiedAt: '2026-02-02T16:32:00',
      },
      {
        name: 'Multimedia',
        items: [
          { name: 'demo.mp4', sizeBytes: 2130706432, modifiedAt: '2026-02-03T09:05:00' },
          { name: 'captura.png', sizeBytes: 385024, modifiedAt: '2026-02-03T09:07:00' },
          { name: 'audio-explicacion.mp3', sizeBytes: 8388608, modifiedAt: '2026-02-03T09:15:00' },
        ],
        modifiedAt: '2026-02-03T09:15:00',
      },
      { name: 'Material de apoyo.pdf', sizeBytes: 843776, modifiedAt: '2026-02-03T10:20:00' },
      { name: 'Recursos adicionales.txt', sizeBytes: 890, modifiedAt: '2026-02-03T10:22:00' },
    ],
    modifiedAt: '2026-02-03T10:22:00',
  },
  {
    name: 'Entregables',
    items: [
      { name: 'Plantilla tarea 1.docx', sizeBytes: 67584, modifiedAt: '2026-02-14T13:40:00' },
      { name: 'Plantilla proyecto final.docx', sizeBytes: 112640, modifiedAt: '2026-02-18T17:05:00' },
    ],
    modifiedAt: '2026-02-18T17:05:00',
  },
]

export type SubmissionEntry = { name: string; submittedAt: string; isLink: boolean }

export type Student = {
  id: string
  name: string
  email: string
}

export const enrolledStudents: Student[] = [
  { id: '1', name: 'Carlos Vindas Mora', email: 'cvindas@utlm.cr' },
  { id: '2', name: 'María Fernanda Rojas', email: 'mrojas@utlm.cr' },
  { id: '3', name: 'Jorge Pérez Sánchez', email: 'jperez@utlm.cr' },
  { id: '4', name: 'Ana Laura Gómez', email: 'agomez@utlm.cr' },
  { id: '5', name: 'David Rodríguez Vega', email: 'drodriguez@utlm.cr' },
]

export type TeacherSubmissionReview = {
  studentId: string
  submission: SubmissionEntry | null
  submissionHistory: SubmissionEntry[]
  score: number | null
  feedback: string
  feedbackFiles: { name: string }[]
}

export type EvaluationItem = {
  name: string
  score: { earned: number; max: number }
  description: string
  dueDate: string
  rubric: boolean
  allowLate: boolean
  peoplePerGroup: number
  members?: string[]
  submission: SubmissionEntry | null
  submissionHistory: SubmissionEntry[]
  feedbackFiles?: { name: string }[]
  studentReviews?: TeacherSubmissionReview[]
}

export let evaluationGroups: { title: string; weight: number; items: EvaluationItem[] }[] = [
  {
    title: 'Exámenes',
    weight: 40,
    items: [
      {
        name: 'Examen parcial 1',
        score: { earned: 14.5, max: 20 },
        description: 'Evaluación teórica de los temas vistos en las semanas 1 a 4.',
        dueDate: '15/03/2026 23:45',
        rubric: true,
        allowLate: false,
        peoplePerGroup: 1,
        submission: { name: 'respuesta-parcial-1.pdf', submittedAt: '2026-03-15T21:10:22', isLink: false },
        submissionHistory: [
          { name: 'borrador-parcial-1.pdf', submittedAt: '2026-03-15T20:45:14', isLink: false },
          { name: 'respuesta-parcial-1.pdf', submittedAt: '2026-03-15T21:10:22', isLink: false },
        ],
      },
      {
        name: 'Examen parcial 2',
        score: { earned: 16.2, max: 20 },
        description: 'Evaluación acumulativa de contenidos prácticos y conceptuales.',
        dueDate: '',
        rubric: true,
        allowLate: false,
        peoplePerGroup: 1,
        submission: { name: 'https://drive.example.com/examen-2', submittedAt: '2026-04-20T19:00:00', isLink: true },
        submissionHistory: [
          { name: 'https://drive.example.com/examen-2-v1', submittedAt: '2026-04-20T18:25:30', isLink: true },
          { name: 'https://drive.example.com/examen-2', submittedAt: '2026-04-20T19:00:00', isLink: true },
        ],
      },
    ],
  },
  {
    title: 'Tareas',
    weight: 40,
    items: [
      {
        name: 'Tarea 1',
        score: { earned: 8.8, max: 12 },
        description: 'Resolver ejercicios de análisis y adjuntar evidencia en PDF.',
        dueDate: '10/03/2026 23:59',
        rubric: false,
        allowLate: true,
        peoplePerGroup: 2,
        members: ['Nombre 1', 'Nombre 2'],
        submission: null,
        submissionHistory: [],
        feedbackFiles: [
          { name: 'retroalimentacion_tarea_1_grupo_02.pdf' },
          { name: 'comentarios-detallados-tarea-1.txt' },
        ],
      },
      {
        name: 'Tarea 2',
        score: { earned: 11.4, max: 14 },
        description: 'Informe corto con resultados y conclusiones del laboratorio.',
        dueDate: '27/03/2026 23:59',
        rubric: true,
        allowLate: false,
        peoplePerGroup: 1,
        submission: { name: 'https://notion.so/tarea-2-entrega', submittedAt: '2026-03-27T23:10:41', isLink: true },
        submissionHistory: [
          { name: 'https://notion.so/tarea-2-borrador', submittedAt: '2026-03-27T22:01:17', isLink: true },
          { name: 'https://notion.so/tarea-2-entrega', submittedAt: '2026-03-27T23:10:41', isLink: true },
        ],
      },
      {
        name: 'Tarea 3',
        score: { earned: 13.0, max: 14 },
        description: 'Implementación de mejora incremental con documentación técnica.',
        dueDate: '22/04/2026 23:59',
        rubric: false,
        allowLate: true,
        peoplePerGroup: 3,
        members: ['Nombre 1', 'Nombre 2', 'Nombre 3'],
        submission: { name: 'mejora-incremental.zip', submittedAt: '2026-04-22T23:05:50', isLink: false },
        submissionHistory: [
          { name: 'mejora-incremental-v1.zip', submittedAt: '2026-04-22T21:33:12', isLink: false },
          { name: 'mejora-incremental.zip', submittedAt: '2026-04-22T23:05:50', isLink: false },
        ],
        feedbackFiles: [{ name: 'feedback_tarea3.zip' }],
      },
    ],
  },
  {
    title: 'Proyectos',
    weight: 20,
    items: [
      {
        name: 'Propuesta de proyecto',
        score: { earned: 9.5, max: 10 },
        description: 'Propuesta inicial con objetivos, alcance y cronograma.',
        dueDate: '05/04/2026 22:00',
        rubric: true,
        allowLate: false,
        peoplePerGroup: 2,
        members: ['Nombre 1', 'Nombre 2'],
        submission: { name: 'propuesta-proyecto.pdf', submittedAt: '2026-04-05T20:30:00', isLink: false },
        submissionHistory: [
          { name: 'propuesta-proyecto-v1.pdf', submittedAt: '2026-04-05T18:11:05', isLink: false },
          { name: 'propuesta-proyecto.pdf', submittedAt: '2026-04-05T20:30:00', isLink: false },
        ],
      },
      {
        name: 'Proyecto final',
        score: { earned: 15.0, max: 10 },
        description: 'Entrega final del proyecto con informe y presentación.',
        dueDate: '30/05/2026 23:00',
        rubric: true,
        allowLate: false,
        peoplePerGroup: 2,
        members: ['Nombre 1', 'Nombre 2'],
        submission: {
          name: 'https://github.com/organizacion/proyecto-final',
          submittedAt: '2026-05-30T22:30:10',
          isLink: true,
        },
        submissionHistory: [
          {
            name: 'https://github.com/organizacion/proyecto-final/tree/v1',
            submittedAt: '2026-05-30T20:03:40',
            isLink: true,
          },
          { name: 'https://github.com/organizacion/proyecto-final', submittedAt: '2026-05-30T22:30:10', isLink: true },
        ],
      },
    ],
  },
]

export function updateEvaluationGroups(newGroups: typeof evaluationGroups) {
  evaluationGroups = newGroups
}
