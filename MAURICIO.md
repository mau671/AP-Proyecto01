# Mauricio - Estado del Front-End

## Resumen

El frontend ubicado en `frontend/` está **esencialmente completo**. Todos los módulos obligatorios del Entregable 18 están implementados y funcionales con datos simulados. Este documento actualiza el análisis original que se hizo cuando el proyecto estaba en etapas tempranas.

---

## Estado por Módulo (Entregable 18)

| Módulo | Estado | Ubicación |
|---|---|---|
| **Login** | ✅ Completo | `/auth/signin` + `/auth/signup` con 3 roles demo (student, teacher, admin) |
| **Dashboard Principal** | ✅ Completo | `/` con vistas por rol: `-student-home.tsx`, `-teacher-home.tsx`, `-admin-home.tsx` |
| **Módulo de Matrícula** | ✅ Completo | `/enrollment` con tabla de grupos, calendario, detección de conflictos, calculadora de créditos |
| **Módulo de Cursos** | ✅ Completo | `/courses/...` con 7 tabs (Inicio, Asistencia, Evaluaciones, Calendario, Documentos, GAAP, Evaluación Docente) + CRUD |
| **Módulo de Horarios** | ✅ Completo | `/schedule` con vista semanal y navegación por semanas del semestre |
| **Módulo de Calificaciones** | ✅ Completo | Notas visibles en home estudiantil + `/profile/academic-history` con registro completo, filtros, promedios ponderados y gráficas |
| **Módulo Financiero** | ✅ Completo | `/finance` con 4 tabs: estado de cuenta, flujo de pago, historial, otros cargos |
| **Módulo Administrativo** | ✅ Completo | `/management` con CRUD de estudiantes, docentes, cursos y períodos académicos |
| **Dashboard Ejecutivo** | ✅ Completo | Admin home con KPIs, gráficos de ingresos, indicadores académicos y financieros |

### Portales

| Portal | Estado | Detalle |
|---|---|---|
| **Portal Estudiantil** | ✅ Completo | Inicio de sesión, perfil (7 tabs), matrícula, horarios, calificaciones, estado de cuenta, historial académico |
| **Portal Docente** | ✅ Completo | Gestión de cursos, registro de asistencia, registro de calificaciones, evaluaciones, GAAP |
| **Portal Administrativo** | ✅ Completo | CRUD visual de estudiantes, docentes, cursos y períodos |
| **Portal Financiero** | ✅ Completo | Pagos de matrícula, pagos de cursos, historial de pagos, estado de cuenta |

---

## Tecnologías Utilizadas

- Vite + React 19 + TypeScript
- TanStack Router (file-based routing)
- TailwindCSS 4 + shadcn/ui
- Recharts (gráficos)
- TanStack React Table (tablas)
- Lucide React (iconos)
- Framer Motion (animaciones)
- Sonner (notificaciones)
- BlockNote (editor de texto)
- @react-pdf/renderer (generación de PDF)
- date-fns (fechas)

---

## Datos de Demo

Los datos simulados están centralizados en `frontend/src/lib/`:
- `demo-auth.ts` — 3 usuarios demo con roles
- `student-data.ts` — perfil, cursos, matrícula, estado de cuenta
- `teacher-data.ts` — perfil y cursos del docente
- `finance-data.ts` — historial de pagos y otros cargos
- `academic-history-data.ts` — notas, estadísticas, promedios
- `course-catalog.ts` — catálogo de cursos
- `curriculum-data.ts` — plan de estudios

---

## Pendiente (Documentos de Gestión)

Los siguientes entregables son puramente documentales (no código) y siguen pendientes:

| Entregable | Descripción |
|---|---|
| **E-20** | Solicitud de Cambio #1 |
| **E-21** | Solicitud de Cambio #2 |
| **E-23** | Dashboard Ejecutivo del Proyecto (KPIs de desempeño del proyecto, no confundir con el dashboard institucional del sistema) |
| **E-25** | Acta de Cierre |
| **E-26** | Reflexiones y Recomendaciones |

---

## Notas

- El archivo `MAURICIO.md` original fue escrito cuando el frontend estaba en desarrollo temprano. Esta es la versión actualizada.
- El frontend compila correctamente con `pnpm build` desde `frontend/`.
- No se requiere backend ni base de datos funcional (según especificación del proyecto).
