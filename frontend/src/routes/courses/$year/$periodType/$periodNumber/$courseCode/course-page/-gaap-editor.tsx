import { useState } from 'react'
import {
  CalendarIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
  GripVerticalIcon,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
import { evaluationGroups } from './-data'
import { questionTypes } from './-gaap-data'

export function EvaluationEditor({ initialData, onSave, onCancel }: { initialData?: any, onSave: (d: any) => void, onCancel: () => void }) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [dueDate, setDueDate] = useState<Date | undefined>(initialData?.dueDate ? new Date(initialData.dueDate) : undefined)
  const [attempts, setAttempts] = useState(initialData?.attempts ? parseInt(initialData.attempts) : 1)
  const [timeLimit, setTimeLimit] = useState(initialData?.timeLimit ? (initialData.timeLimit === 'Sin límite' ? 0 : parseInt(initialData.timeLimit)) : 0)
  const [category, setCategory] = useState('')
  const [maxQuestions, setMaxQuestions] = useState(10)
  const [allowBack, setAllowBack] = useState(true)

  const [sections, setSections] = useState<any[]>(initialData?.sections || [])

  function NumberInputControl({ 
    value, 
    onChange, 
    min = 0, 
    step = 1,
    className
  }: { 
    value: number; 
    onChange: (val: number) => void; 
    min?: number; 
    step?: number;
    className?: string;
  }) {
    return (
      <div className={cn("relative inline-flex h-9 min-w-[100px] items-center overflow-hidden rounded-lg border border-input bg-transparent dark:bg-input/30 shadow-sm focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 transition-colors", className)}>
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
          className="w-full h-full grow px-2 py-1 text-center tabular-nums outline-none border-0 shadow-none rounded-none bg-transparent text-sm focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]" 
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
          </button>
          <button
            type="button"
            onClick={() => onChange(Number((value + step).toFixed(2)))}
            className="flex aspect-square h-full items-center justify-center border-l border-input text-muted-foreground hover:bg-muted hover:text-foreground outline-none focus-visible:bg-muted transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </button>
        </div>
      </div>
    )
  }

  function handleDateSelect(date: Date | undefined) {
    if (!date) return
    const currentDate = dueDate || new Date()
    const newDate = new Date(date)
    newDate.setHours(dueDate ? currentDate.getHours() : 23)
    newDate.setMinutes(dueDate ? currentDate.getMinutes() : 55)
    setDueDate(newDate)
  }

  function handleTimeChange(type: 'hour' | 'minute', value: string) {
    const currentDate = dueDate || new Date()
    const newDate = new Date(currentDate)

    if (type === 'hour') {
      const hour = parseInt(value, 10)
      newDate.setHours(hour)
    } else if (type === 'minute') {
      const minute = parseInt(value, 10)
      newDate.setMinutes(minute)
    }
    setDueDate(newDate)
  }

  const renderQuestionConfigurator = (q: any, sIdx: number, qIdx: number) => {
    const updateQ = (updates: any) => {
       const ns = [...sections]
       ns[sIdx].questions[qIdx] = { ...ns[sIdx].questions[qIdx], ...updates }
       setSections(ns)
    }
    const qData = q.config || {}
    
    switch (q.type) {
      case 'single':
      case 'multiple':
        const opts = qData.options || [{id: '1', text: 'Opción 1', isCorrect: false}]
        return (
          <div className="space-y-3 w-full">
            <Label>Opciones de respuesta</Label>
            {opts.map((o: any, oIdx: number) => (
              <div key={o.id} className="flex items-center gap-3">
                <Checkbox 
                  checked={o.isCorrect} 
                  onCheckedChange={c => {
                    const no = [...opts]
                    if (q.type === 'single' && c) {
                      no.forEach(x => x.isCorrect = false)
                    }
                    no[oIdx].isCorrect = !!c
                    updateQ({ config: { ...qData, options: no }})
                  }} 
                />
                <Input value={o.text} onChange={e => {
                  const no = [...opts]
                  no[oIdx].text = e.target.value
                  updateQ({ config: { ...qData, options: no }})
                }} className="flex-1 h-8 text-sm" placeholder="Escriba la opción..." />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                   const no = opts.filter((_: any, i: number) => i !== oIdx)
                   updateQ({ config: { ...qData, options: no }})
                }}><TrashIcon className="size-4" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => {
               updateQ({ config: { ...qData, options: [...opts, {id: Date.now().toString(), text: '', isCorrect: false}] } })
            }}><PlusIcon className="size-4 mr-2" /> Agregar opción</Button>
          </div>
        )
      case 'short_answer':
        const answers = qData.answers || ['']
        return (
          <div className="space-y-3 w-full">
             <Label>Respuestas correctas aceptadas</Label>
             {answers.map((a: string, aIdx: number) => (
                <div key={aIdx} className="flex items-center gap-2">
                   <Input value={a} onChange={e => {
                      const na = [...answers]; na[aIdx] = e.target.value;
                      updateQ({ config: { ...qData, answers: na }})
                   }} className="flex-1 h-8 text-sm" placeholder="Respuesta..." />
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                      const na = answers.filter((_: any, i: number) => i !== aIdx)
                      updateQ({ config: { ...qData, answers: na }})
                   }}><TrashIcon className="size-4" /></Button>
                </div>
             ))}
             <Button variant="outline" size="sm" onClick={() => {
                updateQ({ config: { ...qData, answers: [...answers, ''] }})
             }}><PlusIcon className="size-4 mr-2" /> Agregar variante</Button>
          </div>
        )
      case 'numeric':
        return (
          <div className="grid grid-cols-2 gap-4 w-full">
             <div className="space-y-2">
               <Label>Valor exacto esperado</Label>
               <Input type="number" value={qData.exact || ''} onChange={e => updateQ({ config: { ...qData, exact: e.target.value }})} placeholder="Ej. 9.81" className="h-8 text-sm" />
             </div>
             <div className="space-y-2">
               <Label>Margen de error (±)</Label>
               <Input type="number" value={qData.tolerance || ''} onChange={e => updateQ({ config: { ...qData, tolerance: e.target.value }})} placeholder="Ej. 0.05" className="h-8 text-sm" />
             </div>
          </div>
        )
      case 'essay':
        return (
          <div className="w-full text-sm text-muted-foreground p-4 bg-muted/50 rounded-md border border-border text-center">
             El estudiante responderá con un texto libre. No requiere configuración adicional.
          </div>
        )
      case 'matching':
        const pairs = qData.pairs || [{id: '1', left: '', right: ''}]
        return (
          <div className="space-y-3 w-full">
            <Label>Pares a emparejar</Label>
            {pairs.map((p: any, pIdx: number) => (
               <div key={p.id} className="flex items-center gap-3">
                  <Input value={p.left} onChange={e => {
                     const np = [...pairs]; np[pIdx].left = e.target.value; updateQ({ config: { ...qData, pairs: np }})
                  }} placeholder="Concepto..." className="flex-1 h-8 text-sm" />
                  <span className="text-muted-foreground">↔</span>
                  <Input value={p.right} onChange={e => {
                     const np = [...pairs]; np[pIdx].right = e.target.value; updateQ({ config: { ...qData, pairs: np }})
                  }} placeholder="Definición..." className="flex-1 h-8 text-sm" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                     const np = pairs.filter((_: any, i: number) => i !== pIdx)
                     updateQ({ config: { ...qData, pairs: np }})
                  }}><TrashIcon className="size-4" /></Button>
               </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => {
               updateQ({ config: { ...qData, pairs: [...pairs, {id: Date.now().toString(), left: '', right: ''}] } })
            }}><PlusIcon className="size-4 mr-2" /> Agregar par</Button>
          </div>
        )
      case 'ordering':
        const items = qData.items || [{id: '1', text: ''}]
        return (
          <div className="space-y-3 w-full">
            <Label>Elementos en el orden correcto</Label>
            {items.map((it: any, iIdx: number) => (
               <div key={it.id} className="flex items-center gap-3">
                  <div className="w-6 text-center text-xs font-semibold text-muted-foreground">{iIdx + 1}.</div>
                  <Input value={it.text} onChange={e => {
                     const ni = [...items]; ni[iIdx].text = e.target.value; updateQ({ config: { ...qData, items: ni }})
                  }} placeholder="Elemento..." className="flex-1 h-8 text-sm" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                     const ni = items.filter((_: any, i: number) => i !== iIdx)
                     updateQ({ config: { ...qData, items: ni }})
                  }}><TrashIcon className="size-4" /></Button>
               </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => {
               updateQ({ config: { ...qData, items: [...items, {id: Date.now().toString(), text: ''}] } })
            }}><PlusIcon className="size-4 mr-2" /> Agregar elemento</Button>
          </div>
        )
      case 'code':
        return (
          <div className="space-y-4 w-full">
             <div className="space-y-2">
                <Label>Lenguaje esperado</Label>
                <Select value={qData.language || 'python'} onValueChange={v => updateQ({ config: {...qData, language: v} })}>
                  <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue/></SelectTrigger>
                  <SelectContent>
                     <SelectItem value="python">Python</SelectItem>
                     <SelectItem value="javascript">JavaScript</SelectItem>
                     <SelectItem value="java">Java</SelectItem>
                     <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label>Código inicial (Plantilla)</Label>
                <Textarea value={qData.initialCode || ''} onChange={e => updateQ({ config: {...qData, initialCode: e.target.value}})} className="font-mono text-xs min-h-[100px]" placeholder="def solution():\n  pass" />
             </div>
          </div>
        )
      case 'hotspot':
        return (
          <div className="space-y-4 w-full flex flex-col items-center">
             <Button variant="outline" className="w-full h-24 border-dashed bg-muted/30 hover:bg-muted/50 text-muted-foreground"><PlusIcon className="size-6 mr-2" /> Subir imagen base</Button>
             <p className="text-xs text-muted-foreground text-center">Luego de subir la imagen podrás dibujar las zonas correctas haciendo clic sobre ella.</p>
          </div>
        )
      default:
        return null
    }
  }

  const addSection = () => {
    setSections([...sections, { id: Date.now().toString(), title: 'Nueva Sección', description: '', questions: [] }])
  }

  const addQuestion = (sectionIndex: number) => {
    const newSections = [...sections]
    newSections[sectionIndex].questions.push({
      id: Date.now().toString(),
      type: 'single',
      text: 'Nueva pregunta',
      value: 1,
    })
    setSections(newSections)
  }

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {initialData ? 'Editar evaluación' : 'Crear nueva evaluación GAAP'}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={() => onSave({})}>Guardar cambios</Button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Configuración general</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Título de la evaluación</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej. Examen final" />
          </div>
          <div className="space-y-2">
            <Label>Categoría en el módulo de evaluaciones</Label>
            <Combobox 
              items={evaluationGroups.map(g => g.title)}
              value={category}
              onValueChange={(val: any) => setCategory(Array.isArray(val) ? val[0] || '' : val || '')}
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
            <Label>Fecha y hora de entrega</Label>
            <div className="w-full">
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal h-9", !dueDate && "text-muted-foreground")}
                    />
                  }
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP HH:mm", { locale: es }) : <span>Seleccionar fecha y hora</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <div className="flex flex-col min-[430px]:flex-row">
                  <Calendar
                    mode="single"
                    selected={dueDate}
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
                              variant={dueDate && dueDate.getHours() === hour ? "default" : "ghost"}
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
                              variant={dueDate && dueDate.getMinutes() === minute ? "default" : "ghost"}
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
            <div className="flex items-center gap-2">
              <Label>Límite de intentos</Label>
              <span className="text-muted-foreground text-xs font-normal">(0 significa ilimitado)</span>
            </div>
            <div className="w-full sm:w-32">
              <NumberInputControl value={attempts} onChange={setAttempts} min={0} className="w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Límite de tiempo</Label>
              <span className="text-muted-foreground text-xs font-normal">(0 significa sin límite)</span>
            </div>
            <div className="w-full sm:w-32">
              <NumberInputControl value={timeLimit} onChange={setTimeLimit} min={0} step={5} className="w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Máximo de preguntas por página</Label>
            <div className="w-full sm:w-32">
              <NumberInputControl value={maxQuestions} onChange={setMaxQuestions} min={1} className="w-full" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-muted/20">
          <Switch checked={allowBack} onCheckedChange={setAllowBack} id="allow-back" />
          <div className="space-y-0.5">
            <Label htmlFor="allow-back" className="font-medium text-base">Permitir retroceder entre preguntas</Label>
            <p className="text-sm text-muted-foreground">Si se desactiva, los estudiantes no podrán volver a preguntas anteriores.</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Secciones y preguntas</h2>
          <Button onClick={addSection} size="sm" variant="secondary">
            <PlusIcon className="size-4 mr-2" /> Añadir sección
          </Button>
        </div>

        {sections.map((section, sIdx) => (
          <Card key={section.id} className="p-4 bg-muted/10 border-border shadow-none">
            <div className="flex gap-4">
              <div className="cursor-move pt-2 text-muted-foreground">
                <GripVerticalIcon className="size-5" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-2">
                    <Label>Título de la sección</Label>
                    <Input value={section.title} onChange={e => { const ns = [...sections]; ns[sIdx].title = e.target.value; setSections(ns); }} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Instrucciones</Label>
                    <Input value={section.description} onChange={e => { const ns = [...sections]; ns[sIdx].description = e.target.value; setSections(ns); }} placeholder="Opcional" />
                  </div>
                  <Button variant="ghost" size="icon" className="mt-8 text-destructive hover:bg-destructive/10" onClick={() => { const ns = [...sections]; ns.splice(sIdx, 1); setSections(ns); }}>
                    <TrashIcon className="size-4" />
                  </Button>
                </div>

                <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                  {section.questions?.map((q: any, qIdx: number) => (
                    <div key={q.id} className="p-4 bg-background border border-border rounded-md space-y-4">
                      <div className="flex justify-between items-center gap-4">
                         <div className="font-semibold text-sm">Pregunta {qIdx + 1}</div>
                         <div className="flex items-center gap-2">
                           <Label>Tipo:</Label>
                           <Combobox 
                             items={questionTypes}
                             value={questionTypes.find(t => t.value === q.type) || null}
                             onValueChange={(val: any) => { 
                               const ns=[...sections]; 
                               if (val) {
                                 ns[sIdx].questions[qIdx].type = Array.isArray(val) ? val[0]?.value : val.value; 
                               }
                               setSections(ns); 
                             }}
                             itemToString={(item: any) => item ? item.label : ''}
                           >
                             <ComboboxTrigger render={<Button variant="outline" className="w-[180px] h-8 text-xs justify-between font-normal px-3"><ComboboxValue /></Button>} />
                             <ComboboxContent>
                               <ComboboxInput showTrigger={false} placeholder="Buscar..." />
                               <ComboboxEmpty>No se encontraron tipos.</ComboboxEmpty>
                               <ComboboxList>
                                 {(item: any) => (
                                   <ComboboxItem key={item.value} value={item}>
                                     {item.label}
                                   </ComboboxItem>
                                 )}
                               </ComboboxList>
                             </ComboboxContent>
                           </Combobox>
                           <Label className="ml-2">Pts:</Label>
                           <NumberInputControl className="h-8 w-24 text-xs" value={q.value} onChange={v => { const ns=[...sections]; ns[sIdx].questions[qIdx].value = v; setSections(ns); }} min={1} />
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => { const ns=[...sections]; ns[sIdx].questions.splice(qIdx, 1); setSections(ns); }}>
                             <TrashIcon className="size-4" />
                           </Button>
                         </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Enunciado de la pregunta</Label>
                        <Textarea value={q.text} onChange={e => { const ns=[...sections]; ns[sIdx].questions[qIdx].text = e.target.value; setSections(ns); }} placeholder="Escriba la pregunta aquí..." className="min-h-[80px]" />
                      </div>
                      <div className="bg-muted/10 p-5 rounded-md border border-border flex items-start w-full">
                        {renderQuestionConfigurator(q, sIdx, qIdx)}
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={() => addQuestion(sIdx)} size="sm" variant="outline" className="w-full border-dashed">
                    <PlusIcon className="size-4 mr-2" /> Añadir pregunta a la sección
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
