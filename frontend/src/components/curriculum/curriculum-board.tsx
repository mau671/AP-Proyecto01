import { BookOpenIcon, CalendarIcon, ChevronDownIcon, ChevronUpIcon, GraduationCapIcon, RotateCcwIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import type { CurriculumPlanDetail } from '@/lib/curriculum-data'

import { CurriculumGrid } from './curriculum-grid'

const ZOOM_MIN = 0.7
const ZOOM_MAX = 1
const ZOOM_STEP = 0.05
const ZOOM_DEFAULT = 0.75

export function CurriculumBoard({ planDetail }: { planDetail: CurriculumPlanDetail }) {
  const [zoom, setZoom] = useState(ZOOM_DEFAULT)
  const [isPanelOpen, setIsPanelOpen] = useState(true)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + ZOOM_STEP, ZOOM_MAX))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - ZOOM_STEP, ZOOM_MIN))
  const handleReset = () => setZoom(ZOOM_DEFAULT)

  return (
    <div className="relative flex h-full flex-col">
      <div className="absolute right-4 top-4 z-10">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsPanelOpen((value) => !value)}
          className="gap-2 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60"
          title={isPanelOpen ? 'Ocultar controles' : 'Mostrar controles'}
        >
          <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
          {isPanelOpen ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
        </Button>

        {isPanelOpen ? (
          <div className="absolute right-0 top-full mt-2 min-w-[220px] rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mb-3 flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= ZOOM_MIN} title="Alejar">
                <ZoomOutIcon className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= ZOOM_MAX} title="Acercar">
                <ZoomInIcon className="size-4" />
              </Button>
              <div className="mx-1 h-5 w-px bg-border" />
              <Button type="button" variant="ghost" size="icon" onClick={handleReset} title="Restablecer tamaño">
                <RotateCcwIcon className="size-4" />
              </Button>
            </div>

            <div className="mt-2 space-y-2 border-t border-border pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCapIcon className="size-4" />
                <span>{planDetail.plan.academicDegree}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpenIcon className="size-4" />
                <span>{planDetail.plan.modalityName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="size-4" />
                <span>Plan: {planDetail.plan.externalPlanId}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1">
        <CurriculumGrid planDetail={planDetail} zoom={zoom} />
      </div>
    </div>
  )
}
