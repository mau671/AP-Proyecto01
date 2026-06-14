# Mauricio - Analisis del Front-End

## Alcance Revisado

Este documento compara los requisitos de `Proyecto01.md` contra el estado actual del prototipo ubicado en `frontend/`.

La parte asignada a Mauricio incluye principalmente:

- Entregable 18: Desarrollo del Front-End.
- Entregable 23: Dashboard Ejecutivo del Proyecto.
- Entregables 20 y 21: Solicitudes de cambio simuladas.
- Entregable 25: Acta de cierre.
- Entregable 26: Reflexiones y recomendaciones.

Este analisis se enfoca en el front-end y en el dashboard ejecutivo, porque son los puntos que dependen directamente del proyecto en `frontend/`.

## Requisitos del Front-End Segun Proyecto01.md

El sistema debe incluir como minimo:

- Login. -> Listo
- Dashboard Principal.
- Modulo de Matricula. -> Listo
- Modulo de Cursos. -> Listo
- Modulo de Horarios. -> Listo
- Modulo de Calificaciones.
- Modulo Financiero.
- Modulo Administrativo.
- Dashboard Ejecutivo.

Ademas, el alcance general del sistema pide cubrir:

- Portal Estudiantil: inicio de sesion, perfil, matricula, horarios, calificaciones, estado de cuenta e historial academico.
- Portal Docente: gestion de cursos, asistencia y calificaciones.
- Portal Administrativo: estudiantes, docentes, cursos y periodos academicos.
- Portal Financiero: pagos de matricula, pagos de cursos e historial de pagos.
- Dashboard Ejecutivo: estudiantes activos, ingresos por matricula, indicadores academicos e indicadores financieros.

## Estado Actual del Front-End

El proyecto `frontend/` ya existe y esta configurado como una aplicacion Vite + React con pnpm.

Tecnologias presentes:

- Vite.
- React.
- TypeScript.
- pnpm.
- TanStack Router.
- TanStack Query.
- shadcn/ui.
- Tailwind CSS.

Archivos relevantes:

- `frontend/src/main.tsx`: entrada SPA de Vite.
- `frontend/src/routes/__root.tsx`: layout principal de la aplicacion.
- `frontend/src/routes/index.tsx`: pantalla principal actual con comunidades y cursos.
- `frontend/src/routes/auth/$path.tsx`: rutas visuales de autenticacion.
- `frontend/src/routes/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber.tsx`: pagina de curso.
- `frontend/src/routes/courses/$year/$periodType/$periodNumber/$courseCode/course-page/-documents-tab.tsx`: pestana de documentos.
- `frontend/src/routes/courses/$year/$periodType/$periodNumber/$courseCode/course-page/-evaluations-tab.tsx`: pestana de evaluaciones/calificaciones.
- `frontend/src/components/ui/`: componentes shadcn/ui copiados desde el proyecto base.

## Lo Que Ya Esta

### Base Tecnica

- Ya existe una estructura real de front-end, no es solo Figma o Canva.
- El proyecto compila con `pnpm build`.
- Se mantiene el uso de shadcn/ui y Tailwind CSS.
- Se mantiene TanStack Router para rutas file-based.
- Se mantiene TanStack Query como dependencia e integracion base.
- Se elimino TanStack Start/Nitro, por lo que ahora funciona como SPA de Vite.

### Login

- Existe una pantalla/ruta de autenticacion visual en `frontend/src/routes/auth/$path.tsx`.
- Existen componentes de inicio de sesion, registro, recuperacion de contrasena y cierre de sesion en `frontend/src/components/auth/`.
- La autenticacion sirve como prototipo visual, pero no debe tratarse como login funcional completo porque el proyecto no requiere backend funcional.

### Dashboard Principal Parcial

- La ruta principal `/` existe en `frontend/src/routes/index.tsx`.
- Actualmente muestra secciones de comunidades y cursos.
- Puede funcionar como punto inicial del sistema, pero todavia no representa un dashboard universitario general.

### Modulo de Cursos Parcial

- Existe listado de cursos por periodo en la pantalla principal.
- Existe navegacion a detalle de curso.
- Existe pagina de curso con pestanas: Inicio, Calendario, Documentos, Evaluaciones, GAAP y Evaluacion docente.
- Existe vista de documentos por carpetas y archivos.
- Existe vista de evaluaciones con notas, entregas, historial, rubrica y retroalimentacion.

### Modulo de Calificaciones Parcial

- La pestana `Evaluaciones` muestra notas por rubro y nota final.
- Hay informacion simulada suficiente para representar consulta de calificaciones de un curso.
- Falta una vista consolidada de calificaciones por estudiante y periodo.

### Componentes y Estilo

- Ya hay una biblioteca de componentes base en `frontend/src/components/ui/`.
- El header incluye navegacion contextual, modo oscuro, notificaciones, ayuda y menu de usuario.
- La app ya tiene una apariencia consistente con el proyecto base copiado.

## Pendiente Obligatorio

### Dashboard Principal

- Convertir `/` en un dashboard principal de la Plataforma Universitaria.
- Mostrar accesos claros a Portal Estudiantil, Portal Docente, Portal Administrativo, Portal Financiero y Dashboard Ejecutivo.
- Agregar resumen inicial con datos simulados: cursos activos, proximas clases, pagos pendientes, alertas academicas y accesos rapidos.

### Modulo de Matricula

- Crear pantalla de matricula de cursos.
- Incluir busqueda/listado de cursos disponibles.
- Incluir seleccion de cursos.
- Mostrar cupos, creditos, grupo, horario y profesor.
- Simular confirmacion de matricula.
- Mostrar resumen de cursos matriculados.

### Modulo de Horarios

- Crear vista de horario semanal.
- Relacionar cursos matriculados con bloques de tiempo.
- Mostrar aula, docente, grupo y modalidad.
- Idealmente incluir vista tipo calendario o tabla semanal.

### Modulo Financiero

- Crear vista de estado de cuenta.
- Mostrar pagos de matricula.
- Mostrar pagos de cursos.
- Mostrar historial de pagos.
- Mostrar montos pendientes, fechas de vencimiento y estado de pago.

### Modulo Administrativo

- Crear seccion administrativa con gestion de estudiantes, docentes, cursos y periodos academicos.
- Como prototipo, puede ser CRUD visual con datos simulados.
- Debe permitir ver listas, abrir detalle y simular acciones como crear, editar o cambiar estado.

### Dashboard Ejecutivo

- Crear dashboard ejecutivo orientado a alta gerencia.
- Debe incluir cantidad de estudiantes activos.
- Debe incluir ingresos por matricula.
- Debe incluir indicadores academicos.
- Debe incluir indicadores financieros.
- Para el entregable 23, tambien debe mostrar indicadores de desempeno del proyecto, no solo indicadores institucionales.

### Portal Estudiantil Completo

- Agregar perfil del estudiante.
- Completar matricula.
- Completar horarios.
- Completar calificaciones consolidadas.
- Agregar estado de cuenta.
- Agregar historial academico.

### Portal Docente

- Crear gestion de cursos desde perspectiva docente.
- Agregar registro de asistencia.
- Agregar registro de calificaciones.

### Rutas y Navegacion

- Definir rutas explicitas para cada modulo obligatorio.
- Agregar navegacion visible desde el header o desde un sidebar/dashboard principal.
- Evitar que los usuarios tengan que entrar por rutas de cursos antiguas para encontrar funcionalidades.

## Cosas Por Mejorar

### Adaptacion del Dominio

- El proyecto base todavia tiene identidad de `coursia`/TEC Digital.
- Conviene renombrar textos visibles hacia `Plataforma Universitaria` o `Universidad Tecnologica La Mejor`.
- Hay cursos reales/simulados del TEC que deben adaptarse al caso de la universidad ficticia.

### Datos Simulados

- Centralizar datos mock en `src/lib` o `src/data` para estudiantes, docentes, cursos, pagos, periodos y KPIs.
- Evitar datos dispersos directamente dentro de componentes grandes.
- Definir nombres consistentes para estudiantes, docentes, carreras y periodos.

### Completar Pestanas Vacias

- En la pagina de curso existen pestanas como Inicio, Calendario, GAAP y Evaluacion docente, pero actualmente solo se renderizan Documentos y Evaluaciones.
- Debe implementarse contenido minimo para Inicio y Calendario si se van a usar como parte del modulo de cursos/horarios.

### Autenticacion Como Prototipo

- El login actual tiene componentes visuales completos, pero al haber removido backend no debe prometer autenticacion real.
- Para el prototipo, conviene simular roles: estudiante, docente, administrativo y ejecutivo.
- Se puede agregar un selector de rol o credenciales demo para navegar entre portales.

### Responsividad y Presentacion

- Verificar manualmente en desktop y mobile las pantallas principales.
- El proyecto base parece responsive en varias partes, pero los nuevos modulos deben mantener ese comportamiento.
- Cuidar que tablas administrativas y financieras sean usables en pantallas pequenas.

### Dashboard Ejecutivo del Proyecto

- Separar dos conceptos: dashboard ejecutivo institucional y dashboard ejecutivo del proyecto.
- El dashboard institucional muestra metricas universitarias.
- El dashboard del proyecto debe mostrar avance, cronograma, presupuesto, riesgos, cambios, calidad y productividad.

### Preparacion Para Entrega

- Agregar datos y pantallas suficientes para hacer una demo navegable completa.
- Crear una ruta o pagina de inicio que explique claramente que es un prototipo.
- Verificar que `pnpm build` siga pasando despues de cada modulo nuevo.

## Matriz de Cumplimiento

| Requisito | Estado | Observacion |
| --- | --- | --- |
| Login | Parcial | Existe UI de autenticacion, sin backend funcional. |
| Dashboard Principal | Parcial | Existe `/`, pero actualmente muestra comunidades y cursos, no un dashboard integral. |
| Modulo de Matricula | Pendiente | No hay pantalla de matricula. |
| Modulo de Cursos | Parcial | Hay listado y detalle de cursos, pero falta adaptarlo al dominio del proyecto. |
| Modulo de Horarios | Pendiente | Existe pestana Calendario, pero no hay contenido renderizado. |
| Modulo de Calificaciones | Parcial | Hay evaluaciones por curso, falta consolidado por estudiante. |
| Modulo Financiero | Pendiente | No hay estado de cuenta ni pagos. |
| Modulo Administrativo | Pendiente | No hay gestion de estudiantes, docentes, cursos ni periodos. |
| Dashboard Ejecutivo | Pendiente | No existe vista de indicadores ejecutivos institucionales ni del proyecto. |
| Portal Estudiantil | Parcial | Hay cursos/evaluaciones, faltan perfil, matricula, horarios, estado de cuenta e historial. |
| Portal Docente | Pendiente | No hay asistencia ni registro docente de calificaciones. |
| Portal Administrativo | Pendiente | No hay CRUD visual administrativo. |
| Portal Financiero | Pendiente | No hay pagos ni historial financiero. |

## Prioridad Recomendada

1. Crear dashboard principal con accesos a todos los modulos.
2. Crear rutas base para matricula, horarios, financiero, administrativo y dashboard ejecutivo.
3. Adaptar textos/identidad de `coursia` a Plataforma Universitaria.
4. Completar modulo de cursos con Inicio y Calendario.
5. Crear calificaciones consolidadas e historial academico.
6. Crear dashboard ejecutivo institucional y dashboard de desempeno del proyecto.
7. Agregar modo demo por roles para estudiante, docente, administrativo y ejecutivo.

## Conclusion

El front-end ya tiene una base tecnica fuerte y reutilizable, especialmente en componentes, estilos, routing, login visual y modulo de cursos/evaluaciones. Sin embargo, todavia no cumple completamente el Entregable 18 porque faltan los modulos de matricula, horarios, financiero, administrativo y dashboard ejecutivo. El siguiente paso deberia ser convertir la app copiada en una plataforma universitaria completa, usando los componentes existentes y datos simulados para cubrir todos los requisitos minimos del proyecto.
