export const courseTabs = [
  'Inicio',
  'Calendario',
  'Documentos',
  'Evaluaciones',
  'GAAP',
  'Evaluación docente',
] as const

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
}

export const evaluationGroups: { title: string; weight: number; items: EvaluationItem[] }[] = [
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
