import { useState, useEffect } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Save } from 'lucide-react'
import { enrolledStudents } from './-data'

interface AttendanceTeacherProps {
  selectedSession: any;
  sessionsOfWeek: any[];
}

export function AttendanceTeacher({ selectedSession, sessionsOfWeek }: AttendanceTeacherProps) {
  const selectedSessionId = selectedSession?.id
  const [attendanceStore, setAttendanceStore] = useState<Record<string, Record<string, boolean>>>({})
  const [savedAttendanceStore, setSavedAttendanceStore] = useState<Record<string, Record<string, boolean>>>({})

  useEffect(() => {
    setAttendanceStore(prev => {
      let changed = false
      const next = { ...prev }
      for (const session of sessionsOfWeek) {
        if (!next[session.id]) {
          next[session.id] = Object.fromEntries(enrolledStudents.map(s => [s.id, session.status === 'completed']))
          changed = true
        }
      }
      if (changed) {
        setSavedAttendanceStore(s => ({ ...next, ...s }))
      }
      return changed ? next : prev
    })
  }, [sessionsOfWeek])

  const currentAttendance = attendanceStore[selectedSessionId] || {}
  const savedAttendance = savedAttendanceStore[selectedSessionId] || {}

  const hasChanges = JSON.stringify(currentAttendance) !== JSON.stringify(savedAttendance)

  const handleSave = () => {
    setSavedAttendanceStore(prev => ({
      ...prev,
      [selectedSessionId]: currentAttendance
    }))
  }

  const updateAttendance = (studentId: string, isPresent: boolean) => {
    setAttendanceStore(prev => ({
      ...prev,
      [selectedSessionId]: {
        ...prev[selectedSessionId],
        [studentId]: isPresent
      }
    }))
  }

  const columns = [
    {
      accessorKey: 'name',
      header: 'Nombre del estudiante',
    },
    {
      accessorKey: 'email',
      header: 'Correo electrónico',
    },
    {
      id: 'present',
      enableSorting: false,
      header: () => <div className="text-center w-full">Presente</div>,
      cell: ({ row }: any) => {
        const studentId = row.original.id
        const isPresent = currentAttendance[studentId]
        
        return (
          <div className="flex justify-center w-full">
            <Checkbox 
              checked={isPresent}
              onCheckedChange={(checked) => updateAttendance(studentId, !!checked)}
              aria-label="Marcar asistencia"
            />
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col p-6 overflow-y-scroll">
      {selectedSession && (
        <div className="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-border">
          <p className="text-muted-foreground text-sm sm:text-base">
            {format(selectedSession.date, "EEEE d 'de' MMMM, yyyy", { locale: es }).replace(/^\w/, c => c.toUpperCase())}
          </p>
          <Button className="gap-2" disabled={!hasChanges} onClick={handleSave}>
            <Save className="size-4" />
            Guardar
          </Button>
        </div>
      )}

      <DataTable 
        columns={columns} 
        data={enrolledStudents} 
        filterKey="name" 
        filterPlaceholder="Buscar estudiante..."
      />
    </div>
  )
}
