import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/management/teachers')({
  component: TeachersManagement,
})

const teachers = [
  { id: '102540123', name: 'Laura Gómez Castillo', email: 'lgomez@utlm.cr', department: 'Ingeniería en Computación', status: 'Planta' },
  { id: '304120984', name: 'Roberto Alvarado Pérez', email: 'ralvarado@utlm.cr', department: 'Matemática', status: 'Interino' },
  { id: '205840392', name: 'Patricia Brenes Salas', email: 'pbrenes@utlm.cr', department: 'Física', status: 'Planta' },
  { id: '109840231', name: 'José Miguel Solís', email: 'jsolis@utlm.cr', department: 'Administración de Empresas', status: 'Invitado' },
  { id: '401920834', name: 'Carmen Rojas Díaz', email: 'crojas@utlm.cr', department: 'Ingeniería en Computación', status: 'Planta' },
]

const columns = [
  {
    accessorKey: 'id',
    header: 'Cédula',
    cell: ({ row }: any) => <div className="font-mono">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'name',
    header: 'Nombre completo',
  },
  {
    accessorKey: 'email',
    header: 'Correo institucional',
  },
  {
    accessorKey: 'department',
    header: 'Departamento',
  },
  {
    accessorKey: 'status',
    header: 'Tipo',
    cell: ({ row }: any) => {
      const status = row.getValue('status') as string
      return <Badge variant="outline">{status}</Badge>
    },
  },
  {
    id: 'actions',
    header: '',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="size-4" />
          </Button>
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

function TeachersManagement() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button>Agregar docente</Button>
      </div>
      <DataTable 
        columns={columns} 
        data={teachers} 
        filterKey="name" 
        filterPlaceholder="Buscar por nombre..."
      />
    </div>
  )
}
