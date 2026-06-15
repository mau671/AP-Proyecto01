import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, User, Users, FileIcon, Link as LinkIcon, CheckCircle2, Circle, MessageSquare, Save, Download, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'

import { evaluationGroups, updateEvaluationGroups, enrolledStudents } from '../../course-page/-data'
import type { TeacherSubmissionReview, SubmissionEntry } from '../../course-page/-data'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/evaluations/review',
)({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      groupIndex: typeof search.groupIndex === 'number' ? search.groupIndex : 0,
      itemIndex: typeof search.itemIndex === 'number' ? search.itemIndex : 0,
    }
  },
  component: ReviewSubmissionsPage,
})

// Generate mock reviews if none exist
function generateMockReviews(item: any, students: any[]): TeacherSubmissionReview[] {
  if (item.studentReviews && item.studentReviews.length > 0) {
    return item.studentReviews
  }
  
  if (item.peoplePerGroup > 1 && item.members && item.members.length > 0) {
    // Generate by group
    return item.members.map((groupStr: string, idx: number) => {
      // Group format is "GroupName: Student1, Student2"
      const name = groupStr.split(':')[0] || `Grupo ${idx + 1}`
      // Randomly decide if they submitted based on idx
      const submitted = idx % 2 === 0
      const submission: SubmissionEntry | null = submitted ? {
        name: `entrega-${name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        submittedAt: new Date(Date.now() - Math.random() * 100000000).toISOString(),
        isLink: false
      } : null

      return {
        studentId: name, // Using group name as ID for groups
        submission,
        submissionHistory: submission ? [submission] : [],
        score: null,
        feedback: '',
        feedbackFiles: []
      }
    })
  }

  // Generate by student
  return students.map((s, idx) => {
    const submitted = idx % 3 !== 0
    const isLink = idx % 2 === 0
    const submission: SubmissionEntry | null = submitted ? {
      name: isLink ? 'https://github.com/student/project' : `tarea-${s.name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      submittedAt: new Date(Date.now() - Math.random() * 100000000).toISOString(),
      isLink
    } : null

    return {
      studentId: s.id,
      submission,
      submissionHistory: submission ? [submission] : [],
      score: null,
      feedback: '',
      feedbackFiles: []
    }
  })
}

function ReviewSubmissionsPage() {
  const navigate = Route.useNavigate()
  const { groupIndex, itemIndex } = Route.useSearch()

  const group = evaluationGroups[groupIndex]
  const item = group?.items[itemIndex]

  useEffect(() => {
    if (!item) {
      toast.error('La evaluación seleccionada no existe')
      navigate({
        to: '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber',
        search: { tab: 3 }
      })
    }
  }, [item, navigate])

  if (!item) return null

  const isGroupEval = item.peoplePerGroup > 1

  const [reviews, setReviews] = useState<TeacherSubmissionReview[]>(() => generateMockReviews(item, enrolledStudents))
  const [selectedId, setSelectedId] = useState<string | null>(reviews[0]?.studentId || null)

  const selectedReview = reviews.find(r => r.studentId === selectedId)

  // Local state for the selected review to allow editing before saving
  const [localScore, setLocalScore] = useState<string>(selectedReview?.score?.toString() ?? '')
  const [localFeedback, setLocalFeedback] = useState<string>(selectedReview?.feedback ?? '')

  useEffect(() => {
    setLocalScore(selectedReview?.score?.toString() ?? '')
    setLocalFeedback(selectedReview?.feedback ?? '')
  }, [selectedId, selectedReview])

  const handleSaveReview = () => {
    if (!selectedId) return

    const parsedScore = localScore === '' ? null : parseFloat(localScore)
    if (parsedScore !== null && (isNaN(parsedScore) || parsedScore < 0 || parsedScore > item.score.max)) {
      toast.error(`La nota debe estar entre 0 y ${item.score.max}`)
      return
    }

    const newReviews = reviews.map(r => {
      if (r.studentId === selectedId) {
        return {
          ...r,
          score: parsedScore,
          feedback: localFeedback
        }
      }
      return r
    })

    setReviews(newReviews)
    
    // Save to global state
    const newGroups = [...evaluationGroups]
    newGroups[groupIndex].items[itemIndex] = {
      ...item,
      studentReviews: newReviews
    }
    updateEvaluationGroups(newGroups)
    
    toast.success('Evaluación guardada exitosamente')
  }

  const getEntityName = (id: string) => {
    if (isGroupEval) return id // For groups, the ID is the group name
    const student = enrolledStudents.find(s => s.id === id)
    return student ? student.name : id
  }

  const handleCancel = () => {
    navigate({
      to: '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber',
      search: { tab: 3 }
    })
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable] w-full px-4 py-8 sm:px-6 md:px-8">
      {/* Header Navigation */}
      <button 
        type="button" 
        onClick={handleCancel}
        className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Volver a evaluaciones</span>
      </button>

      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Revisar entregas: {item.name}</h1>
        <p className="text-sm text-muted-foreground">
          Valor máximo: <span className="font-semibold">{item.score.max} pts</span> | Modalidad: {isGroupEval ? 'Grupal' : 'Individual'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[600px]">
        {/* Left Column: List */}
        <div className="w-full lg:w-1/3 flex flex-col border border-border rounded-xl bg-background shadow-sm overflow-hidden shrink-0">
          <div className="p-4 border-b border-border bg-muted/20">
            <h2 className="font-semibold text-sm">Entregas ({reviews.filter(r => r.submission).length}/{reviews.length})</h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {reviews.map(review => {
                const name = getEntityName(review.studentId)
                const isSelected = review.studentId === selectedId
                const hasSubmitted = !!review.submission
                const isGraded = review.score !== null

                return (
                  <button
                    key={review.studentId}
                    type="button"
                    onClick={() => setSelectedId(review.studentId)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors cursor-pointer",
                      isSelected ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "size-8 rounded-full flex items-center justify-center shrink-0",
                        isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        {isGroupEval ? <Users className="size-4" /> : <User className="size-4" />}
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <span className={cn(
                          "text-sm font-medium truncate",
                          isSelected ? "text-primary" : "text-foreground"
                        )}>{name}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          {hasSubmitted ? (
                            <><CheckCircle2 className="size-3 text-green-500" /> Entregado</>
                          ) : (
                            <><Circle className="size-3 text-red-400" /> Sin entrega</>
                          )}
                        </span>
                      </div>
                    </div>
                    {isGraded && (
                      <div className="shrink-0 text-xs font-bold px-2 py-1 bg-accent rounded-md ml-2">
                        {review.score}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Right Column: Details */}
        <div className="w-full lg:w-2/3 flex flex-col border border-border rounded-xl bg-background shadow-sm overflow-hidden">
          {selectedReview ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  {isGroupEval ? <Users className="size-5 text-muted-foreground" /> : <User className="size-5 text-muted-foreground" />}
                  {getEntityName(selectedReview.studentId)}
                </h2>
                {selectedReview.score !== null && (
                  <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md">
                    Calificado
                  </span>
                )}
              </div>
              
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-8">
                  {/* Submission Info */}
                  <section className="space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2 border-b border-border pb-2">
                      <FileIcon className="size-4" /> Archivos enviados
                    </h3>
                    {selectedReview.submission ? (
                      <div className="p-4 rounded-lg border border-border bg-accent/20 flex items-start gap-4">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {selectedReview.submission.isLink ? <LinkIcon className="size-5 text-primary" /> : <FileIcon className="size-5 text-primary" />}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          {selectedReview.submission.isLink ? (
                            <a href={selectedReview.submission.name} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline truncate">
                              {selectedReview.submission.name}
                            </a>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium truncate">{selectedReview.submission.name}</span>
                              <Button variant="ghost" size="icon" className="size-6 text-muted-foreground hover:text-primary shrink-0">
                                <Download className="size-3.5" />
                              </Button>
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="size-3" /> Entregado el {format(new Date(selectedReview.submission.submittedAt), "PPp", { locale: es })}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center border border-dashed border-border rounded-lg bg-muted/10">
                        <p className="text-sm text-muted-foreground">No hay entrega registrada.</p>
                      </div>
                    )}
                  </section>

                  {/* Grading Form */}
                  <section className="space-y-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2 border-b border-border pb-2">
                      <CheckCircle2 className="size-4" /> Calificación
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Nota asignada (Máx: {item.score.max})</Label>
                        <div className="relative">
                          <Input 
                            type="number" 
                            min={0} 
                            max={item.score.max} 
                            step={0.5} 
                            value={localScore} 
                            onChange={(e) => setLocalScore(e.target.value)} 
                            className="pl-4 pr-10 text-lg font-bold"
                            placeholder="0.0"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">pts</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label className="flex items-center gap-2">
                        <MessageSquare className="size-4 text-muted-foreground" /> Comentarios para el estudiante
                      </Label>
                      <Textarea 
                        rows={5} 
                        value={localFeedback} 
                        onChange={(e) => setLocalFeedback(e.target.value)}
                        placeholder="Escribe comentarios o retroalimentación sobre la entrega..."
                        className="resize-none"
                      />
                    </div>
                  </section>
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-border bg-muted/10 flex justify-end gap-3 shrink-0">
                <Button type="button" variant="outline" onClick={() => {
                  setLocalScore(selectedReview.score?.toString() ?? '')
                  setLocalFeedback(selectedReview.feedback ?? '')
                }}>
                  Descartar cambios
                </Button>
                <Button type="button" className="flex items-center gap-2 bg-primary hover:bg-primary/90 cursor-pointer" onClick={handleSaveReview}>
                  <Save className="size-4" /> Guardar evaluación
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
              <Users className="size-12 mb-4 opacity-20" />
              <p>Selecciona un estudiante o grupo de la lista para evaluar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
