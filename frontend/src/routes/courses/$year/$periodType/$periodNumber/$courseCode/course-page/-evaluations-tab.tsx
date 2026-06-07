import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, DownloadIcon, HistoryIcon, UserIcon } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { evaluationGroups } from './-data'
import { formatDate, formatScore, formatTime, roundToNearestFive } from './-utils'

export function EvaluationsTab() {
  const detailLabelClass = 'text-xs font-semibold'
  const [historyState, setHistoryState] = useState<{
    evaluationName: string
    entries: { name: string; submittedAt: string; isLink: boolean }[]
  } | null>(null)
  const [rubricOpen, setRubricOpen] = useState(false)

  const rubricRows = [
    {
      category: 'Vocabulary',
      weight: '20%',
      levels: ['Not done', 'Very limited vocabulary, many inappropriate word choices.', 'Limited range of vocabulary and some inappropriate choices.', 'Use of appropriate vocabulary with few errors.', 'Use of wide range of appropriate vocabulary.'],
    },
    {
      category: 'Grammar',
      weight: '20%',
      levels: ['Not done', 'Many errors in grammar, difficult to understand.', 'Frequent errors but still understandable.', 'Generally accurate with only a few errors.', 'Accurate use of grammar with no errors.'],
    },
    {
      category: 'Pronunciation / Intonation',
      weight: '20%',
      levels: ['Not done', 'Significant difficulties with pronunciation and intonation.', 'Frequent mispronunciations or stress/intonation errors.', 'Occasional mispronunciations or stress errors.', 'Clear, accurate pronunciation, stress and intonation.'],
    },
    {
      category: 'Content',
      weight: '20%',
      levels: ['Not done', 'Does not address the topic or information is inaccurate.', 'Addresses the topic with limited or inaccurate information.', 'Addresses the topic with mostly relevant information.', 'Addresses the topic with relevant information.'],
    },
    {
      category: 'Delivery',
      weight: '20%',
      levels: ['Not done', 'Very unclear or hesitant, with significant pauses.', 'Somewhat unclear or hesitant, with frequent pauses.', 'Mostly clear and confident but with some hesitation.', 'Clear and confident delivery, appropriate pacing.'],
    },
  ]

  const totalWithoutRounding = evaluationGroups.reduce((groupAcc, group) => groupAcc + group.items.reduce((itemAcc, item) => itemAcc + item.score.earned, 0), 0)
  const finalRounded = roundToNearestFive(totalWithoutRounding)
  const courseMax = evaluationGroups.reduce((groupAcc, group) => groupAcc + group.items.reduce((itemAcc, item) => itemAcc + item.score.max, 0), 0)

  return (
    <>
      <div className="mx-auto w-full max-w-3xl space-y-5 p-6">
        <div className="flex items-center justify-between gap-3 px-2 py-1">
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"><UserIcon className="size-6" /></span>
            <span className="truncate text-2xl font-normal sm:text-3xl">Nombre</span>
          </div>
          <span className="shrink-0 text-right text-2xl font-semibold text-muted-foreground sm:text-3xl">{String(finalRounded).padStart(2, '0')} / 100</span>
        </div>

        <div className="space-y-2">
          {evaluationGroups.map((group, groupIndex) => (
            <Collapsible key={group.title} className="px-2 py-1">
              <div className="flex items-center gap-3">
                <CollapsibleTrigger className="flex flex-1 cursor-pointer items-end gap-3 rounded-sm">
                  <span className="text-base font-medium leading-none">{group.title}</span>
                  <span className="mb-[2px] h-px flex-1 bg-border" />
                  <span className="text-base leading-none text-muted-foreground">{formatScore(group.items.reduce((acc, item) => acc + item.score.earned, 0), 1)} / {group.weight}</span>
                </CollapsibleTrigger>
                <CollapsibleTrigger className="group grid size-7 cursor-pointer place-items-center rounded-full border border-border text-base leading-none">
                  <span className="group-data-[panel-open]:hidden">+</span>
                  <span className="hidden group-data-[panel-open]:block">-</span>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="pt-3">
                <div className="overflow-hidden rounded-lg border border-border">
                  {group.items.map((item, index) => (
                    <div key={item.name}>
                      <Collapsible>
                        <CollapsibleTrigger className="group flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left hover:bg-accent/40">
                          <p className="text-sm font-medium">{item.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{formatScore(item.score.earned, 2)} / {formatScore(item.score.max, 2)}</span>
                            <ChevronDownIcon className="size-4 group-data-[panel-open]:hidden" />
                            <ChevronUpIcon className="hidden size-4 group-data-[panel-open]:block" />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="grid gap-0 border-t border-border md:grid-cols-2">
                            <div className="p-3 md:border-r md:border-border">
                              <p className="mb-2 bg-muted px-2 py-1 text-sm font-semibold">Detalles de la asignación</p>
                              <div className="pl-2">
                                <p className={detailLabelClass}>Descripción:</p><p className="mb-3 text-sm text-muted-foreground">{item.description}</p>
                                <p className={detailLabelClass}>Valor de la asignación:</p><p className="mb-3 text-sm text-muted-foreground">{formatScore(item.score.max, 2)}</p>
                                <p className={detailLabelClass}>Rúbrica:</p>
                                <RadioGroup value={item.rubric ? 'si' : 'no'} className="mb-3 flex w-fit items-center gap-2 text-sm text-muted-foreground" disabled>
                                  <Field orientation="horizontal" className="w-auto gap-1" data-disabled><RadioGroupItem value="si" id={`rubric-si-${groupIndex}-${index}`} disabled /><FieldLabel htmlFor={`rubric-si-${groupIndex}-${index}`} className="flex-none font-normal">Sí</FieldLabel></Field>
                                  <Field orientation="horizontal" className="w-auto gap-1" data-disabled><RadioGroupItem value="no" id={`rubric-no-${groupIndex}-${index}`} disabled /><FieldLabel htmlFor={`rubric-no-${groupIndex}-${index}`} className="flex-none font-normal">No</FieldLabel></Field>
                                </RadioGroup>
                                <p className={detailLabelClass}>Fecha de entrega:</p><p className="mb-3 text-sm text-muted-foreground">{item.dueDate}</p>
                                <p className={detailLabelClass}>Posibilidad de entregar después de la fecha límite:</p>
                                <RadioGroup value={item.allowLate ? 'si' : 'no'} className="mb-3 flex w-fit items-center gap-2 text-sm text-muted-foreground" disabled>
                                  <Field orientation="horizontal" className="w-auto gap-1" data-disabled><RadioGroupItem value="si" id={`late-si-${groupIndex}-${index}`} disabled /><FieldLabel htmlFor={`late-si-${groupIndex}-${index}`} className="flex-none font-normal">Sí</FieldLabel></Field>
                                  <Field orientation="horizontal" className="w-auto gap-1" data-disabled><RadioGroupItem value="no" id={`late-no-${groupIndex}-${index}`} disabled /><FieldLabel htmlFor={`late-no-${groupIndex}-${index}`} className="flex-none font-normal">No</FieldLabel></Field>
                                </RadioGroup>
                                <p className={detailLabelClass}>Cantidad de personas por grupo:</p><p className="text-sm text-muted-foreground">{item.peoplePerGroup}</p>
                                {item.peoplePerGroup > 1 && item.members?.length ? <><p className={`mt-3 ${detailLabelClass}`}>Miembros del grupo:</p><div className="text-sm text-muted-foreground">{item.members.map((member) => <p key={member}>{member}</p>)}</div></> : null}
                              </div>
                            </div>
                            <div className="px-3 pb-3 pt-1 md:p-3">
                              <p className="mb-2 bg-muted px-2 py-1 text-sm font-semibold">Mis entregas</p>
                              <div className="pl-2">
                                {item.dueDate ? <><p className={detailLabelClass}>Entrega:</p><div className="mb-3 ml-px border-l-4 border-blue-500 pl-3">{item.submission ? <><div className="mb-1.5 flex items-start justify-between gap-3"><p className="min-w-0 truncate text-sm text-muted-foreground">{item.submission.name}</p><div className="flex items-center gap-1.5"><button type="button" className="cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground" onClick={() => setHistoryState({ evaluationName: item.name, entries: item.submissionHistory })} aria-label={`Ver historial de ${item.name}`}><HistoryIcon className="size-4" /></button>{!item.submission.isLink ? <button type="button" className="cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label={`Descargar ${item.submission.name}`}><DownloadIcon className="size-4" /></button> : null}</div></div><p className="text-xs text-muted-foreground">Día de entrega: {formatDate(item.submission.submittedAt)}</p><p className="text-xs text-muted-foreground">Hora de entrega: {formatTime(item.submission.submittedAt)}</p></> : <p className="text-sm text-muted-foreground">No hay entregas de archivo o enlace.</p>}</div></> : null}
                                <p className={detailLabelClass}>Nota obtenida:</p><p className="mb-1 text-sm text-muted-foreground">{formatScore(item.score.earned, 2)} / {formatScore(item.score.max, 2)}</p>
                                {item.feedbackFiles?.length ? <div className="mb-2"><p className={detailLabelClass}>Archivos de retroalimentación:</p><div className="space-y-1 pt-1">{item.feedbackFiles.map((file) => <div key={file.name} className="flex items-center justify-between gap-2 text-sm text-muted-foreground"><p className="min-w-0 truncate">{file.name}</p><button type="button" className="shrink-0 cursor-pointer rounded-md p-1 hover:bg-accent hover:text-foreground" aria-label={`Descargar ${file.name}`}><DownloadIcon className="size-4" /></button></div>)}</div></div> : null}
                                {item.rubric ? <button type="button" className="mb-2 cursor-pointer text-sm text-primary underline underline-offset-2" onClick={() => setRubricOpen(true)}>Ver rúbrica</button> : null}
                                {item.dueDate ? <><p className={detailLabelClass}>Comentarios:</p><p className="text-sm text-muted-foreground">Sin comentarios</p></> : null}
                              </div>
                            </div>
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

        <div className="px-2 pt-2">
          <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Nota total (sin redondear)</p><p className="font-mono text-sm text-muted-foreground">{totalWithoutRounding.toFixed(1)} / {courseMax}</p></div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between"><p className="text-base font-semibold">Nota final</p><p className="font-mono text-2xl font-bold">{String(finalRounded).padStart(2, '0')} / 100</p></div>
        </div>
      </div>

      <Dialog open={historyState !== null} onOpenChange={(open) => !open && setHistoryState(null)}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-3xl gap-0 p-0 sm:max-w-3xl" showCloseButton>
          <DialogHeader className="gap-1 border-b border-border px-4 py-3"><DialogTitle>Historial de archivos subidos</DialogTitle><DialogDescription>{historyState?.evaluationName ?? ''}</DialogDescription></DialogHeader>
          <div className="max-h-80 overflow-y-auto px-4 pb-4">
            <div className="grid grid-cols-[minmax(0,1fr)_150px_28px] items-center gap-1 border-b border-border py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><span>Nombre del archivo</span><span className="text-right">Fecha de entrega</span><span aria-hidden="true" /></div>
            {(historyState?.entries ?? []).map((entry) => (
              <div key={`${entry.name}-${entry.submittedAt}`} className="grid grid-cols-[minmax(0,1fr)_150px_28px] items-center gap-1 border-b border-border/60 py-2 text-sm">
                <p className="truncate text-muted-foreground">{entry.name}</p>
                <p className="text-right font-mono text-xs text-muted-foreground">{formatDate(entry.submittedAt)} {formatTime(entry.submittedAt)}</p>
                {!entry.isLink ? <button type="button" className="cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label={`Descargar ${entry.name}`}><DownloadIcon className="size-4" /></button> : <span aria-hidden="true" />}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={rubricOpen} onOpenChange={setRubricOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-6xl gap-0 p-0 sm:max-w-6xl" showCloseButton>
          <DialogHeader className="gap-1 border-b border-border px-4 py-3"><DialogTitle>Evaluación por rúbrica</DialogTitle><DialogDescription>Rubric oral presentation of a project - Puntuación: 0.0</DialogDescription></DialogHeader>
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
