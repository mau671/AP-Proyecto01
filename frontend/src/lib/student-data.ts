import { startOfWeek } from "date-fns";

import { sessionToEvent } from "./calendar-utils";
import type { CalendarEvent, ScheduleSession } from "./types";

export const studentProfile = {
  name: "Estudiante Demo",
  id: "2024143009",
  career: "Ingeniería en Computación",
  campus: "Campus Tecnológico Central Cartago",
  period: "I Semestre 2026",
  credits: 19,
  academicProgress: 62,
  gpa: 91.4,
};

export const enrolledCourses = [
  {
    code: "CI1230",
    name: "Inglés I",
    group: "7",
    professor: "Sonia Isabel Albertazzi Osorio",
    credits: 2,
    grade: 95,
    status: "Activo",
  },
  {
    code: "SE1221",
    name: "Futbol I",
    group: "3",
    professor: "Daniel Jimenez Jimenez",
    credits: 0,
    grade: 100,
    status: "Activo",
  },
  {
    code: "IC4810",
    name: "Administración de proyectos",
    group: "1",
    professor: "Alicia Marcela Salazar Hernandez",
    credits: 4,
    grade: 95,
    status: "Activo",
  },
  {
    code: "IC5701",
    name: "Compiladores e intérpretes",
    group: "1",
    professor: "Marco Aurelio Sanabria Rodriguez",
    credits: 4,
    grade: 90,
    status: "Activo",
  },
  {
    code: "IC6831",
    name: "Aseguramiento de la calidad del software",
    group: "2",
    professor: "Alicia Marcela Salazar Hernandez",
    credits: 3,
    grade: 90,
    status: "Activo",
  },
  {
    code: "CS3401",
    name: "Seminario de estudios filosóficos históricos",
    group: "2",
    professor: "Leonardo Alberto Ortiz Acuña",
    credits: 2,
    grade: 90,
    status: "Activo",
  },
  {
    code: "MA3405",
    name: "Estadística",
    group: "2",
    professor: "Maria Fernanda Mora Casasola",
    credits: 4,
    grade: 85,
    status: "Activo",
  },
];

export const upcomingClasses = [
  {
    day: "Lunes",
    time: "08:00 - 10:50",
    course: "Administración de Proyectos",
    room: "B2-12",
    mode: "Presencial",
  },
  {
    day: "Martes",
    time: "13:00 - 15:50",
    course: "Compiladores e Intérpretes",
    room: "Lab 04",
    mode: "Presencial",
  },
  {
    day: "Miércoles",
    time: "18:00 - 20:50",
    course: "Aseguramiento de Calidad de Software",
    room: "Virtual",
    mode: "Remoto",
  },
];

export const studentScheduleGroups: Array<{
  courseId: string;
  courseCode: string;
  courseName: string;
  groupCode: string;
  groupType: string;
  professors: string[];
  color: string;
  availableSeats: number;
  totalSeats: number;
  meetings: ScheduleSession[];
}> = [
  {
    courseId: "CI1230",
    courseCode: "CI1230",
    courseName: "INGLÉS I",
    groupCode: "07",
    groupType: "VIRTUAL",
    professors: ["ALBERTAZZI OSORIO SONIA"],
    color: "blue",
    availableSeats: 18,
    totalSeats: 30,
    meetings: [
      {
        weekday: 3,
        starts_at: "09:30:00",
        ends_at: "12:20:00",
        classroom: null,
      },
    ],
  },
  {
    courseId: "SE1221",
    courseCode: "SE1221",
    courseName: "FUTBOL I",
    groupCode: "03",
    groupType: "REGULAR",
    professors: ["JIMENEZ JIMENEZ DANIEL"],
    color: "emerald",
    availableSeats: 6,
    totalSeats: 30,
    meetings: [
      {
        weekday: 4,
        starts_at: "13:00:00",
        ends_at: "14:50:00",
        classroom: null,
      },
    ],
  },
  {
    courseId: "CS3401",
    courseCode: "CS3401",
    courseName: "SEMINARIO DE ESTUDIOS FILOSÓFICOS HISTÓRICOS",
    groupCode: "02",
    groupType: "VIRTUAL",
    professors: ["ORTIZ ACUÑA LEONARDO"],
    color: "violet",
    availableSeats: 0,
    totalSeats: 30,
    meetings: [
      {
        weekday: 1,
        starts_at: "18:00:00",
        ends_at: "20:50:00",
        classroom: null,
      },
    ],
  },
  {
    courseId: "IC4810",
    courseCode: "IC4810",
    courseName: "ADMINISTRACIÓN DE PROYECTOS",
    groupCode: "01",
    groupType: "SEMIPRESENCIAL",
    professors: ["SALAZAR HERNANDEZ ALICIA"],
    color: "orange",
    availableSeats: 4,
    totalSeats: 30,
    meetings: [
      {
        weekday: 3,
        starts_at: "19:00:00",
        ends_at: "20:50:00",
        classroom: "B3-08",
      },
      {
        weekday: 5,
        starts_at: "19:00:00",
        ends_at: "20:50:00",
        classroom: "B3-08",
      },
    ],
  },
  {
    courseId: "IC5701",
    courseCode: "IC5701",
    courseName: "COMPILADORES E INTERPRETES",
    groupCode: "01",
    groupType: "SEMIPRESENCIAL",
    professors: ["SANABRIA RODRIGUEZ AURELIO"],
    color: "fuchsia",
    availableSeats: 12,
    totalSeats: 30,
    meetings: [
      {
        weekday: 2,
        starts_at: "09:30:00",
        ends_at: "11:20:00",
        classroom: "B3-06",
      },
      {
        weekday: 4,
        starts_at: "09:30:00",
        ends_at: "11:20:00",
        classroom: "B3-06",
      },
    ],
  },
  {
    courseId: "IC6831",
    courseCode: "IC6831",
    courseName: "ASEGURAMIENTO DE LA CALIDAD DEL SOFTWARE",
    groupCode: "02",
    groupType: "SEMIPRESENCIAL",
    professors: ["SALAZAR HERNANDEZ ALICIA"],
    color: "red",
    availableSeats: 2,
    totalSeats: 30,
    meetings: [
      {
        weekday: 3,
        starts_at: "17:00:00",
        ends_at: "18:50:00",
        classroom: "B3-08",
      },
      {
        weekday: 5,
        starts_at: "17:00:00",
        ends_at: "18:50:00",
        classroom: "B3-08",
      },
    ],
  },
  {
    courseId: "MA3405",
    courseCode: "MA3405",
    courseName: "ESTADÍSTICA",
    groupCode: "02",
    groupType: "REGULAR",
    professors: ["MORA CASASOLA MARIA FERNANDA"],
    color: "yellow",
    availableSeats: 15,
    totalSeats: 30,
    meetings: [
      {
        weekday: 3,
        starts_at: "07:30:00",
        ends_at: "09:20:00",
        classroom: "D3-14",
      },
      {
        weekday: 5,
        starts_at: "07:30:00",
        ends_at: "09:20:00",
        classroom: "D3-14",
      },
    ],
  },
];

function getSeatStatus(
  availableSeats: number,
): "Disponible" | "Pocos cupos" | "Lleno" {
  if (availableSeats === 0) return "Lleno";
  if (availableSeats <= 5) return "Pocos cupos";
  return "Disponible";
}

const currentEnrollmentGroups = studentScheduleGroups.map((group) => ({
  courseCode: group.courseCode,
  groupCode: group.groupCode,
  groupType: group.groupType,
  campusName: "Campus Tecnológico Central Cartago",
  professors: group.professors,
  meetings: group.meetings,
  availableSeats: group.availableSeats,
  totalSeats: group.totalSeats,
}));

const additionalEnrollmentGroups: Array<{
  courseCode: string;
  groupCode: string;
  groupType: string;
  campusName: string;
  professors: string[];
  meetings: ScheduleSession[];
  availableSeats: number;
  totalSeats: number;
}> = [
  {
    courseCode: "CI1230",
    groupCode: "12",
    groupType: "VIRTUAL",
    campusName: "Campus Tecnológico Local San José",
    professors: ["HERNANDEZ ROJAS MARIA"],
    meetings: [
      {
        weekday: 2,
        starts_at: "18:00:00",
        ends_at: "20:50:00",
        classroom: null,
      },
    ],
    availableSeats: 3,
    totalSeats: 28,
  },
  {
    courseCode: "SE1221",
    groupCode: "08",
    groupType: "REGULAR",
    campusName: "Centro Académico de Alajuela",
    professors: ["SOTO MORA CARLOS"],
    meetings: [
      {
        weekday: 2,
        starts_at: "15:00:00",
        ends_at: "16:50:00",
        classroom: "GIM-02",
      },
    ],
    availableSeats: 0,
    totalSeats: 25,
  },
  {
    courseCode: "CS3401",
    groupCode: "05",
    groupType: "SEMIPRESENCIAL",
    campusName: "Campus Tecnológico Local San Carlos",
    professors: ["VARGAS ARAYA PAULA"],
    meetings: [
      {
        weekday: 1,
        starts_at: "17:00:00",
        ends_at: "18:50:00",
        classroom: "SC-12",
      },
      {
        weekday: 3,
        starts_at: "17:00:00",
        ends_at: "18:50:00",
        classroom: null,
      },
    ],
    availableSeats: 9,
    totalSeats: 30,
  },
  {
    courseCode: "IC4810",
    groupCode: "04",
    groupType: "SEMIPRESENCIAL",
    campusName: "Campus Tecnológico Local San José",
    professors: ["MORALES CAMPOS ANDREA"],
    meetings: [
      {
        weekday: 2,
        starts_at: "19:00:00",
        ends_at: "20:50:00",
        classroom: "SJ-204",
      },
      {
        weekday: 4,
        starts_at: "19:00:00",
        ends_at: "20:50:00",
        classroom: null,
      },
    ],
    availableSeats: 14,
    totalSeats: 30,
  },
  {
    courseCode: "IC5701",
    groupCode: "03",
    groupType: "REGULAR",
    campusName: "Centro Académico de Alajuela",
    professors: ["CHAVES SOLANO ESTEBAN"],
    meetings: [
      {
        weekday: 1,
        starts_at: "09:30:00",
        ends_at: "11:20:00",
        classroom: "AL-301",
      },
      {
        weekday: 3,
        starts_at: "09:30:00",
        ends_at: "11:20:00",
        classroom: "LAB-AL-02",
      },
    ],
    availableSeats: 5,
    totalSeats: 24,
  },
  {
    courseCode: "IC6831",
    groupCode: "05",
    groupType: "VIRTUAL",
    campusName: "Centro Académico de Limón",
    professors: ["RODRIGUEZ PICADO LUIS"],
    meetings: [
      {
        weekday: 4,
        starts_at: "18:00:00",
        ends_at: "20:50:00",
        classroom: null,
      },
    ],
    availableSeats: 22,
    totalSeats: 35,
  },
  {
    courseCode: "MA3405",
    groupCode: "06",
    groupType: "REGULAR",
    campusName: "Campus Tecnológico Local San José",
    professors: ["SOLIS UMAÑA KARLA"],
    meetings: [
      {
        weekday: 2,
        starts_at: "07:30:00",
        ends_at: "09:20:00",
        classroom: "SJ-108",
      },
      {
        weekday: 4,
        starts_at: "07:30:00",
        ends_at: "09:20:00",
        classroom: "SJ-110",
      },
    ],
    availableSeats: 1,
    totalSeats: 30,
  },
];

const enrollmentGroups = [
  ...currentEnrollmentGroups,
  ...additionalEnrollmentGroups,
];

export const studentEnrollmentCourses = enrolledCourses.map((course) => {
  const courseGroups = enrollmentGroups.filter(
    (group) => group.courseCode === course.code,
  );

  return {
    id: course.code.toLowerCase(),
    code: course.code,
    name: course.name,
    credits: course.credits,
    groups: courseGroups.map((group) => ({
      id: `${group.courseCode}-${group.groupCode}`,
      name: group.groupCode,
      groupType: group.groupType,
      campusName: group.campusName,
      meetings: group.meetings,
      teacher: group.professors[0] ?? "Sin asignar",
      professors: group.professors,
      availableSeats: group.availableSeats,
      totalSeats: group.totalSeats,
      status: getSeatStatus(group.availableSeats),
    })),
  };
});

export function getStudentScheduleEvents(date = new Date()): CalendarEvent[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });

  return studentScheduleGroups.flatMap((group) =>
    group.meetings.map((session) =>
      sessionToEvent({
        session,
        courseId: group.courseId,
        courseCode: group.courseCode,
        courseName: group.courseName,
        groupCode: group.groupCode,
        groupId: `${group.courseCode}-${group.groupCode}`,
        groupType: group.groupType,
        professors: group.professors,
        classroom: session.classroom,
        campusName: "CAMPUS TECNOLOGICO CENTRAL CARTAGO",
        color: group.color,
        weekStart,
      }),
    ),
  );
}

export const accountSummary = {
  balance: 9060.55,
};

export const accountYears = [
  {
    year: "2026",
    charges: [
      {
        period: "Semestre I",
        status: "Pendiente",
        dueDateWithoutSurcharge: "27/03/2026",
        enrolledCredits: 19,
        billedCredits: 12,
        amounts: [
          { concept: "Derechos de estudios", amount: 278160 },
          { concept: "Beca de asistencia", amount: -278160 },
          { concept: "Matrícula", amount: 6175 },
          { concept: "Bienestar estudiantil", amount: 2155 },
          { concept: "Recargo", amount: 730.55 },
        ],
        balance: 9060.55,
      },
    ],
  },
  {
    year: "2025",
    charges: [
      {
        period: "Semestre II",
        status: "Pagado",
        dueDateWithoutSurcharge: "15/08/2025",
        enrolledCredits: 15,
        billedCredits: 12,
        amounts: [
          { concept: "Derechos de estudios", amount: 254980 },
          { concept: "Beca de asistencia", amount: -254980 },
          { concept: "Matrícula", amount: 5975 },
          { concept: "Bienestar estudiantil", amount: 2080 },
        ],
        balance: 8055,
      },
      {
        period: "Verano I",
        status: "Pagado",
        dueDateWithoutSurcharge: "17/01/2025",
        enrolledCredits: 4,
        billedCredits: 12,
        amounts: [
          { concept: "Derechos de estudios", amount: 92720 },
          { concept: "Beca de asistencia", amount: -92720 },
          { concept: "Matrícula", amount: 5975 },
          { concept: "Bienestar estudiantil", amount: 2080 },
        ],
        balance: 8055,
      },
    ],
  },
];

export const academicYears = [
  {
    year: "2025",
    periods: [
      {
        period: "Verano I",
        credits: 4,
        average: 95,
        courses: [
          {
            code: "IC6821",
            name: "Diseño de software",
            group: "50",
            professor: "Marvin Campos Fuentes",
            credits: 4,
            grade: 95,
          },
        ],
      },
      {
        period: "Semestre II",
        credits: 15,
        average: 90,
        courses: [
          {
            code: "SE1107",
            name: "Apreciación de cine",
            group: "3",
            professor: "Max Soto Muñoz",
            credits: 0,
            grade: 95,
          },
          {
            code: "IC4302",
            name: "Bases de datos II",
            group: "2",
            professor: "Diego Andres Mora Rojas",
            credits: 3,
            grade: 90,
          },
          {
            code: "IC4700",
            name: "Lenguajes de programación",
            group: "2",
            professor: "Jorge Arturo Vargas Calvo",
            credits: 4,
            grade: 90,
          },
          {
            code: "IC5821",
            name: "Requerimientos de software",
            group: "1",
            professor: "Rafael Mauricio Arroyo Herrera",
            credits: 4,
            grade: 85,
          },
          {
            code: "MA2404",
            name: "Probabilidades",
            group: "2",
            professor: "Emanuelle Parra Rodriguez",
            credits: 4,
            grade: 90,
          },
        ],
      },
      {
        period: "Semestre I",
        credits: 14,
        average: 90,
        courses: [
          {
            code: "IC3002",
            name: "Análisis de algoritmos",
            group: "2",
            professor: "Jose Dolores Navas Su",
            credits: 4,
            grade: 90,
          },
          {
            code: "IC4301",
            name: "Bases de datos I",
            group: "40",
            professor: "Adriana Alvarez Figueroa",
            credits: 4,
            grade: 95,
          },
          {
            code: "CS2101",
            name: "Ambiente humano",
            group: "7",
            professor: "Oscar Rodriguez Morales",
            credits: 2,
            grade: 90,
          },
          {
            code: "MA1103",
            name: "Cálculo y álgebra lineal",
            group: "2",
            professor: "Anddy Enrique Alvarado Solano",
            credits: 4,
            grade: 90,
          },
        ],
      },
      {
        period: "Humanística II",
        credits: 0,
        average: 95,
        courses: [
          {
            code: "FH0051",
            name: "La bomba atómica en Hiroshima y Nagasaki y los esfuerzos de desarme",
            group: "60",
            professor: "David De Jesus Sequeira Castro",
            credits: 0,
            grade: 95,
          },
        ],
      },
    ],
  },
  {
    year: "2024",
    periods: [
      {
        period: "Verano I",
        credits: 4,
        average: 90,
        courses: [
          {
            code: "MA1102",
            name: "Cálculo diferencial e integral",
            group: "1",
            professor: "Samuel Fernando Valverde Sanchez",
            credits: 4,
            grade: 90,
          },
        ],
      },
      {
        period: "Semestre II",
        credits: 14,
        average: 85,
        courses: [
          {
            code: "CI1107",
            name: "Comunicación oral",
            group: "24",
            professor: "Maria Gabriela Amador Solano",
            credits: 1,
            grade: 90,
          },
          {
            code: "IC2001",
            name: "Estructuras de datos",
            group: "40",
            professor: "Mauricio Aviles Cisneros",
            credits: 4,
            grade: 85,
          },
          {
            code: "IC2101",
            name: "Programación orientada a objetos",
            group: "1",
            professor: "Ivan Campos Fernandez",
            credits: 3,
            grade: 85,
          },
          {
            code: "IC3101",
            name: "Arquitectura de computadores",
            group: "1",
            professor: "Esteban Arias Mendez",
            credits: 4,
            grade: 85,
          },
          {
            code: "MA0101",
            name: "Matemática general",
            group: "14",
            professor: "Marcial Enrique Cordero Quiros",
            credits: 2,
            grade: 90,
          },
        ],
      },
      {
        period: "Humanística VI",
        credits: 0,
        average: 95,
        courses: [
          {
            code: "FH0129",
            name: "Historia del arte universal",
            group: "60",
            professor: "Saray Morales Garay",
            credits: 0,
            grade: 95,
          },
        ],
      },
      {
        period: "Humanística V",
        credits: 0,
        average: 90,
        courses: [
          {
            code: "FH0211",
            name: "El cuento policial",
            group: "40",
            professor: "Monserrat Ramírez Castro",
            credits: 0,
            grade: 90,
          },
        ],
      },
      {
        period: "Semestre I",
        credits: 15,
        average: 90,
        courses: [
          {
            code: "CI1106",
            name: "Comunicación escrita",
            group: "14",
            professor: "Erika Elieth Romero Alvarez",
            credits: 2,
            grade: 95,
          },
          {
            code: "CI0200",
            name: "Examen diagnóstico",
            group: "107",
            professor: "No disponible",
            credits: 0,
            grade: 100,
          },
          {
            code: "SE1205",
            name: "Juegos y deportes en conjunto",
            group: "4",
            professor: "Rodrigo Antonio Quiros Valverde",
            credits: 0,
            grade: 95,
          },
          {
            code: "IC1400",
            name: "Fundamentos de organización de computadoras",
            group: "2",
            professor: "Carlos Manuel Benavides Cespedes",
            credits: 3,
            grade: 90,
          },
          {
            code: "IC1802",
            name: "Introducción a la programación",
            group: "4",
            professor: "William Mata Rodriguez",
            credits: 3,
            grade: 90,
          },
          {
            code: "IC1803",
            name: "Taller de programación",
            group: "4",
            professor: "William Mata Rodriguez",
            credits: 3,
            grade: 85,
          },
          {
            code: "MA1403",
            name: "Matemática discreta",
            group: "6",
            professor: "Ivonne Patricia Sanchez Fernandez",
            credits: 4,
            grade: 90,
          },
        ],
      },
    ],
  },
];

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
