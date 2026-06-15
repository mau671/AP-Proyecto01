import { useState, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, CalendarIcon, Upload, File as FileIcon, X, Sparkles, Plus, Trash, Pencil, ChevronUp, ChevronDown, User, Shuffle, Check, ChevronRight, Users, GripVertical } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

import { evaluationGroups, updateEvaluationGroups, type EvaluationItem } from '../../course-page/-data'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/evaluations/new',
)({
  component: AddEvaluationPage,
})

function AddEvaluationPage() {
  const navigate = Route.useNavigate()
  
  // Form States
  const [evalDate, setEvalDate] = useState<Date | undefined>()
  const [hasRubric, setHasRubric] = useState(false)
  const [allowLate, setAllowLate] = useState(false)
  const [peoplePerGroup, setPeoplePerGroup] = useState(1)
  const [evalScore, setEvalScore] = useState(10)
  const [catComboVal, setCatComboVal] = useState<string>(evaluationGroups[0]?.title || '')

  // Group Creator interface
  interface Group {
    id: string
    name: string
    students: string[]
  }

  // Student lists (excluding Alicia Marcela Salazar Hernández and Juan Pérez Gómez)
  const [unassignedStudents, setUnassignedStudents] = useState<string[]>([
    'Carlos Vindas Mora', 'María Fernanda Rojas', 'Jorge Pérez Sánchez', 'Ana Laura Gómez',
    'David Rodríguez Vega', 'Estudiante Demo', 'Andrés Chaves Quesada', 'Beatriz Solano Murillo',
    'Camila Herrera Vargas', 'Daniel Monge Alfaro', 'Elena Delgado Castro', 'Felipe Mora Jiménez',
    'Gabriela Brenes Solís', 'Hernán Ruiz Salazar', 'Irene Castillo Camacho', 'Javier Quirós Segura',
    'Karen Leitón Blanco', 'Luis Fernando Araya', 'Mónica Granados Navarro', 'Néstor Cordero Fonseca',
    'Olga Miranda Gutiérrez', 'Pablo Villalobos Céspedes', 'Rebeca Marín Soto', 'Santiago Aguilar Mata'
  ])
  const [groups, setGroups] = useState<Group[]>([])
  const [newGroupName, setNewGroupName] = useState('')
  const [studentSearchQuery, setStudentSearchQuery] = useState('')
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)
  const [editingGroupName, setEditingGroupName] = useState('')

  const [isDragOverUnassigned, setIsDragOverUnassigned] = useState(false)
  const [draggedOverGroupId, setDraggedOverGroupId] = useState<string | null>(null)

  const handleMoveStudentGroup = (studentName: string, fromGroupId: string, toGroupId: string) => {
    const targetGroup = groups.find(g => g.id === toGroupId)
    if (!targetGroup) return
    if (targetGroup.students.length >= peoplePerGroup) {
      toast.error(`El grupo ya ha alcanzado el límite de ${peoplePerGroup} integrantes`)
      return
    }

    setGroups(prev => prev.map(g => {
      if (g.id === fromGroupId) {
        return { ...g, students: g.students.filter(s => s !== studentName) }
      }
      if (g.id === toGroupId) {
        return { ...g, students: [...g.students, studentName] }
      }
      return g
    }))
  }

  const filteredStudents = unassignedStudents.filter(student =>
    student.toLowerCase().includes(studentSearchQuery.toLowerCase())
  )

  const handleAddGroup = () => {
    const name = newGroupName.trim()
    if (!name) {
      toast.error('El nombre del grupo no puede estar vacío')
      return
    }
    
    if (groups.some(g => g.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Ya existe un grupo con ese nombre')
      return
    }

    const newGroup: Group = {
      id: `group-${Date.now()}-${Math.random()}`,
      name,
      students: []
    }

    setGroups(prev => [...prev, newGroup])
    setNewGroupName('')
    toast.success(`Grupo "${name}" creado`)
  }

  const handleGenerateGroupName = () => {
    const nextNum = groups.length + 1
    const formattedNum = String(nextNum).padStart(2, '0')
    setNewGroupName(`Grupo ${formattedNum}`)
  }

  const handleSaveGroupName = (id: string) => {
    const name = editingGroupName.trim()
    if (!name) {
      toast.error('El nombre del grupo no puede estar vacío')
      return
    }

    if (groups.some(g => g.id !== id && g.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Ya existe un grupo con ese nombre')
      return
    }

    setGroups(prev => prev.map(g => g.id === id ? { ...g, name } : g))
    setEditingGroupId(null)
    toast.success('Nombre de grupo actualizado')
  }

  const handleDeleteGroup = (id: string) => {
    const group = groups.find(g => g.id === id)
    if (group) {
      setUnassignedStudents(prev => [...prev, ...group.students].sort())
    }
    setGroups(prev => prev.filter(g => g.id !== id))
    toast.success('Grupo eliminado')
  }

  const handleMoveGroup = (index: number, direction: 'up' | 'down') => {
    const newGroups = [...groups]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= groups.length) return
    
    const temp = newGroups[index]
    newGroups[index] = newGroups[targetIndex]
    newGroups[targetIndex] = temp
    setGroups(newGroups)
  }

  const handleAssignStudent = (studentName: string, groupId: string) => {
    const group = groups.find(g => g.id === groupId)
    if (!group) return
    if (group.students.length >= peoplePerGroup) {
      toast.error(`El grupo ya ha alcanzado el límite de ${peoplePerGroup} integrantes`)
      return
    }

    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, students: [...g.students, studentName] } : g))
    setUnassignedStudents(prev => prev.filter(s => s !== studentName))
  }

  const handleRemoveStudent = (studentName: string, groupId: string) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, students: g.students.filter(s => s !== studentName) } : g))
    setUnassignedStudents(prev => [...prev, studentName].sort())
  }

  const handleRandomizeGroups = () => {
    const allStudents = [
      'Carlos Vindas Mora', 'María Fernanda Rojas', 'Jorge Pérez Sánchez', 'Ana Laura Gómez',
      'David Rodríguez Vega', 'Estudiante Demo', 'Andrés Chaves Quesada', 'Beatriz Solano Murillo',
      'Camila Herrera Vargas', 'Daniel Monge Alfaro', 'Elena Delgado Castro', 'Felipe Mora Jiménez',
      'Gabriela Brenes Solís', 'Hernán Ruiz Salazar', 'Irene Castillo Camacho', 'Javier Quirós Segura',
      'Karen Leitón Blanco', 'Luis Fernando Araya', 'Mónica Granados Navarro', 'Néstor Cordero Fonseca',
      'Olga Miranda Gutiérrez', 'Pablo Villalobos Céspedes', 'Rebeca Marín Soto', 'Santiago Aguilar Mata'
    ]

    const shuffled = [...allStudents].sort(() => Math.random() - 0.5)
    const capacity = peoplePerGroup > 1 ? peoplePerGroup : 2
    const numGroups = Math.ceil(shuffled.length / capacity)

    const newGroups: Group[] = Array.from({ length: numGroups }, (_, idx) => ({
      id: `group-${idx}-${Date.now()}-${Math.random()}`,
      name: `Grupo ${String(idx + 1).padStart(2, '0')}`,
      students: []
    }))

    shuffled.forEach((student, index) => {
      const groupIdx = index % numGroups
      newGroups[groupIdx].students.push(student)
    })

    setGroups(newGroups)
    setUnassignedStudents([])
    toast.success('Grupos generados aleatoriamente')
  }

  // File Upload States
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Date Time Picker Helpers
  function handleDateSelect(date: Date | undefined) {
    if (!date) return
    const currentDate = evalDate || new Date()
    const newDate = new Date(date)
    newDate.setHours(evalDate ? currentDate.getHours() : 23)
    newDate.setMinutes(evalDate ? currentDate.getMinutes() : 55)
    setEvalDate(newDate)
  }

  function handleTimeChange(type: 'hour' | 'minute', value: string) {
    const currentDate = evalDate || new Date()
    const newDate = new Date(currentDate)

    if (type === 'hour') {
      const hour = parseInt(value, 10)
      newDate.setHours(hour)
    } else if (type === 'minute') {
      const minute = parseInt(value, 10)
      newDate.setMinutes(minute)
    }

    setEvalDate(newDate)
  }

  // Number Input Helper
  function NumberInputControl({ 
    value, 
    onChange, 
    min = 0, 
    step = 1 
  }: { 
    value: number; 
    onChange: (val: number) => void; 
    min?: number; 
    step?: number 
  }) {
    return (
      <div className="relative inline-flex h-9 w-full min-w-0 items-center overflow-hidden rounded-lg border border-input bg-transparent dark:bg-input/30 shadow-sm focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 transition-colors">
        <input 
          type="number" 
          value={value} 
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
          className="w-full h-full grow px-3 py-1 text-center tabular-nums outline-none border-0 shadow-none rounded-none bg-transparent text-sm focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]" 
        />
        <div className="flex h-full items-center">
          <button
            type="button"
            onClick={() => {
              const newVal = value - step
              if (newVal >= min) onChange(Number(newVal.toFixed(2)))
            }}
            className="flex aspect-square h-full items-center justify-center border-l border-input text-muted-foreground hover:bg-muted hover:text-foreground outline-none focus-visible:bg-muted transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
            <span className="sr-only">Decrement</span>
          </button>
          <button
            type="button"
            onClick={() => onChange(Number((value + step).toFixed(2)))}
            className="flex aspect-square h-full items-center justify-center border-l border-input text-muted-foreground hover:bg-muted hover:text-foreground outline-none focus-visible:bg-muted transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            <span className="sr-only">Increment</span>
          </button>
        </div>
      </div>
    )
  }

  const handleSaveEval = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const gIndex = evaluationGroups.findIndex(g => g.title === catComboVal)
    if (gIndex === -1) {
      toast.error('La categoría seleccionada no es válida')
      return
    }

    const serializedGroups = groups.map(g => `${g.name}: ${g.students.join(', ')}`)

    const newEval: EvaluationItem = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      dueDate: evalDate ? format(evalDate, 'dd/MM/yyyy HH:mm') : '',
      rubric: hasRubric,
      allowLate: allowLate,
      peoplePerGroup: peoplePerGroup,
      members: peoplePerGroup > 1 ? serializedGroups : undefined,
      score: {
        earned: 0,
        max: evalScore,
      },
      submission: null,
      submissionHistory: []
    }

    const newGroups = [...evaluationGroups]
    newGroups[gIndex].items.push(newEval)
    
    updateEvaluationGroups(newGroups)
    toast.success('Evaluación agregada con éxito')
    
    navigate({
      to: '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber',
      search: { tab: 3 }
    })
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

      {/* Form Container (Explicitly NOT using Card components to fulfill user request) */}
      <form onSubmit={handleSaveEval} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Columna Principal - Detalles (Izquierda) */}
          <div className="space-y-6 lg:col-span-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Categoría</Label>
              <Combobox 
                items={evaluationGroups.map(g => g.title)}
                value={catComboVal}
                onValueChange={(val: any) => setCatComboVal(Array.isArray(val) ? val[0] || '' : val || '')}
              >
                <ComboboxInput placeholder="Selecciona una categoría..." showClear={false} />
                <ComboboxContent>
                  <ComboboxEmpty>No se encontraron categorías.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Nombre de la evaluación</Label>
              <Input id="name" name="name" required placeholder="Ej. Tarea 1: Introducción" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Descripción (Opcional)</Label>
              <Textarea 
                id="description" 
                name="description" 
                rows={5} 
                placeholder="Describe las instrucciones y criterios de la evaluación..."
              />
            </div>

            {/* Drag & Drop File Upload Box */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Archivo de instrucciones o recursos (Opcional)</Label>
              {attachedFile ? (
                <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-muted/30">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <FileIcon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{attachedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(attachedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setAttachedFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <X className="size-4" />
                    <span className="sr-only">Eliminar archivo</span>
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(event) => {
                    event.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault()
                    setIsDragging(false)
                    const file = event.dataTransfer.files[0] ?? null
                    if (file) {
                      if (file.size > 10 * 1024 * 1024) {
                        toast.error('El archivo excede el tamaño máximo permitido (10 MB)')
                        return
                      }
                      setAttachedFile(file)
                    }
                  }}
                  className={cn(
                    'flex min-h-28 w-full cursor-pointer flex-col justify-center rounded-xl border border-dashed px-4 py-5 text-left transition-colors',
                    isDragging ? 'border-foreground bg-accent/40' : 'border-border hover:bg-accent/20',
                  )}
                >
                  <div className="flex flex-col items-center gap-2 text-center w-full">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-foreground">
                      <Upload className="size-4" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground">
                        <span className="text-primary transition-colors hover:underline">Haz clic</span>{' '}
                        para subir un archivo o arrástralo y suéltalo.
                      </p>
                      <p className="text-sm text-muted-foreground">PDF, ZIP, DOCX o XLSX (máx. 10 MB)</p>
                    </div>
                  </div>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.zip,.docx,.xlsx,application/pdf,application/x-zip-compressed,application/zip,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null
                  if (file) {
                    if (file.size > 10 * 1024 * 1024) {
                      toast.error('El archivo excede el tamaño máximo permitido (10 MB)')
                      if (fileInputRef.current) fileInputRef.current.value = ''
                      return
                    }
                    setAttachedFile(file)
                  }
                }}
              />
            </div>
          </div>

          {/* Columna Lateral - Configuración (Derecha) */}
          <div className="space-y-6 lg:col-span-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Fecha y hora de entrega</Label>
                <div className="w-full">
                  <Popover>
                    <PopoverTrigger className="w-full" asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal h-9", !evalDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {evalDate ? format(evalDate, "PPP HH:mm", { locale: es }) : <span>Seleccionar fecha y hora</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="flex flex-col min-[430px]:flex-row">
                        <Calendar
                          mode="single"
                          selected={evalDate}
                          onSelect={handleDateSelect}
                          initialFocus
                          locale={es}
                        />
                        <div className="flex w-full min-[430px]:w-auto h-auto min-[430px]:h-[280px] divide-x divide-border border-t min-[430px]:border-t-0 min-[430px]:border-l border-border bg-popover">
                          {/* Horas */}
                          <div className="flex flex-col w-2/3 min-[430px]:w-[68px] h-full min-h-0">
                            <div className="text-[10px] font-bold text-muted-foreground text-center uppercase tracking-wider py-2 border-b border-border bg-muted/10 shrink-0">
                              Hora
                            </div>
                            <ScrollArea className="h-auto min-[430px]:h-full min-[430px]:flex-1 min-h-0">
                              <div className="grid grid-cols-4 gap-1 p-2.5 min-[430px]:flex min-[430px]:flex-col">
                                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                                  <Button
                                    key={hour}
                                    type="button"
                                    variant={evalDate && evalDate.getHours() === hour ? "default" : "ghost"}
                                    className="w-full h-8 text-xs shrink-0 rounded-md p-0"
                                    onClick={() => handleTimeChange("hour", hour.toString())}
                                  >
                                    {hour.toString().padStart(2, "0")}
                                  </Button>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                          {/* Minutos */}
                          <div className="flex flex-col w-1/3 min-[430px]:w-[68px] h-full min-h-0">
                            <div className="text-[10px] font-bold text-muted-foreground text-center uppercase tracking-wider py-2 border-b border-border bg-muted/10 shrink-0">
                              Min
                            </div>
                            <ScrollArea className="h-auto min-[430px]:h-full min-[430px]:flex-1 min-h-0">
                              <div className="grid grid-cols-2 gap-1 p-2.5 min-[430px]:flex min-[430px]:flex-col">
                                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                                  <Button
                                    key={minute}
                                    type="button"
                                    variant={evalDate && evalDate.getMinutes() === minute ? "default" : "ghost"}
                                    className="w-full h-8 text-xs shrink-0 rounded-md p-0"
                                    onClick={() => handleTimeChange("minute", minute.toString())}
                                  >
                                    {minute.toString().padStart(2, "0")}
                                  </Button>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Puntaje máximo</Label>
                <NumberInputControl value={evalScore} onChange={setEvalScore} min={0} step={0.5} />
              </div>
            </div>

            {/* Configurations Box */}
            <div className="space-y-4 rounded-xl border border-border p-5 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Permitir entregas tardías</Label>
                  <p className="text-xs text-muted-foreground">Los estudiantes podrán subir archivos después de la fecha límite.</p>
                </div>
                <Switch checked={allowLate} onCheckedChange={setAllowLate} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Evaluación con Rúbrica</Label>
                  <p className="text-xs text-muted-foreground">Define criterios y puntajes específicos por nivel de desempeño.</p>
                </div>
                <Switch checked={hasRubric} onCheckedChange={setHasRubric} />
              </div>
              {hasRubric && (
                <div className="text-xs text-muted-foreground bg-background/50 p-3 rounded-lg border border-border mt-2">
                  La rúbrica se definirá en el paso siguiente una vez guardada la evaluación (Simulación).
                </div>
              )}
            </div>

            {/* Group Mode */}
            <div className="space-y-4 rounded-xl border border-border p-5 bg-muted/20">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Modalidad de grupo</Label>
                  <p className="text-xs text-muted-foreground">Indica la cantidad máxima de integrantes por grupo.</p>
                </div>
                <div className="w-28 shrink-0">
                  <NumberInputControl value={peoplePerGroup} onChange={(v) => {
                    const val = Math.floor(v);
                    setPeoplePerGroup(val);
                    if (val === 1) {
                      setGroups([]);
                      setUnassignedStudents([
                        'Carlos Vindas Mora', 'María Fernanda Rojas', 'Jorge Pérez Sánchez', 'Ana Laura Gómez',
                        'David Rodríguez Vega', 'Estudiante Demo', 'Andrés Chaves Quesada', 'Beatriz Solano Murillo',
                        'Camila Herrera Vargas', 'Daniel Monge Alfaro', 'Elena Delgado Castro', 'Felipe Mora Jiménez',
                        'Gabriela Brenes Solís', 'Hernán Ruiz Salazar', 'Irene Castillo Camacho', 'Javier Quirós Segura',
                        'Karen Leitón Blanco', 'Luis Fernando Araya', 'Mónica Granados Navarro', 'Néstor Cordero Fonseca',
                        'Olga Miranda Gutiérrez', 'Pablo Villalobos Céspedes', 'Rebeca Marín Soto', 'Santiago Aguilar Mata'
                      ]);
                    }
                  }} min={1} step={1} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Creador de grupos */}
        {peoplePerGroup > 1 && (
          <div className="space-y-4 rounded-xl border border-border p-6 bg-muted/10 dark:bg-muted/5 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Grupos</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRandomizeGroups}
                className="flex items-center gap-1.5 h-9 shrink-0 cursor-pointer ml-auto"
              >
                <Shuffle className="size-4 text-primary" />
                <span>Generar aleatoriamente</span>
              </Button>
            </div>

            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Columna Izquierda: Estudiantes (lg:col-span-5) */}
              <div className="lg:col-span-5 space-y-3 flex flex-col">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <span>Estudiantes sin asignar</span>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-primary bg-primary/10 rounded-full">
                      {unassignedStudents.length}
                    </span>
                  </Label>
                </div>

                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar estudiante..."
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    className="h-9 pr-8"
                  />
                  {studentSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setStudentSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>

                <ScrollArea 
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragOverUnassigned(true)
                  }}
                  onDragLeave={() => setIsDragOverUnassigned(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragOverUnassigned(false)
                    const studentName = e.dataTransfer.getData('text/plain')
                    const sourceGroupId = e.dataTransfer.getData('sourceGroupId')
                    if (studentName && sourceGroupId) {
                      handleRemoveStudent(studentName, sourceGroupId)
                    }
                  }}
                  className={cn(
                    "h-[350px] border border-border rounded-lg bg-background/50 transition-colors",
                    isDragOverUnassigned && "border-primary/50 bg-primary/[0.02]"
                  )}
                >
                  <div className="p-3 space-y-2">
                    {filteredStudents.length === 0 ? (
                      <p className="text-xs text-center text-muted-foreground py-8">
                        No hay estudiantes sin asignar que coincidan con la búsqueda.
                      </p>
                    ) : (
                      filteredStudents.map((student) => (
                        <div
                          key={student}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', student)
                            e.dataTransfer.effectAllowed = 'move'
                          }}
                          className="flex items-center justify-between p-2 rounded-lg border border-border bg-background hover:bg-accent/20 cursor-grab active:cursor-grabbing transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <GripVertical className="size-3.5 text-muted-foreground/60 shrink-0" />
                            <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <User className="size-4" />
                            </div>
                            <span className="text-xs font-medium truncate text-foreground">{student}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Columna Derecha: Grupos (lg:col-span-7) */}
              <div className="lg:col-span-7 space-y-3 flex flex-col">
                <Label className="text-sm font-semibold">Grupos creados</Label>
                
                {/* Creador de Nuevo Grupo */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Nombre del nuevo grupo..."
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddGroup()
                        }
                      }}
                      className="h-9 pr-9"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateGroupName}
                      title="Generar nombre automático"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      <Sparkles className="size-4" />
                    </button>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddGroup}
                    className="h-9 px-3 shrink-0 flex items-center gap-1 cursor-pointer bg-primary hover:bg-primary/90"
                  >
                    <Plus className="size-4" />
                    <span className="hidden sm:inline">Nuevo grupo</span>
                    <span className="sm:hidden">Grupo</span>
                  </Button>
                </div>

                {/* Lista de Grupos */}
                <ScrollArea className="h-[350px] border border-border rounded-lg bg-background/50">
                  <div className="p-3 space-y-3">
                    {groups.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <Users className="size-8 text-muted-foreground/40 mb-2" />
                        <p className="text-xs">No se han creado grupos todavía.</p>
                        <p className="text-[10px] mt-1">Ingresa un nombre arriba o haz clic en "Generar aleatoriamente".</p>
                      </div>
                    ) : (
                      groups.map((group, index) => {
                        const isEditing = editingGroupId === group.id
                        const isFull = group.students.length >= peoplePerGroup

                        return (
                          <div
                            key={group.id}
                            onDragOver={(e) => {
                              e.preventDefault()
                              if (group.students.length < peoplePerGroup) {
                                setDraggedOverGroupId(group.id)
                              }
                            }}
                            onDragLeave={() => setDraggedOverGroupId(null)}
                            onDrop={(e) => {
                              e.preventDefault()
                              setDraggedOverGroupId(null)
                              const studentName = e.dataTransfer.getData('text/plain')
                              const sourceGroupId = e.dataTransfer.getData('sourceGroupId')
                              
                              if (sourceGroupId === group.id) return

                              if (studentName && sourceGroupId) {
                                handleMoveStudentGroup(studentName, sourceGroupId, group.id)
                              } else if (studentName) {
                                handleAssignStudent(studentName, group.id)
                              }
                            }}
                            className={cn(
                              "rounded-lg border border-border bg-background shadow-sm overflow-hidden transition-all",
                              isFull ? "border-green-500/20 bg-green-500/[0.01]" : "",
                              draggedOverGroupId === group.id && "border-primary/50 bg-primary/[0.03] scale-[1.01]"
                            )}
                          >
                            {/* Header del Grupo */}
                            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/20">
                              <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
                                {isEditing ? (
                                  <div className="flex items-center gap-1 flex-1">
                                    <Input
                                      type="text"
                                      value={editingGroupName}
                                      onChange={(e) => setEditingGroupName(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault()
                                          handleSaveGroupName(group.id)
                                        } else if (e.key === 'Escape') {
                                          setEditingGroupId(null)
                                        }
                                      }}
                                      className="h-7 text-xs px-2 py-0.5 flex-1"
                                      autoFocus
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleSaveGroupName(group.id)}
                                      className="size-7 text-green-600 hover:text-green-700 hover:bg-green-50 shrink-0 cursor-pointer"
                                    >
                                      <Check className="size-3.5" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setEditingGroupId(null)}
                                      className="size-7 text-muted-foreground hover:text-foreground hover:bg-muted shrink-0 cursor-pointer"
                                    >
                                      <X className="size-3.5" />
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <span className="text-xs font-semibold truncate text-foreground">{group.name}</span>
                                    <span className={cn(
                                      "inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full font-mono shrink-0",
                                      isFull ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-950/30" : "text-muted-foreground bg-muted"
                                    )}>
                                      {group.students.length}/{peoplePerGroup}
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Controles de Grupo */}
                              {!isEditing && (
                                <div className="flex items-center gap-0.5 shrink-0">
                                  {/* Botón Subir */}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    disabled={index === 0}
                                    onClick={() => handleMoveGroup(index, 'up')}
                                    className="size-7 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Subir"
                                  >
                                    <ChevronUp className="size-3.5" />
                                  </Button>
                                  {/* Botón Bajar */}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    disabled={index === groups.length - 1}
                                    onClick={() => handleMoveGroup(index, 'down')}
                                    className="size-7 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Bajar"
                                  >
                                    <ChevronDown className="size-3.5" />
                                  </Button>
                                  {/* Botón Editar */}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setEditingGroupId(group.id)
                                      setEditingGroupName(group.name)
                                    }}
                                    className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                                    title="Editar nombre"
                                  >
                                    <Pencil className="size-3.5" />
                                  </Button>
                                  {/* Botón Eliminar */}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteGroup(group.id)}
                                    className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                    title="Eliminar grupo"
                                  >
                                    <Trash className="size-3.5" />
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* Integrantes del Grupo */}
                            <div className="p-2 space-y-1.5 bg-background">
                              {group.students.length === 0 ? (
                                <p className="text-[10px] text-center text-muted-foreground py-3 italic">
                                  Sin integrantes. Arrastra estudiantes aquí.
                                </p>
                              ) : (
                                group.students.map((student) => (
                                  <div
                                    key={student}
                                    draggable
                                    onDragStart={(e) => {
                                      e.dataTransfer.setData('text/plain', student)
                                      e.dataTransfer.setData('sourceGroupId', group.id)
                                      e.dataTransfer.effectAllowed = 'move'
                                    }}
                                    className="flex items-center justify-between p-1.5 rounded bg-muted/30 border border-muted/50 hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors"
                                  >
                                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                      <GripVertical className="size-3 text-muted-foreground/50 shrink-0" />
                                      <span className="text-[11px] font-medium text-foreground truncate pl-0.5">{student}</span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveStudent(student, group.id)}
                                      className="size-5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer"
                                      title="Remover del grupo"
                                    >
                                      <X className="size-3" />
                                    </Button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-end pt-4">
          <Button type="submit" className="w-40 bg-primary hover:bg-primary/90">
            Guardar
          </Button>
        </div>
      </form>
    </div>
  )
}
