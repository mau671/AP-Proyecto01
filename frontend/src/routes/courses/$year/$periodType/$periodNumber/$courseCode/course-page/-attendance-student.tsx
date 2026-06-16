import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CheckCircle2 } from 'lucide-react'
import { AttendanceEditor } from './-attendance-editor'

interface AttendanceStudentProps {
  selectedSession: any;
  studentSessions: any[];
  courseCode?: string;
  weekNumber?: number;
}

export function AttendanceStudent({ selectedSession, studentSessions, courseCode, weekNumber }: AttendanceStudentProps) {
  const [notesStore, setNotesStore] = useState<Record<string, string>>(() => {
    const initialNotes: Record<string, string> = {}
    const mockContent = [
      {
        type: "heading",
        props: { level: 2 },
        content: "Desarrollo avanzado de la aplicación y patrones de diseño"
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Durante el transcurso de la sesión de hoy logramos profundizar en diversos temas fundamentales relacionados con la escalabilidad del sistema y asimismo discutimos la enorme importancia de aplicar patrones de diseño adecuados puesto que esto garantiza una arquitectura sumamente robusta a largo plazo. Además el profesor nos recomendó visitar un excelente ", styles: {} },
          { type: "link", href: "https://ejemplo.com", content: [{ type: "text", text: "recurso educativo", styles: { underline: true } }] },
          { type: "text", text: " ya que contiene múltiples ejemplos interactivos que facilitan la comprensión de todos estos conceptos complejos por consiguiente considero que será un material de apoyo sumamente valioso.", styles: {} }
        ]
      },
      {
        type: "heading",
        props: { level: 3 },
        content: "Beneficios de utilizar una arquitectura modular"
      },
      {
        type: "bulletListItem",
        content: "En primer lugar el código se vuelve mucho más mantenible debido a que cada módulo se encarga de una tarea sumamente específica y de igual forma aisla los errores potenciales."
      },
      {
        type: "bulletListItem",
        content: "En segundo lugar los desarrolladores pueden trabajar en paralelo sin afectar el trabajo de sus compañeros puesto que las dependencias entre los componentes se mantienen al mínimo absoluto."
      },
      {
        type: "heading",
        props: { level: 3 },
        content: "Pasos esenciales para la implementación inicial"
      },
      {
        type: "numberedListItem",
        content: "Primero necesitamos inicializar el repositorio de código y seguidamente configurar las variables de entorno principales ya que esto sentará las bases del entorno de ejecución."
      },
      {
        type: "numberedListItem",
        content: "Posteriormente debemos estructurar el esqueleto básico del servidor y de igual manera definir las rutas correspondientes debido a que la interfaz gráfica dependerá por completo de estos cimientos."
      },
      {
        type: "heading",
        props: { level: 3 },
        content: "Tabla comparativa de metodologías"
      },
      {
        type: "table",
        content: {
          type: "tableContent",
          rows: [
            {
              cells: [
                [{ type: "text", text: "Metodología evaluada", styles: { bold: true } }],
                [{ type: "text", text: "Ventaja principal detectada", styles: { bold: true } }],
                [{ type: "text", text: "Desventaja principal observada", styles: { bold: true } }]
              ]
            },
            {
              cells: [
                [{ type: "text", text: "Desarrollo ágil estructurado", styles: {} }],
                [{ type: "text", text: "Adaptabilidad ante los cambios del cliente", styles: {} }],
                [{ type: "text", text: "Exige una comunicación constante y fluida", styles: {} }]
              ]
            },
            {
              cells: [
                [{ type: "text", text: "Modelo tradicional en cascada", styles: {} }],
                [{ type: "text", text: "Planificación sumamente detallada y estricta", styles: {} }],
                [{ type: "text", text: "Poca flexibilidad frente a requisitos nuevos", styles: {} }]
              ]
            }
          ]
        }
      },
      {
        type: "paragraph",
        content: "Finalmente analizamos una pequeña porción de código ilustrativa debido a que observar un caso práctico resulta esencial para afianzar todo lo aprendido y de la misma manera nos permite prevenir errores comunes."
      },
      {
        type: "codeBlock",
        props: { language: "javascript" },
        content: "function inicializarAplicacion(configuracion) {\n  let estadoInicial = configuracion.cargarDatosPrincipales()\n  let contadorAuxiliar = 0\n  while (contadorAuxiliar < estadoInicial.elementos) {\n    configuracion.prepararComponente(contadorAuxiliar)\n    contadorAuxiliar++\n  }\n  return estadoInicial\n}"
      }
    ]
    
    for (const session of studentSessions) {
      if (session.date.getDay() === 5) {
        initialNotes[session.id] = JSON.stringify(mockContent)
      }
    }
    return initialNotes
  })
  
  if (!selectedSession) return null;
  
  const studentSession = studentSessions.find(s => s.id === selectedSession.id)
  const isPresent = studentSession?.present

  return (
    <div className="flex flex-col p-6 overflow-y-scroll h-full min-h-[500px]">
      <div className="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-border">
        <p className="text-muted-foreground text-sm sm:text-base">
          {format(selectedSession.date, "EEEE d 'de' MMMM, yyyy", { locale: es }).replace(/^\w/, c => c.toUpperCase())}
        </p>
        
        <div className="flex items-center h-8">
          {isPresent !== undefined ? (
            isPresent ? (
              <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                <CheckCircle2 data-icon="inline-start" />
                Presente
              </Badge>
            ) : (
              <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                Ausente
              </Badge>
            )
          ) : (
            <Badge variant="secondary">
              Pendiente
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <AttendanceEditor 
            key={selectedSession.id} 
            initialContent={notesStore[selectedSession.id]}
            courseCode={courseCode}
            weekNumber={weekNumber}
            sessionDate={selectedSession.date}
            onChange={(content) => {
              setNotesStore(prev => ({ ...prev, [selectedSession.id]: content }))
            }}
          />
        </div>
      </div>
    </div>
  )
}
