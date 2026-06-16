import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/management/students')({
  component: StudentsManagement,
})

const students = [
  { id: '202600001', name: 'Ana Isabel Salazar', email: 'asalazar@estudiantil.utlm.cr', status: 'Activo', credits: 14, campus: 'Cartago' },
  { id: '202600002', name: 'Carlos Eduardo Campos', email: 'ccampos@estudiantil.utlm.cr', status: 'Inactivo', credits: 0, campus: 'San José' },
  { id: '202600003', name: 'María Fernanda Ruiz', email: 'mruiz@estudiantil.utlm.cr', status: 'Activo', credits: 18, campus: 'Alajuela' },
  { id: '202600004', name: 'Juan Pablo Monge', email: 'jmonge@estudiantil.utlm.cr', status: 'Condicional', credits: 10, campus: 'Cartago' },
  { id: '202600005', name: 'Laura Daniela Chaves', email: 'lchaves@estudiantil.utlm.cr', status: 'Activo', credits: 16, campus: 'Limón' },
  { id: '202600006', name: 'Luis Fernando Vargas', email: 'lvargas@estudiantil.utlm.cr', status: 'Activo', credits: 14, campus: 'San José' },
  { id: '202600007', name: 'Sofia Cristina Mora', email: 'smora@estudiantil.utlm.cr', status: 'Inactivo', credits: 0, campus: 'Cartago' },
  { id: '202600008', name: 'Andrés Felipe Rojas', email: 'arojas@estudiantil.utlm.cr', status: 'Activo', credits: 12, campus: 'Puntarenas' },
]

const columns = [
  {
    accessorKey: 'id',
    header: 'Carnet',
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
    accessorKey: 'campus',
    header: 'Sede',
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }: any) => {
      const status = row.getValue('status') as string
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline'
      if (status === 'Activo') variant = 'default'
      else if (status === 'Inactivo') variant = 'secondary'
      else if (status === 'Condicional') variant = 'destructive'
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: 'credits',
    header: 'Créditos',
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

function StudentsManagement() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button>Agregar estudiante</Button>
      </div>
      <DataTable 
        columns={columns} 
        data={students} 
        filterKey="name" 
        filterPlaceholder="Buscar por nombre..."
      />
    </div>
  )
}
