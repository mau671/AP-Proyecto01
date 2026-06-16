import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { EvaluationEditor } from '../../../course-page/-gaap-editor'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/_tabs/gaap/new',
)({
  component: GaapNew,
})

function GaapNew() {
  const navigate = useNavigate()
  const { year, periodType, periodNumber, courseCode, groupNumber } = useParams({ strict: false }) as any
  const gaapBasePath = `/courses/${year}/${periodType}/${periodNumber}/${courseCode}/${groupNumber}/gaap`

  return (
    <EvaluationEditor 
      onSave={() => navigate({ to: gaapBasePath })}
      onCancel={() => navigate({ to: gaapBasePath })}
    />
  )
}
