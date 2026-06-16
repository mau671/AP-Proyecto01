import { useState, useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { ChevronDownIcon, ChevronUpIcon, DownloadIcon, HistoryIcon, UserIcon, MoreVertical, Pencil, Trash, Plus, Settings, CalendarIcon, Users, GripVertical, Check } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { getDemoUser } from '@/lib/demo-auth'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ResponsiveDialog } from '@/components/responsive-dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

import { evaluationGroups as initialGroups, type EvaluationItem, enrolledStudents, type TeacherSubmissionReview, updateEvaluationGroups } from './-data'
import { formatDate, formatScore, formatTime, roundToNearestFive } from './-utils'

export function EvaluationsTab() {
  const user = getDemoUser()
  const isTeacher = user?.role === 'teacher'
  const detailLabelClass = 'text-xs font-semibold'

  const navigate = useNavigate()
  const params = useParams({ strict: false }) as any

  const [groups, setGroups] = useState(initialGroups)

  useEffect(() => {
    setGroups(initialGroups)
  }, [])

  const [historyState, setHistoryState] = useState<{
    evaluationName: string
    entries: { name: string; submittedAt: string; isLink: boolean }[]
  } | null>(null)
  const [rubricOpen, setRubricOpen] = useState(false)

  // Dialog States
  const [catDialog, setCatDialog] = useState<{ open: boolean }>({ open: false })

  // Handlers for Evaluations
  const openAddEval = () => {
    navigate({
      to: '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/evaluations/new',
      params: {
        year: params.year,
        periodType: params.periodType,
        periodNumber: params.periodNumber,
        courseCode: params.courseCode,
        groupNumber: params.groupNumber,
      }
    })
  }

  const openEditEval = (groupIndex: number, itemIndex: number) => {
    navigate({
      to: '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/evaluations/edit',
      params: {
        year: params.year,
        periodType: params.periodType,
        periodNumber: params.periodNumber,
        courseCode: params.courseCode,
        groupNumber: params.groupNumber,
      },
      search: {
        groupIndex,
        itemIndex,
      }
    })
  }

  const handleDeleteEval = (gIndex: number, iIndex: number) => {
    if (!confirm('¿Estás seguro de eliminar esta evaluación?')) return
    const newGroups = [...groups]
    newGroups[gIndex].items = newGroups[gIndex].items.filter((_, idx) => idx !== iIndex)
    setGroups(newGroups)
    updateEvaluationGroups(newGroups)
  }

  // Handlers for Categories
  const handleSaveCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const weight = Number(formData.get('weight'))
    
    if (title && !isNaN(weight)) {
      const newGroups = [...groups, { title, weight, items: [] }]
      setGroups(newGroups)
      updateEvaluationGroups(newGroups)
      ;(e.target as HTMLFormElement).reset()
    }
  }

  const handleDeleteCategory = (idx: number) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría y todas sus evaluaciones?')) return
    const newGroups = groups.filter((_, i) => i !== idx)
    setGroups(newGroups)
    updateEvaluationGroups(newGroups)
    if (editingIndex === idx) setEditingIndex(null)
  }

  const handleWeightChange = (idx: number, newWeight: number) => {
    const newGroups = [...groups]
    newGroups[idx].weight = newWeight
    setGroups(newGroups)
    updateEvaluationGroups(newGroups)
  }

  // Categories drag and edit states
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleTitleChange = (idx: number, newTitle: string) => {
    const newGroups = [...groups]
    newGroups[idx].title = newTitle
    setGroups(newGroups)
    updateEvaluationGroups(newGroups)
  }

  const handleAddEmptyCategory = () => {
    const newGroups = [...groups, { title: '', weight: 0, items: [] }]
    setGroups(newGroups)
    updateEvaluationGroups(newGroups)
    setEditingIndex(newGroups.length - 1)
  }

  const handleDragStart = (idx: number) => {
    setDraggedIndex(idx)
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === idx) return
    const newGroups = [...groups]
    const draggedItem = newGroups[draggedIndex]
    newGroups.splice(draggedIndex, 1)
    newGroups.splice(idx, 0, draggedItem)
    setDraggedIndex(idx)
    setGroups(newGroups)
    updateEvaluationGroups(newGroups)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  // Number Input Helper for Categories
  function NumberInputControl({ 
    value, 
    onChange, 
    min = 0, 
    step = 1,
    disabled = false
  }: { 
    value: number; 
    onChange: (val: number) => void; 
    min?: number; 
    step?: number;
    disabled?: boolean
  }) {
    return (
      <div className={cn(
        "relative inline-flex h-8 w-full min-w-0 items-center overflow-hidden rounded-lg border border-input bg-transparent dark:bg-input/30 shadow-sm transition-colors",
        !disabled && "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        disabled && "opacity-60 bg-muted cursor-not-allowed"
      )}>
        <input 
          type="number" 
          value={value} 
          disabled={disabled}
          onChange={(e) => {
            const val = parseFloat(e.target.value)
            if (!isNaN(val)) onChange(val)
          }} 
          onBlur={(e) => {
            let val = parseFloat(e.target.value)
            if (isNaN(val) || val < min) val = min
            onChange(val)
          }}
          min={min} 
          step={step}
          className="w-full h-full grow px-2 py-1 text-center tabular-nums outline-none border-0 shadow-none rounded-none bg-transparent text-xs focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield] disabled:cursor-not-allowed" 
        />
        <div className="flex h-full items-center">
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              const newVal = value - step
              if (newVal >= min) onChange(Number(newVal.toFixed(2)))
            }}
            className="flex aspect-square h-full items-center justify-center border-l border-input text-muted-foreground hover:bg-muted hover:text-foreground outline-none focus-visible:bg-muted transition-colors cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
            <span className="sr-only">Decrement</span>
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(Number((value + step).toFixed(2)))}
            className="flex aspect-square h-full items-center justify-center border-l border-input text-muted-foreground hover:bg-muted hover:text-foreground outline-none focus-visible:bg-muted transition-colors cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            <span className="sr-only">Increment</span>
          </button>
        </div>
      </div>
    )
  }

  const rubricRows = [
    { category: 'Vocabulary', weight: '20%', levels: ['Not done', 'Inadequate', 'Needs improvement', 'Meets expectations', 'Exceeds expectations'] },
    { category: 'Grammar', weight: '20%', levels: ['Not done', 'Inadequate', 'Needs improvement', 'Meets expectations', 'Exceeds expectations'] },
  ]

  const totalWithoutRounding = groups.reduce((groupAcc, group) => groupAcc + group.items.reduce((itemAcc, item) => itemAcc + item.score.earned, 0), 0)
  const finalRounded = roundToNearestFive(totalWithoutRounding)
  const courseMax = groups.reduce((groupAcc, group) => groupAcc + group.items.reduce((itemAcc, item) => itemAcc + item.score.max, 0), 0)

  return (
    <>
      <div className="mx-auto w-full max-w-3xl space-y-5 p-6">
        {/* Header - Student vs Teacher */}
        {!isTeacher ? (
          <div className="flex items-center justify-between gap-3 px-2 py-1">
            <div className="flex min-w-0 items-center gap-3 sm:gap-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"><UserIcon className="size-6" /></span>
              <span className="truncate text-2xl font-normal sm:text-3xl">Nombre</span>
            </div>
            <span className="shrink-0 text-right text-2xl font-semibold text-muted-foreground sm:text-3xl">{String(finalRounded).padStart(2, '0')} / 100</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-2 py-1">
            <div className="flex min-w-0 items-center gap-3">
              <span className="truncate text-2xl font-normal">Evaluaciones</span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={() => setCatDialog({ open: true })} className="flex-1 sm:flex-none">
                <Settings className="mr-1 size-4" />
                <span className="hidden sm:inline">Administrar categorías</span>
                <span className="sm:hidden">Categorías</span>
              </Button>
              <Button size="sm" onClick={openAddEval} className="flex-1 sm:flex-none">
                <Plus className="mr-1 size-4" />
                <span className="hidden sm:inline">Agregar evaluación</span>
                <span className="sm:hidden">Agregar</span>
              </Button>
            </div>
          </div>
        )}

        {/* Groups & Items */}
        <div className="space-y-2">
          {groups.map((group, groupIndex) => (
            <Collapsible key={group.title} className="px-2 py-1" defaultOpen>
              <div className="flex items-center gap-3">
                <CollapsibleTrigger className="flex flex-1 cursor-pointer items-end gap-3 rounded-sm">
                  <span className="text-base font-medium leading-none">{group.title}</span>
                  <span className="mb-[2px] h-px flex-1 bg-border" />
                  {!isTeacher ? (
                    <span className="text-base leading-none text-muted-foreground">{formatScore(group.items.reduce((acc, item) => acc + item.score.earned, 0), 1)} / {group.weight}%</span>
                  ) : (
                    <span className="text-base leading-none text-muted-foreground">{group.weight}%</span>
                  )}
                </CollapsibleTrigger>
                <CollapsibleTrigger className="group grid size-7 cursor-pointer place-items-center rounded-full border border-border text-base leading-none">
                  <span className="group-data-[panel-open]:hidden">+</span>
                  <span className="hidden group-data-[panel-open]:block">-</span>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="pt-3">
                <div className="overflow-hidden rounded-lg border border-border">
                  {group.items.length === 0 && <div className="p-4 text-center text-sm text-muted-foreground">No hay evaluaciones</div>}
                  {group.items.map((item, index) => (
                    <div key={item.name}>
                      <Collapsible>
                        <div className="flex items-center group w-full pr-4 hover:bg-accent/40">
                          <CollapsibleTrigger className="flex flex-1 cursor-pointer items-center justify-between pl-4 py-3 text-left">
                            <p className="text-sm font-medium">{item.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {!isTeacher ? (
                                <span>{formatScore(item.score.earned, 2)} / {formatScore(item.score.max, 2)}</span>
                              ) : (
                                <span>{formatScore(item.score.max, 2)}</span>
                              )}
                              <ChevronDownIcon className="size-4 group-data-[panel-open]:hidden" />
                              <ChevronUpIcon className="hidden size-4 group-data-[panel-open]:block" />
                            </div>
                          </CollapsibleTrigger>
                          {isTeacher && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 ml-2">
                                  <MoreVertical className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className="whitespace-nowrap" onClick={() => navigate({
                                  to: '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/evaluations/review',
                                  params: {
                                    year: params.year,
                                    periodType: params.periodType,
                                    periodNumber: params.periodNumber,
                                    courseCode: params.courseCode,
                                    groupNumber: params.groupNumber,
                                  },
                                  search: {
                                    groupIndex,
                                    itemIndex: index,
                                  }
                                })}>
                                  <Users className="mr-2 size-4 shrink-0" /> Revisar entregas
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditEval(groupIndex, index)}>
                                  <Pencil className="mr-2 size-4" /> Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteEval(groupIndex, index)}>
                                  <Trash className="mr-2 size-4" /> Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        <CollapsibleContent>
                          <div className={cn("grid gap-0 border-t border-border", !isTeacher ? "md:grid-cols-2" : "")}>
                            {/* Detalles de la asignación */}
                            <div className={cn("p-3", !isTeacher ? "md:border-r md:border-border" : "")}>
                              <p className="mb-2 bg-muted px-2 py-1 text-sm font-semibold">Detalles de la asignación</p>
                              <div className="pl-2">
                                <p className={detailLabelClass}>Descripción:</p><p className="mb-3 text-sm text-muted-foreground">{item.description}</p>
                                <p className={detailLabelClass}>Valor máximo:</p><p className="mb-3 text-sm text-muted-foreground">{formatScore(item.score.max, 2)} pts</p>
                                
                                {item.rubric && (
                                  <div className="mb-3">
                                    <p className={detailLabelClass}>Rúbrica:</p>
                                    <button type="button" className="cursor-pointer text-sm text-primary underline underline-offset-2" onClick={() => setRubricOpen(true)}>
                                      Ver rúbrica
                                    </button>
                                  </div>
                                )}
                                
                                <p className={detailLabelClass}>Fecha de entrega:</p><p className="mb-3 text-sm text-muted-foreground">{item.dueDate || 'Sin fecha'}</p>
                                
                                <p className={detailLabelClass}>Entregas tardías:</p>
                                <p className="mb-3 text-sm text-muted-foreground">{item.allowLate ? 'Sí se permiten' : 'No se permiten'}</p>
                                
                                <p className={detailLabelClass}>Personas por grupo:</p><p className="text-sm text-muted-foreground">{item.peoplePerGroup}</p>
                              </div>
                            </div>
                            
                            {/* Mis entregas (Solo Estudiante) */}
                            {!isTeacher && (
                              <div className="px-3 pb-3 pt-1 md:p-3">
                                <p className="mb-2 bg-muted px-2 py-1 text-sm font-semibold">Mis entregas</p>
                                <div className="pl-2">
                                  {item.dueDate ? (
                                    <>
                                      <p className={detailLabelClass}>Entrega:</p>
                                      <div className="mb-3 ml-px border-l-4 border-blue-500 pl-3">
                                        {item.submission ? (
                                          <>
                                            <div className="mb-1.5 flex items-start gap-3">
                                              <p className="min-w-0 flex-1 break-all text-sm text-muted-foreground">{item.submission.name}</p>
                                              <div className="flex shrink-0 items-center gap-1.5">
                                                <button type="button" className="cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground" onClick={() => setHistoryState({ evaluationName: item.name, entries: item.submissionHistory })} aria-label={`Ver historial de ${item.name}`}><HistoryIcon className="size-4" /></button>
                                                {!item.submission.isLink ? <button type="button" className="cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label={`Descargar ${item.submission.name}`}><DownloadIcon className="size-4" /></button> : null}
                                              </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Entregado el: {formatDate(item.submission.submittedAt)} {formatTime(item.submission.submittedAt)}</p>
                                          </>
                                        ) : <p className="text-sm text-muted-foreground">No hay entregas registradas.</p>}
                                      </div>
                                    </>
                                  ) : null}
                                  
                                  <p className={detailLabelClass}>Nota obtenida:</p><p className="mb-1 text-sm text-muted-foreground">{formatScore(item.score.earned, 2)} / {formatScore(item.score.max, 2)}</p>
                                  
                                  {item.feedbackFiles?.length ? (
                                    <div className="mb-2">
                                      <p className={detailLabelClass}>Archivos de retroalimentación:</p>
                                      <div className="space-y-1 pt-1">
                                        {item.feedbackFiles.map((file) => (
                                          <div key={file.name} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <p className="min-w-0 flex-1 truncate">{file.name}</p>
                                            <button type="button" className="shrink-0 cursor-pointer rounded-md p-1 hover:bg-accent hover:text-foreground"><DownloadIcon className="size-4" /></button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                      {index < group.items.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* Totals Footer (Solo Estudiante) */}
        {!isTeacher && (
          <div className="px-2 pt-2">
            <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Nota total (sin redondear)</p><p className="font-mono text-sm text-muted-foreground">{totalWithoutRounding.toFixed(1)} / {courseMax}</p></div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between"><p className="text-base font-semibold">Nota final</p><p className="font-mono text-2xl font-bold">{String(finalRounded).padStart(2, '0')} / 100</p></div>
          </div>
        )}
      </div>

      {/* MODALS */}

      {/* Administrar Categorías Dialog */}
      <ResponsiveDialog
        open={catDialog.open}
        onOpenChange={(o) => {
          setCatDialog({ open: o })
          if (!o) setEditingIndex(null)
        }}
        title="Administrar categorías"
        description="Agrega o modifica los grupos de evaluación y su peso."
      >
        <div className="space-y-4">
          <div className="flex items-center justify-end">
            <Button 
              size="sm" 
              onClick={handleAddEmptyCategory}
              className="h-8 gap-1 cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Agregar</span>
            </Button>
          </div>

          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {groups.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No hay categorías registradas.
              </div>
            )}
            {groups.map((g, idx) => {
              const isEditing = editingIndex === idx
              return (
                <div 
                  key={idx}
                  draggable={editingIndex === null}
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border border-transparent transition-all",
                    draggedIndex === idx && "opacity-40 border-dashed border-primary bg-accent/20",
                    isEditing && "border-border bg-accent/10",
                    editingIndex === null && "hover:bg-accent/40"
                  )}
                >
                  <Input 
                    value={g.title} 
                    onChange={(e) => handleTitleChange(idx, e.target.value)}
                    disabled={!isEditing} 
                    className="flex-1 h-8 text-sm" 
                    placeholder="Nombre de categoría"
                  />

                  <div className="w-24 shrink-0">
                    <NumberInputControl 
                      value={g.weight} 
                      onChange={(v) => handleWeightChange(idx, v)}
                      disabled={!isEditing}
                      min={0}
                      step={1}
                    />
                  </div>

                  <div className="flex items-center gap-0 shrink-0">
                    <div className="flex size-8 items-center justify-center text-xs text-muted-foreground select-none">
                      %
                    </div>

                    {isEditing ? (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20 shrink-0 cursor-pointer"
                        onClick={() => setEditingIndex(null)}
                        title="Confirmar"
                      >
                        <Check className="size-4" />
                      </Button>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 shrink-0 cursor-pointer"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingIndex(idx)} className="cursor-pointer">
                            <Pencil className="mr-2 size-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive cursor-pointer" 
                            onClick={() => handleDeleteCategory(idx)}
                          >
                            <Trash className="mr-2 size-4" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    <div 
                      title="Arrastra para reordenar"
                      className={cn(
                        "flex size-8 items-center justify-center text-muted-foreground/60 shrink-0 select-none",
                        editingIndex === null ? "cursor-grab active:cursor-grabbing hover:text-foreground" : "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <GripVertical className="size-4" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-end font-semibold text-sm text-muted-foreground pt-2">
            Total: {groups.reduce((acc, g) => acc + g.weight, 0)}%
          </div>
        </div>
      </ResponsiveDialog>

      {/* El diálogo de agregar/editar evaluación ahora se maneja en páginas separadas */}

      {/* Student History Dialog */}
      <Dialog open={historyState !== null} onOpenChange={(open) => !open && setHistoryState(null)}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-3xl gap-0 p-0 sm:max-w-3xl" showCloseButton>
          <DialogHeader className="gap-1 border-b border-border px-4 py-3"><DialogTitle>Historial de archivos subidos</DialogTitle><DialogDescription>{historyState?.evaluationName ?? ''}</DialogDescription></DialogHeader>
          <div className="max-h-80 overflow-y-auto px-4 pb-4">
            <div className="grid grid-cols-[minmax(0,1fr)_150px_28px] items-center gap-1 border-b border-border py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><span>Nombre del archivo</span><span className="text-right">Fecha de entrega</span><span aria-hidden="true" /></div>
            {(historyState?.entries ?? []).map((entry) => (
              <div key={`${entry.name}-${entry.submittedAt}`} className="grid grid-cols-[minmax(0,1fr)_150px_28px] items-center gap-1 border-b border-border/60 py-2 text-sm">
                <p className="min-w-0 truncate text-muted-foreground">{entry.name}</p>
                <p className="text-right font-mono text-xs text-muted-foreground">{formatDate(entry.submittedAt)} {formatTime(entry.submittedAt)}</p>
                {!entry.isLink ? <button type="button" className="cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label={`Descargar ${entry.name}`}><DownloadIcon className="size-4" /></button> : <span aria-hidden="true" />}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Rubric Dialog */}
      <Dialog open={rubricOpen} onOpenChange={setRubricOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-6xl gap-0 p-0 sm:max-w-6xl" showCloseButton>
          <DialogHeader className="gap-1 border-b border-border px-4 py-3"><DialogTitle>Evaluación por rúbrica</DialogTitle></DialogHeader>
          <div className="max-h-[70vh] overflow-auto p-3">
            <table className="w-full min-w-[980px] border-collapse text-xs">
              <thead><tr><th className="border border-border bg-muted px-2 py-1 text-left font-semibold">Categorías de Evaluación</th><th className="border border-border bg-muted px-2 py-1 text-left font-semibold">Not done (0)</th><th className="border border-border bg-muted px-2 py-1 text-left font-semibold">Inadequate (1)</th><th className="border border-border bg-muted px-2 py-1 text-left font-semibold">Needs improvement (2)</th><th className="border border-border bg-muted px-2 py-1 text-left font-semibold">Meets expectations (3)</th><th className="border border-border bg-muted px-2 py-1 text-left font-semibold">Exceeds expectations (4)</th></tr></thead>
              <tbody>
                {rubricRows.map((row) => (
                  <tr key={row.category}>
                    <td className="border border-border px-2 py-1 align-top"><p className="font-semibold">{row.category}</p><p className="text-muted-foreground">Peso {row.weight}</p></td>
                    {row.levels.map((level) => <td key={`${row.category}-${level}`} className="border border-border px-2 py-1 align-top text-muted-foreground">{level}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
