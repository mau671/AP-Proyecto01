import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/management/periods')({
  component: PeriodsManagement,
})

const periods = [
  { id: '2026-S1', name: 'Semestre I', type: 'Semestre', year: 2026, startDate: '2026-02-15', endDate: '2026-06-30', status: 'Activo', enrolled: 1245 },
  { id: '2026-H1', name: 'CFH I', type: 'Centros Formación Humanística', year: 2026, startDate: '2026-02-15', endDate: '2026-06-30', status: 'Activo', enrolled: 300 },
  { id: '2025-S2', name: 'Semestre II', type: 'Semestre', year: 2025, startDate: '2025-07-20', endDate: '2025-11-25', status: 'Cerrado', enrolled: 1180 },
  { id: '2025-S1', name: 'Semestre I', type: 'Semestre', year: 2025, startDate: '2025-02-15', endDate: '2025-06-30', status: 'Cerrado', enrolled: 1100 },
  { id: '2026-V1', name: 'Verano', type: 'Verano', year: 2026, startDate: '2026-01-05', endDate: '2026-02-10', status: 'Cerrado', enrolled: 450 },
  { id: '2026-A1', name: 'Anual', type: 'Anual', year: 2026, startDate: '2026-02-15', endDate: '2026-11-25', status: 'Activo', enrolled: 150 },
  { id: '2026-S2', name: 'Semestre II', type: 'Semestre', year: 2026, startDate: '2026-07-20', endDate: '2026-11-25', status: 'Planificación', enrolled: 0 },
]

const columns = [
  {
    accessorKey: 'id',
    header: 'Código',
    cell: ({ row }: any) => <div className="font-mono">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'type',
    header: 'Modalidad',
  },
  {
    accessorKey: 'year',
    header: 'Año',
  },
  {
    accessorKey: 'startDate',
    header: 'Fecha de inicio',
  },
  {
    accessorKey: 'endDate',
    header: 'Fecha de fin',
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }: any) => {
      const status = row.getValue('status') as string
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline'
      if (status === 'Activo') variant = 'default'
      else if (status === 'Cerrado') variant = 'secondary'
      else if (status === 'Planificación') variant = 'outline'
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: 'enrolled',
    header: 'Matriculados',
  },
  {
    id: 'actions',
    header: '',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="size-8 p-0" />}>
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Edit className="mr-2 size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <Trash className="mr-2 size-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function PeriodsManagement() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button>Nuevo período</Button>
      </div>
      <DataTable 
        columns={columns} 
        data={periods} 
        filterKey="name" 
        filterPlaceholder="Buscar por nombre..."
      />
    </div>
  )
}
