import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, User, Search, Send, CheckIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'

import { enrolledStudents } from '../../course-page/-data'
import { evaluations } from '../../course-page/-gaap-data'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/gaap/review/$gaapId'
)({
  component: GaapReviewPage,
})

function GaapReviewPage() {
  const { year, periodType, periodNumber, courseCode, gaapId } = Route.useParams()
  const navigate = Route.useNavigate()

  const selectedEval = evaluations.find((e) => e.id === gaapId)

  useEffect(() => {
    if (!selectedEval) {
      toast.error('La evaluación GAAP seleccionada no existe')
      navigate({
        to: '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber',
        params: { year, periodType, periodNumber, courseCode, groupNumber: '1' },
        search: { tab: 5 }
      })
    }
  }, [selectedEval, navigate, year, periodType, periodNumber, courseCode])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState<string>(enrolledStudents[0]?.id || '')

  if (!selectedEval) return null

  // Mocks para simular que todos los estudiantes han entregado la evaluación GAAP
  const filteredStudents = enrolledStudents.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const selectedStudent = enrolledStudents.find(s => s.id === selectedStudentId)

  const renderStudentAnswerView = (question: any) => {
    switch (question.type) {
      case 'single':
      case 'multiple':
        return (
          <div className="overflow-hidden rounded-md border border-border">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="text-center whitespace-nowrap px-4 w-24">
                    Respuesta del estudiante
                  </TableHead>
                  <TableHead className="text-center whitespace-nowrap px-4 w-24">
                    Respuesta correcta
                  </TableHead>
                  <TableHead className="text-left">Descripción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {question.options?.map((option: any) => (
                  <TableRow
                    key={option.id}
                    className={cn(option.selected ? 'bg-muted/30' : 'bg-background')}
                  >
                    <TableCell className="text-center">
                      <div className="flex justify-center pointer-events-none">
                        {question.type === 'multiple' ? (
                          <Checkbox checked={option.selected} />
                        ) : (
                          <RadioGroup value={option.selected ? option.id : undefined} className="flex justify-center">
                            <RadioGroupItem value={option.id} id={option.id} className={cn(!option.selected && 'opacity-50')} />
                          </RadioGroup>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {option.isCorrect && (
                        <div className="flex justify-center text-green-600 dark:text-green-500">
                          <CheckIcon className="size-5" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-left font-medium">
                      <label className="cursor-default text-foreground">
                        {option.text}
                      </label>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      case 'short_answer':
      case 'numeric': {
        const isCorrect = question.earned === question.value
        return (
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 space-y-1.5 p-4 rounded-md border border-border bg-muted/20">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Respuesta del estudiante
              </span>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckIcon className="size-4 text-green-600" />
                ) : (
                  <XIcon className="size-4 text-red-600" />
                )}
                <span className={cn('font-medium', isCorrect ? 'text-green-700 dark:text-green-500' : 'text-red-700 dark:text-red-500')}>
                  {question.studentAnswer}
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-1.5 p-4 rounded-md border border-border bg-muted/20">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Respuesta correcta
              </span>
              <div className="font-medium text-foreground">
                {question.correctAnswer}
              </div>
            </div>
          </div>
        )
      }
      case 'code':
        return (
          <div className="space-y-3">
            <div className="rounded-md overflow-hidden border border-border bg-[#1e1e1e]">
              <div className="bg-[#2d2d2d] px-4 py-2 text-xs font-mono text-zinc-400 border-b border-[#404040]">
                solucion.js
              </div>
              <pre className="p-4 text-sm font-mono text-zinc-50 overflow-x-auto">
                <code>{question.studentCode}</code>
              </pre>
            </div>
            {question.feedback && (
              <div className="p-3 text-sm rounded-md bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 flex gap-2 items-start">
                <CheckIcon className="size-5 shrink-0" />
                <p>{question.feedback}</p>
              </div>
            )}
          </div>
        )
      case 'ordering':
        return (
          <div className="space-y-2">
            {question.orderItems?.map((item: any, idx: number) => (
              <div key={idx} className={cn('flex items-center gap-3 p-3 border rounded-md', item.isCorrect ? 'border-border bg-background' : 'border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/10')}>
                <div className="flex items-center justify-center size-8 rounded bg-muted font-bold text-muted-foreground">
                  {item.studentPos}
                </div>
                <div className="flex-1 text-sm font-medium">{item.text}</div>
                {item.isCorrect ? (
                  <CheckIcon className="size-5 text-green-600 dark:text-green-500" />
                ) : (
                  <div className="text-xs font-semibold text-red-600 dark:text-red-400 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded">
                    Correcto: #{item.correctPos}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      case 'hotspot':
        return (
          <div className="space-y-3">
            <div className="relative inline-block border border-border rounded-md overflow-hidden select-none">
              <img src="/mapa.jpg" alt="Mapa" className="w-full max-w-lg h-auto block bg-muted" />
              <div className="absolute w-4 h-4 rounded-full bg-green-500 ring-4 ring-white dark:ring-zinc-950 shadow-md" style={{ top: '78%', left: '45%' }}></div>
              <div className="absolute w-12 h-16 rounded-full border-2 border-green-500 border-dashed animate-pulse" style={{ top: '74%', left: '42%' }}></div>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Tu marca</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-green-500 border-dashed rounded-full"></div>
                <span>Zona esperada</span>
              </div>
            </div>
          </div>
        )
      case 'matching':
        return (
          <div className="overflow-hidden rounded-md border border-border">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="w-1/3">Concepto</TableHead>
                  <TableHead className="w-1/3 text-center">Tu emparejamiento</TableHead>
                  <TableHead className="w-1/3 text-right">Respuesta correcta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {question.pairs?.map((pair: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium bg-muted/10">{pair.left}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn('text-sm font-normal', pair.isCorrect ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10' : 'border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10')}>
                        {pair.studentRight}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground font-medium">{pair.correctRight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      case 'essay':
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Respuesta del estudiante
              </span>
              <div className="p-4 rounded-md border border-border bg-background text-sm leading-relaxed text-foreground">
                {question.studentText}
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="p-4 text-sm text-muted-foreground italic border rounded-md">
            Tipo de pregunta no soportado ({question.type}).
          </div>
        )
    }
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable] w-full px-4 py-8 sm:px-6 md:px-8">
      {/* Header Navigation & Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => window.history.back()}
              className="shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{selectedEval.title}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground pl-12">
            <p>Estado: <span className="font-semibold text-green-600 dark:text-green-500">Cerrado</span></p>
            <span className="text-border">•</span>
            <p>Respuestas: <span className="font-semibold">{enrolledStudents.length} / {enrolledStudents.length}</span></p>
          </div>
        </div>

        <div className="pl-12 sm:pl-0">
          <Button 
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm"
            onClick={() => toast.success('Notas publicadas exitosamente. Los estudiantes ya pueden ver sus resultados de la evaluación GAAP.')}
          >
            <Send className="size-4" /> Publicar notas
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Lista de estudiantes */}
        <div className="w-full lg:w-1/3 flex flex-col border border-border rounded-xl bg-background shadow-sm overflow-hidden shrink-0 max-h-[600px]">
          <div className="p-4 border-b border-border bg-background z-10 space-y-3">
            <h2 className="font-semibold text-sm">Entregas ({enrolledStudents.length}/{enrolledStudents.length})</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar estudiante..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-muted/5 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 relative min-h-[300px]">
            <ScrollArea className="absolute inset-0">
              <div className="p-2 space-y-1">
                {filteredStudents.map(student => {
                  const isSelected = student.id === selectedStudentId
                  // Simular un puntaje aleatorio pero consistente basado en el ID
                  const pseudoScore = 80 + (parseInt(student.id) % 20)
                  return (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => setSelectedStudentId(student.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors",
                        isSelected ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full border", isSelected ? "border-primary-foreground/20 bg-primary-foreground/10" : "border-border bg-muted/50")}>
                          <User className="size-4" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium truncate">{student.name}</span>
                          <span className={cn("text-xs truncate", isSelected ? "text-primary-foreground/80" : "text-muted-foreground")}>
                            {student.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-3">
                         <div className={cn("px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap", isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400")}>
                           {pseudoScore} pts
                         </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Respuestas del estudiante */}
        <div className="w-full lg:w-2/3 flex flex-col border border-border rounded-xl bg-background shadow-sm overflow-hidden">
           {selectedStudent ? (
             <div className="flex flex-col">
               <div className="p-4 border-b border-border bg-background flex items-center justify-between">
                 <div className="flex flex-col gap-1">
                   <h2 className="font-semibold text-lg flex items-center gap-2">
                     <User className="size-5 text-muted-foreground" />
                     {selectedStudent.name}
                   </h2>
                 </div>
                 <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md">
                   Evaluado
                 </span>
               </div>
               
               <div className="flex flex-col gap-6 p-4">
                 <div className="space-y-8">
                    {selectedEval.sections.map((section: any, sIdx: number) => (
                      <div key={section.id || sIdx} className="space-y-6">
                         <div className="border-b border-border pb-3">
                           <h3 className="text-xl font-bold">{section.title}</h3>
                           {section.description && <p className="text-muted-foreground text-sm mt-1">{section.description}</p>}
                         </div>
                         <div className="space-y-8">
                           {section.questions.map((question: any, qIdx: number) => (
                              <div key={question.id || qIdx} className="space-y-4">
                                 <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                       <div className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                                         Pregunta {qIdx + 1}
                                       </div>
                                       <p className="text-foreground font-medium leading-relaxed">
                                         {question.text}
                                       </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                       <Badge variant="outline" className="font-semibold text-sm">
                                          {question.earned !== undefined ? question.earned : question.value} / {question.value} pts
                                       </Badge>
                                    </div>
                                 </div>
                                 <div className="bg-muted/5 p-4 md:p-6 rounded-lg border border-border">
                                    {renderStudentAnswerView(question)}
                                 </div>
                              </div>
                           ))}
                         </div>
                      </div>
                    ))}
                 </div>
               </div>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center p-12 text-muted-foreground h-full min-h-[400px]">
               <User className="size-12 mb-4 opacity-20" />
               <p className="text-lg font-medium">Ningún estudiante seleccionado</p>
               <p className="text-sm">Selecciona un estudiante de la lista para revisar sus respuestas de la evaluación GAAP.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
