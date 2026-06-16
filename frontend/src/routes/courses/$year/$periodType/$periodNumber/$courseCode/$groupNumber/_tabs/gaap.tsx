import { createFileRoute, Outlet, Link, useParams, useLocation } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { getDemoUser } from '@/lib/demo-auth'
import { cn } from '@/lib/utils'
import { evaluations } from '../../course-page/-gaap-data'
import { GaapContext } from '../../course-page/-gaap-tab'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/_tabs/gaap',
)({
  component: GaapLayout,
})

function GaapLayout() {
  const user = getDemoUser()
  const ROLE = user?.role || 'student'
  const { year, periodType, periodNumber, courseCode, groupNumber } = useParams({ strict: false }) as any
  const gaapBasePath = `/courses/${year}/${periodType}/${periodNumber}/${courseCode}/${groupNumber}/gaap`
  const location = useLocation()
  
  const pathParts = location.pathname.split('/')
  const lastPart = pathParts[pathParts.length - 1]
  const isNew = lastPart === 'new'
  const isEdit = pathParts[pathParts.length - 2] === 'edit'
  
  // Set selectedEvalId based on URL or default
  const [selectedEvalId, setSelectedEvalId] = useState<string | null>(evaluations[0]?.id || null)
  
  useEffect(() => {
    if (isEdit) {
      setSelectedEvalId(lastPart) // lastPart is the ID
    } else if (isNew) {
      setSelectedEvalId(null)
    } else if (!selectedEvalId && !isEdit && !isNew) {
      setSelectedEvalId(evaluations[0]?.id || null)
    }
  }, [isEdit, isNew, lastPart, selectedEvalId])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] w-full bg-background flex-1">
      {/* Sidebar de Evaluaciones */}
      <div className="border-b lg:border-b-0 lg:border-r border-border bg-muted/30">
        <div className="lg:sticky lg:top-0 lg:h-[calc(100vh-140px)] flex flex-col gap-4 p-4 lg:overflow-y-auto">
          {ROLE === 'teacher' && (
            <div className="pb-4 border-b border-border">
              <Link to={`${gaapBasePath}/new`}>
                <Button 
                  className="w-full" 
                  variant={isNew ? 'default' : 'outline'}
                  onClick={() => setSelectedEvalId(null)}
                >
                  <PlusIcon className="mr-2 size-4" /> Nueva evaluación
                </Button>
              </Link>
            </div>
          )}

          {evaluations.map((evaluation) => {
            const isSelected = evaluation.id === selectedEvalId && !isNew
            return (
              <Link
                key={evaluation.id}
                to={gaapBasePath}
                onClick={() => setSelectedEvalId(evaluation.id)}
                className="block"
              >
                <Card
                  role="button"
                  tabIndex={0}
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
              </Link>
            )
          })}
        </div>
      </div>

      {/* Área de Solucionario / Editor */}
      <div className="p-6 lg:p-10">
        <GaapContext.Provider value={{ selectedEvalId, setSelectedEvalId }}>
          <Outlet />
        </GaapContext.Provider>
      </div>
    </div>
  )
}
