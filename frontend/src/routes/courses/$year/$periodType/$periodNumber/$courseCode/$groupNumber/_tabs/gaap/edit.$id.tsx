import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { EvaluationEditor } from '../../../course-page/-gaap-editor'
import { evaluations } from '../../../course-page/-gaap-data'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/_tabs/gaap/edit/$id',
)({
  component: GaapEdit,
})

function GaapEdit() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { year, periodType, periodNumber, courseCode, groupNumber } = useParams({ strict: false }) as any
  const gaapBasePath = `/courses/${year}/${periodType}/${periodNumber}/${courseCode}/${groupNumber}/gaap`

  const selectedEval = evaluations.find(e => e.id === id)

  if (!selectedEval) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        Evaluación no encontrada
      </div>
    )
  }

  return (
    <EvaluationEditor 
      initialData={selectedEval}
      onSave={() => navigate({ to: gaapBasePath })}
      onCancel={() => navigate({ to: gaapBasePath })}
    />
  )
}
