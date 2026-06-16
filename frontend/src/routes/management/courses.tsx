import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/management/courses')({
  component: CoursesManagement,
})

const courses = [
  { code: 'CI1230', name: 'Ingeniería de Software I', credits: 4, department: 'Ingeniería en Computación', activeGroups: 3 },
  { code: 'CI1312', name: 'Estructuras de Datos', credits: 4, department: 'Ingeniería en Computación', activeGroups: 5 },
  { code: 'MA1001', name: 'Cálculo Diferencial', credits: 4, department: 'Matemática', activeGroups: 8 },
  { code: 'FI1001', name: 'Física General I', credits: 4, department: 'Física', activeGroups: 6 },
  { code: 'AE1001', name: 'Administración Básica', credits: 3, department: 'Administración de Empresas', activeGroups: 2 },
  { code: 'CI1400', name: 'Bases de Datos I', credits: 4, department: 'Ingeniería en Computación', activeGroups: 4 },
]

const columns = [
  {
    accessorKey: 'code',
    header: 'Código',
    cell: ({ row }: any) => <div className="font-mono font-semibold">{row.getValue('code')}</div>,
  },
  {
    accessorKey: 'name',
    header: 'Nombre del curso',
  },
  {
    accessorKey: 'department',
    header: 'Escuela / departamento',
  },
  {
    accessorKey: 'credits',
    header: 'Créditos',
  },
  {
    accessorKey: 'activeGroups',
    header: 'Grupos activos',
    cell: ({ row }: any) => <Badge variant="secondary">{row.getValue('activeGroups')} grupos</Badge>,
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

function CoursesManagement() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button>Agregar curso</Button>
      </div>
      <DataTable 
        columns={columns} 
        data={courses} 
        filterKey="name" 
        filterPlaceholder="Buscar por nombre..."
      />
    </div>
  )
}
