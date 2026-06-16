import { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  ListIcon,
  RotateCcwIcon,
  XIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'

import { getDemoUser } from '@/lib/demo-auth'
import { evaluations } from './-gaap-data'
import { EvaluationEditor } from './-gaap-editor'

export function GaapTab() {
  const user = getDemoUser()
  const ROLE = user?.role || 'student'
  
  const [selectedEvalId, setSelectedEvalId] = useState<string | null>(evaluations[0].id)
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>('view')

  const { year, periodType, periodNumber, courseCode, groupNumber } = useParams({ strict: false }) as any

  const selectedEval = evaluations.find((e) => e.id === selectedEvalId)

  const renderQuestionContent = (question: any) => {
    if (ROLE === 'teacher') {
      const qData = question.config || {}
      switch (question.type) {
        case 'single':
        case 'multiple':
          const opts = qData.options || question.options || []
          return (
            <div className="space-y-2 w-full">
              {opts.map((o: any, idx: number) => (
                <div key={o.id || idx} className={cn("p-2 border rounded-md text-sm flex gap-3 items-center", o.isCorrect ? "border-green-500 bg-green-500/10 dark:bg-green-500/5 text-green-700 dark:text-green-400 font-medium" : "border-border text-foreground")}>
                   {o.isCorrect ? <CheckIcon className="size-4" /> : <div className="size-4" />}
                   <span>{o.text}</span>
                </div>
              ))}
            </div>
          )
        case 'short_answer':
          const answers = qData.answers || (question.correctAnswer ? [question.correctAnswer] : [])
          return (
            <div className="p-3 bg-muted/20 border border-border rounded-md text-sm">
               <span className="font-semibold text-muted-foreground mr-2">Variantes aceptadas:</span>
               <span className="text-foreground">{answers.join(' | ')}</span>
            </div>
          )
        case 'numeric':
          return (
            <div className="p-3 bg-muted/20 border border-border rounded-md text-sm flex gap-6">
               <div>
                 <span className="font-semibold text-muted-foreground mr-2">Valor esperado:</span>
                 <span className="text-foreground">{qData.exact || question.correctAnswer || '-'}</span>
               </div>
               <div>
                 <span className="font-semibold text-muted-foreground mr-2">Tolerancia:</span>
                 <span className="text-foreground">±{qData.tolerance || '0'}</span>
               </div>
            </div>
          )
        case 'essay':
          return (
            <div className="w-full text-sm italic text-muted-foreground p-3 bg-muted/20 rounded-md border border-border text-center">
               El estudiante responderá de forma libre. Se requiere revisión manual.
            </div>
          )
        case 'matching':
          const pairs = qData.pairs || question.pairs || []
          return (
            <div className="space-y-2 w-full">
              {pairs.map((p: any, idx: number) => (
                 <div key={idx} className="flex gap-2 items-center text-sm">
                   <div className="p-2 bg-muted/30 border border-border rounded-md flex-1 text-foreground">{p.left}</div>
                   <span className="text-muted-foreground">↔</span>
                   <div className="p-2 bg-muted/30 border border-border rounded-md flex-1 font-medium text-foreground">{p.right || p.correctRight}</div>
                 </div>
              ))}
            </div>
          )
        case 'ordering':
          const items = qData.items || question.orderItems || []
          return (
            <div className="space-y-2 w-full">
              {items.map((it: any, idx: number) => (
                 <div key={idx} className="p-2 border border-border bg-muted/10 rounded-md text-sm flex gap-3 items-center">
                    <span className="font-bold text-muted-foreground w-6 text-center">{it.correctPos || idx + 1}.</span>
                    <span className="text-foreground">{it.text}</span>
                 </div>
              ))}
            </div>
          )
        case 'code':
          return (
            <div className="space-y-2 w-full">
               <div className="text-sm">
                 <span className="font-semibold text-muted-foreground mr-2">Lenguaje esperado:</span>
                 <span className="uppercase text-foreground font-medium">{qData.language || 'JAVASCRIPT'}</span>
               </div>
               {qData.initialCode && (
                 <div className="text-xs font-mono p-3 bg-[#1e1e1e] text-zinc-300 rounded-md whitespace-pre-wrap">
                   {qData.initialCode}
                 </div>
               )}
            </div>
          )
        case 'hotspot':
          return (
            <div className="space-y-3 w-full">
              <div className="relative inline-block border border-border rounded-md overflow-hidden select-none">
                <img
                  src={qData.imageUrl || "/mapa.jpg"}
                  alt="Imagen base"
                  className="w-full max-w-lg h-auto block bg-muted"
                />
                {/* Zona correcta */}
                <div
                  className="absolute rounded-full border-2 border-green-500 border-dashed animate-pulse bg-green-500/20"
                  style={{
                    top: qData.zoneTop || '74%',
                    left: qData.zoneLeft || '42%',
                    width: qData.zoneWidth || '3rem',
                    height: qData.zoneHeight || '4rem',
                  }}
                ></div>
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-green-500 border-dashed rounded-full bg-green-500/20"></div>
                  <span>Zona correcta configurada</span>
                </div>
              </div>
            </div>
          )
        default:
          return <div className="text-sm text-muted-foreground">Tipo de pregunta no soportado visualmente ({question.type}).</div>
      }
    }

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
                {question.options.map((option: any) => (
                  <TableRow
                    key={option.id}
                    className={cn(
                      option.selected ? 'bg-muted/30' : 'bg-background'
                    )}
                  >
                    <TableCell className="text-center">
                      <div className="flex justify-center pointer-events-none">
                        {question.type === 'multiple' ? (
                          <Checkbox checked={option.selected} />
                        ) : (
                          <RadioGroup
                            value={option.selected ? option.id : undefined}
                            className="flex justify-center"
                          >
                            <RadioGroupItem
                              value={option.id}
                              id={option.id}
                              className={cn(!option.selected && 'opacity-50')}
                            />
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
                <span
                  className={cn(
                    'font-medium',
                    isCorrect ? 'text-green-700 dark:text-green-500' : 'text-red-700 dark:text-red-500'
                  )}
                >
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
            {question.orderItems.map((item: any, idx: number) => (
              <div
                key={idx}
                className={cn(
                  'flex items-center gap-3 p-3 border rounded-md',
                  item.isCorrect
                    ? 'border-border bg-background'
                    : 'border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/10'
                )}
              >
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
              <img
                src="/mapa.jpg"
                alt="Mapa de Europa"
                className="w-full max-w-lg h-auto block bg-muted"
              />
              {/* Marcador del estudiante */}
              <div
                className="absolute w-4 h-4 rounded-full bg-green-500 ring-4 ring-white dark:ring-zinc-950 shadow-md"
                style={{ top: '78%', left: '45%' }}
              ></div>
              {/* Zona correcta */}
              <div
                className="absolute w-12 h-16 rounded-full border-2 border-green-500 border-dashed animate-pulse"
                style={{ top: '74%', left: '42%' }}
              ></div>
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
                  <TableHead className="w-1/3 text-center">
                    Tu emparejamiento
                  </TableHead>
                  <TableHead className="w-1/3 text-right">
                    Respuesta correcta
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {question.pairs.map((pair: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium bg-muted/10">
                      {pair.left}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-sm font-normal',
                          pair.isCorrect
                            ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10'
                            : 'border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10'
                        )}
                      >
                        {pair.studentRight}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground font-medium">
                      {pair.correctRight}
                    </TableCell>
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
            {question.feedback && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Comentarios del evaluador
                </span>
                <div className="p-4 rounded-md border border-primary/20 bg-primary/5 text-sm leading-relaxed text-foreground">
                  {question.feedback}
                </div>
              </div>
            )}
          </div>
        )
      default:
        return (
          <div className="p-4 text-sm text-muted-foreground italic border rounded-md">
            Tipo de pregunta no soportado visualmente ({question.type}).
          </div>
        )
    }
  }

  return (
    <div className="grid w-full bg-background flex-1" style={{ gridTemplateColumns: '300px 1fr' }}>
      {/* Sidebar de Evaluaciones */}
      <div className="border-r border-border bg-muted/30">
        <div className="sticky top-0 flex flex-col gap-4 p-4 max-h-screen overflow-y-auto">
          {ROLE === 'teacher' && (
            <div className="pb-4 border-b border-border">
              <Button 
                className="w-full" 
                onClick={() => {
                  setMode('create')
                  setSelectedEvalId(null)
                }}
              >
                <PlusIcon className="mr-2 size-4" /> Nueva evaluación
              </Button>
            </div>
          )}

          {evaluations.map((evaluation) => {
            const isSelected = evaluation.id === selectedEvalId
            return (
              <Card
                key={evaluation.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedEvalId(evaluation.id)
                  setMode('view')
                }}
                className={cn(
                  'cursor-pointer transition-colors text-left shadow-sm',
                  isSelected
                    ? 'bg-[#003B70] text-primary-foreground border-[#003B70] hover:bg-[#003B70]/90'
                    : 'bg-background border-border hover:bg-muted text-foreground'
                )}
              >
                <CardHeader className="p-4">
                  <CardTitle
                    className={cn(
                      'text-sm flex items-start justify-between',
                      isSelected ? 'text-primary-foreground' : ''
                    )}
                  >
                    <span>{evaluation.title}</span>
                    {ROLE !== 'teacher' && (
                      <span className="text-xs font-normal opacity-80">
                        {evaluation.score}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription
                    className={cn(
                      'text-xs mt-1',
                      isSelected ? 'text-primary-foreground/80' : ''
                    )}
                  >
                    {ROLE === 'teacher' ? 'Límite: ' : 'Realizada: '}
                    <br />
                    {ROLE === 'teacher' ? evaluation.dueDate : evaluation.dateTaken}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Área de Solucionario / Editor */}
      <div className="p-6 lg:p-10">
        {(mode === 'create' || mode === 'edit') ? (
          <EvaluationEditor 
            initialData={mode === 'edit' ? selectedEval : undefined}
            onSave={() => setMode('view')}
            onCancel={() => setMode('view')}
          />
        ) : selectedEval?.sections ? (
          <div className="space-y-8 pb-10">
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {selectedEval.title}
                </h1>
                
                {ROLE === 'teacher' && (
                  <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setMode('edit')}>
                      <PencilIcon className="size-4 mr-2" /> Editar
                    </Button>
                    <Link
                      to={`/courses/${year}/${periodType}/${periodNumber}/${courseCode}/${groupNumber}/gaap/review/${selectedEval.id}`}
                      className={buttonVariants({ variant: 'default' })}
                    >
                      <EyeIcon className="size-4 mr-2" /> Ver respuestas
                    </Link>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground border-b border-border pb-4">
                {selectedEval.dueDate && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-4 opacity-70" />
                    <span>Fecha límite: {selectedEval.dueDate}</span>
                  </div>
                )}
                {selectedEval.attempts && (
                  <div className="flex items-center gap-2">
                    <RotateCcwIcon className="size-4 opacity-70" />
                    <span>Intentos: {selectedEval.attempts}</span>
                  </div>
                )}
                {selectedEval.questionCount && (
                  <div className="flex items-center gap-2">
                    <ListIcon className="size-4 opacity-70" />
                    <span>Preguntas: {selectedEval.questionCount}</span>
                  </div>
                )}
                {selectedEval.timeLimit && (
                  <div className="flex items-center gap-2">
                    <ClockIcon className="size-4 opacity-70" />
                    <span>Tiempo: {selectedEval.timeLimit}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-10">
              {selectedEval.sections.map((section) => (
                <div key={section.id} className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-medium text-foreground">
                        {section.title}
                      </h2>
                      {section.typeBadge && (
                        <Badge
                          variant="secondary"
                          className="font-normal text-xs"
                        >
                          {section.typeBadge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>

                  <div className="space-y-8">
                    {section.questions.map((question) => (
                      <div key={question.id} className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <h3 className="font-bold text-foreground text-lg">
                            Pregunta {question.number}
                          </h3>
                          <div className="flex items-center gap-3 text-sm font-medium px-3 py-1 bg-muted rounded-md text-muted-foreground">
                            <span>
                              Valor: {question.value} pt
                              {question.value !== 1 ? 's' : ''}
                            </span>
                            {ROLE !== 'teacher' && (
                              <>
                                <span className="w-px h-4 bg-border"></span>
                                <span
                                  className={cn(
                                    question.earned === question.value
                                      ? 'text-green-600 dark:text-green-500'
                                      : 'text-foreground'
                                  )}
                                >
                                  Obtenido: {question.earned} pt
                                  {question.earned !== 1 ? 's' : ''}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-foreground">
                          {question.text}
                        </p>

                        {/* Renderizado dinámico del contenido de la pregunta */}
                        {renderQuestionContent(question)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Selecciona una evaluación para ver su solucionario.
          </div>
        )}
      </div>
    </div>
  )
}
