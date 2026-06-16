import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, User, Users, FileIcon, Link as LinkIcon, CheckCircle2, Circle, MessageSquare, Save, Download, Clock, History as HistoryIcon, Paperclip, UploadCloud, X, Search, RotateCcw, Send } from 'lucide-react'
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

export type ReviewWithMembers = TeacherSubmissionReview & { members?: any[] }

// Generate mock reviews if none exist
function generateMockReviews(item: any, students: any[]): ReviewWithMembers[] {
  if (item.studentReviews && item.studentReviews.length > 0) {
    return item.studentReviews
  }
  
  if (item.peoplePerGroup > 1) {
    // Generate groups dynamically based on enrolledStudents
    const groupSize = item.peoplePerGroup;
    const numGroups = Math.ceil(students.length / groupSize);
    
    return Array.from({ length: numGroups }).map((_, idx) => {
      const name = `Grupo ${idx + 1}`
      const groupMembers = students.slice(idx * groupSize, (idx + 1) * groupSize)
      
      const submitted = idx % 2 === 0
      const submission: SubmissionEntry | null = submitted ? {
        name: `entrega-${name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        submittedAt: new Date(Date.now() - Math.random() * 100000000).toISOString(),
        isLink: false
      } : null

      return {
        studentId: name, // Using group name as ID for groups
        members: groupMembers,
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

// Number Input Helper
function NumberInputControl({ 
  value, 
  onChange, 
  min = 0, 
  max = 100,
  step = 1 
}: { 
  value: number | ''; 
  onChange: (val: number | '') => void; 
  min?: number; 
  max?: number;
  step?: number 
}) {
  return (
    <div className="relative inline-flex h-9 w-full min-w-0 items-center overflow-hidden rounded-lg border border-input bg-transparent dark:bg-input/30 shadow-sm focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 transition-colors">
      <input 
        type="number" 
        value={value} 
        onChange={(e) => {
          if (e.target.value === '') {
            onChange('');
            return;
          }
          const val = parseFloat(e.target.value)
          if (!isNaN(val)) onChange(val)
        }} 
        onBlur={(e) => {
          if (e.target.value === '') return;
          let val = parseFloat(e.target.value)
          if (isNaN(val) || val < min) val = min
          if (max !== undefined && val > max) val = max
          onChange(val)
        }}
        min={min} 
        max={max}
        step={step}
        className="w-full h-full grow px-3 py-1 text-center tabular-nums outline-none border-0 shadow-none rounded-none bg-transparent text-sm focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]" 
      />
      <div className="flex h-full items-center">
        <button
          type="button"
          onClick={() => {
            const current = value === '' ? 0 : value
            const newVal = current - step
            if (newVal >= min) onChange(Number(newVal.toFixed(2)))
          }}
          className="flex aspect-square h-full items-center justify-center border-l border-input text-muted-foreground hover:bg-muted hover:text-foreground outline-none focus-visible:bg-muted transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
          <span className="sr-only">Decrement</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const current = value === '' ? 0 : value
            const newVal = current + step
            if (max === undefined || newVal <= max) onChange(Number(newVal.toFixed(2)))
          }}
          className="flex aspect-square h-full items-center justify-center border-l border-input text-muted-foreground hover:bg-muted hover:text-foreground outline-none focus-visible:bg-muted transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          <span className="sr-only">Increment</span>
        </button>
      </div>
    </div>
  )
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

  const [reviews, setReviews] = useState<ReviewWithMembers[]>(() => generateMockReviews(item, enrolledStudents))
  const [selectedId, setSelectedId] = useState<string | null>(reviews[0]?.studentId || null)

  const selectedReview = reviews.find(r => r.studentId === selectedId)

  // Local state for the selected review to allow editing before saving
  const [localScore, setLocalScore] = useState<number | ''>(() => {
    if (selectedReview?.score !== null && selectedReview?.score !== undefined) {
      return Number(((selectedReview.score / item.score.max) * 100).toFixed(2))
    }
    return ''
  })
  const [localFeedback, setLocalFeedback] = useState<string>(selectedReview?.feedback ?? '')
  const [localFeedbackFiles, setLocalFeedbackFiles] = useState<File[]>(selectedReview?.feedbackFiles ?? [])

  useEffect(() => {
    if (selectedReview?.score !== null && selectedReview?.score !== undefined) {
      setLocalScore(Number(((selectedReview.score / item.score.max) * 100).toFixed(2)))
    } else {
      setLocalScore('')
    }
    setLocalFeedback(selectedReview?.feedback ?? '')
    setLocalFeedbackFiles(selectedReview?.feedbackFiles ?? [])
  }, [selectedId, selectedReview, item])

  const handleSaveReview = () => {
    if (!selectedId) return

    if (localScore !== '' && (isNaN(localScore) || localScore < 0 || localScore > 100)) {
      toast.error(`La nota debe estar entre 0 y 100`)
      return
    }

    const actualScore = localScore !== '' ? Number(((localScore / 100) * item.score.max).toFixed(2)) : null

    const newReviews = reviews.map(r => {
      if (r.studentId === selectedId) {
        return {
          ...r,
          score: actualScore,
          feedback: localFeedback,
          feedbackFiles: localFeedbackFiles
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

  const [searchQuery, setSearchQuery] = useState('')
  const filteredReviews = reviews.filter(r => {
    if (!searchQuery) return true
    const name = getEntityName(r.studentId).toLowerCase()
    return name.includes(searchQuery.toLowerCase())
  })

  // Check if there are changes
  const originalScore = selectedReview?.score !== null && selectedReview?.score !== undefined 
    ? Number(((selectedReview.score / item.score.max) * 100).toFixed(2)) 
    : '';
  const originalFeedback = selectedReview?.feedback ?? '';
  const originalFiles = selectedReview?.feedbackFiles ?? [];
  const filesChanged = localFeedbackFiles.length !== originalFiles.length || 
    localFeedbackFiles.some((f, i) => f.name !== originalFiles[i]?.name || f.size !== originalFiles[i]?.size);
    
  const hasChanges = localScore !== originalScore || localFeedback !== originalFeedback || filesChanged;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable] w-full px-4 py-8 sm:px-6 md:px-8">
      {/* Header Navigation & Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{item.name}</h1>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground pl-12">
            <p>Valor: <span className="font-semibold">{item.score.max}%</span></p>
            <span className="text-border">•</span>
            <p>Modalidad: <span className="font-semibold">{isGroupEval ? 'Grupal' : 'Individual'}</span></p>
          </div>
        </div>

        <div className="pl-12 sm:pl-0">
          <Button 
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm"
            onClick={() => toast.success('Notas publicadas exitosamente. Los estudiantes ya pueden ver sus resultados.')}
          >
            <Send className="size-4" /> Publicar notas
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Left Column: List */}
        <div className="w-full lg:w-1/3 flex flex-col border border-border rounded-xl bg-background shadow-sm overflow-hidden shrink-0 max-h-[600px]">
          <div className="p-4 border-b border-border bg-background z-10 space-y-3">
            <h2 className="font-semibold text-sm">Entregas ({reviews.filter(r => r.submission).length}/{reviews.length})</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={isGroupEval ? "Buscar grupo..." : "Buscar estudiante..."}
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-muted/5 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 relative min-h-0">
            <ScrollArea className="absolute inset-0">
              <div className="p-2 space-y-1">
              {filteredReviews.map(review => {
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
        </div>

        {/* Right Column: Details */}
        <div className="w-full lg:w-2/3 flex flex-col border border-border rounded-xl bg-background shadow-sm overflow-hidden">
          {selectedReview ? (
            <div className="flex flex-col">
              <div className="p-4 border-b border-border bg-background flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    {isGroupEval ? <Users className="size-5 text-muted-foreground" /> : <User className="size-5 text-muted-foreground" />}
                    {getEntityName(selectedReview.studentId)}
                  </h2>
                  {isGroupEval && selectedReview.members && (
                    <p className="text-sm text-muted-foreground font-medium">
                      {selectedReview.members.map((m: any) => m.name).join(', ')}
                    </p>
                  )}
                </div>
                {selectedReview.score !== null && (
                  <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md">
                    Calificado
                  </span>
                )}
              </div>
              
              <div className="flex flex-col gap-6 p-4">
                {/* Submission Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">
                    Archivos enviados
                  </h3>
                  {selectedReview.submission ? (
                    <div className="p-4 h-20 rounded-lg border border-border bg-accent/20 flex items-center gap-4">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {selectedReview.submission.isLink ? <LinkIcon className="size-5 text-primary" /> : <FileIcon className="size-5 text-primary" />}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 justify-center">
                        <div className="flex items-center justify-between gap-4 min-h-7">
                          {selectedReview.submission.isLink ? (
                            <a href={selectedReview.submission.name} target="_blank" rel="noreferrer" className="text-sm font-medium text-foreground hover:underline hover:decoration-primary underline-offset-4 truncate">
                              {selectedReview.submission.name}
                            </a>
                          ) : (
                            <span className="text-sm font-medium truncate">{selectedReview.submission.name}</span>
                          )}
                          <div className="flex items-center gap-1 shrink-0">
                            {!selectedReview.submission.isLink && (
                              <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-primary" title="Descargar archivo">
                                <Download className="size-4" />
                              </Button>
                            )}
                            {selectedReview.submissionHistory?.length > 1 && (
                              <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-primary" title="Ver historial">
                                <HistoryIcon className="size-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="size-3" /> Entregado el {format(new Date(selectedReview.submission.submittedAt), "PPp", { locale: es })}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 h-20 text-center border border-dashed border-border rounded-lg bg-muted/10 flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">No hay entrega registrada.</p>
                    </div>
                  )}
                </div>

                {/* Grading Form */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Nota asignada (Escala 0 a 100)</Label>
                  <div className="flex flex-col gap-2">
                    <div className="w-40 shrink-0">
                      <NumberInputControl 
                        value={localScore} 
                        onChange={setLocalScore} 
                        min={0} 
                        max={100} 
                        step={0.5} 
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <span className={cn(localScore !== '' ? "text-foreground" : "text-muted-foreground")}>
                        {localScore !== '' ? ((localScore / 100) * item.score.max).toFixed(2) : '0.00'}
                      </span> 
                      / {item.score.max} pts
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Comentarios para el estudiante
                  </Label>
                  <Textarea 
                    rows={5} 
                    value={localFeedback} 
                    onChange={(e) => setLocalFeedback(e.target.value)}
                    placeholder="Escribe comentarios o retroalimentación sobre la entrega..."
                    className="resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Archivos de retroalimentación
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 bg-muted/5 text-center flex flex-col items-center justify-center gap-2 hover:bg-muted/10 transition-colors cursor-pointer relative"
                       onClick={() => document.getElementById('feedback-file-upload')?.click()}>
                    <UploadCloud className="size-8 text-muted-foreground/50" />
                    <div className="text-sm">
                      <span className="font-semibold text-primary hover:underline">Haz clic para subir</span> o arrastra y suelta
                    </div>
                    <p className="text-xs text-muted-foreground">PDF, Word, imágenes, etc.</p>
                    <input 
                      id="feedback-file-upload" 
                      type="file" 
                      multiple 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files) {
                          setLocalFeedbackFiles(prev => [...prev, ...Array.from(e.target.files!)])
                        }
                        e.target.value = ''
                      }}
                    />
                  </div>
                  
                  {localFeedbackFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {localFeedbackFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-md border border-border bg-background text-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileIcon className="size-4 text-primary shrink-0" />
                            <span className="truncate font-medium">{f.name}</span>
                            <span className="text-muted-foreground text-xs shrink-0">({(f.size / 1024).toFixed(0)} KB)</span>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="size-6 text-muted-foreground hover:text-red-500 shrink-0" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setLocalFeedbackFiles(prev => prev.filter((_, idx) => idx !== i))
                            }}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 border-t border-border bg-background flex justify-end gap-3 shrink-0">
                <Button type="button" variant="outline" className="flex items-center gap-2" disabled={!hasChanges} onClick={() => {
                  setLocalScore(originalScore)
                  setLocalFeedback(originalFeedback)
                  setLocalFeedbackFiles(originalFiles)
                }}>
                  <RotateCcw className="size-4" /> Descartar cambios
                </Button>
                <Button type="button" disabled={!hasChanges} className="flex items-center gap-2 bg-primary hover:bg-primary/90 cursor-pointer" onClick={handleSaveReview}>
                  <Save className="size-4" /> Guardar cambios
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
