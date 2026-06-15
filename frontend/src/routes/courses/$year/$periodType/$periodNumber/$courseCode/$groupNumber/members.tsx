import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { getDemoUser } from '@/lib/demo-auth'
import { type ColumnDef } from '@tanstack/react-table'

export const Route = createFileRoute(
  '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/members',
)({
  component: CourseMembersPage,
})

type Member = {
  avatarUrl?: string
  firstName: string
  lastName: string
  email: string
  role: string
  isCurrentUser: boolean
}

function CourseMembersPage() {
  const navigate = Route.useNavigate()
  const currentUser = getDemoUser()

  const initialMembers: Member[] = React.useMemo(() => [
    {
      firstName: 'Alicia Marcela',
      lastName: 'Salazar Hernández',
      email: 'asalazar@utlm.cr',
      role: 'Profesor',
      isCurrentUser: currentUser?.role === 'teacher',
    },
    {
      firstName: 'Juan',
      lastName: 'Pérez Gómez',
      email: 'jperez@utlm.cr',
      role: 'Tutor',
      isCurrentUser: false,
    },
    {
      firstName: 'Carlos',
      lastName: 'Vindas Mora',
      email: 'cvindas@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'María Fernanda',
      lastName: 'Rojas',
      email: 'mrojas@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Jorge',
      lastName: 'Pérez Sánchez',
      email: 'jperez-sanchez@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Ana Laura',
      lastName: 'Gómez',
      email: 'agomez@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'David',
      lastName: 'Rodríguez Vega',
      email: 'drodriguez@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Estudiante',
      lastName: 'Demo',
      email: 'estudiante@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: currentUser?.role === 'student',
    },
    {
      firstName: 'Andrés',
      lastName: 'Chaves Quesada',
      email: 'achaves@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Beatriz',
      lastName: 'Solano Murillo',
      email: 'bsolano@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Camila',
      lastName: 'Herrera Vargas',
      email: 'cherrera@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Daniel',
      lastName: 'Monge Alfaro',
      email: 'dmonge@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Elena',
      lastName: 'Delgado Castro',
      email: 'edelgado@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Felipe',
      lastName: 'Mora Jiménez',
      email: 'fmora@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Gabriela',
      lastName: 'Brenes Solís',
      email: 'gbrenes@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Hernán',
      lastName: 'Ruiz Salazar',
      email: 'hruiz@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Irene',
      lastName: 'Castillo Camacho',
      email: 'icastillo@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Javier',
      lastName: 'Quirós Segura',
      email: 'jquiros@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Karen',
      lastName: 'Leitón Blanco',
      email: 'kleiton@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Luis Fernando',
      lastName: 'Araya',
      email: 'laraya@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Mónica',
      lastName: 'Granados Navarro',
      email: 'mgranados@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Néstor',
      lastName: 'Cordero Fonseca',
      email: 'ncordero@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Olga',
      lastName: 'Miranda Gutiérrez',
      email: 'omiranda@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Pablo',
      lastName: 'Villalobos Céspedes',
      email: 'pvillalobos@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Rebeca',
      lastName: 'Marín Soto',
      email: 'rmarin@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    },
    {
      firstName: 'Santiago',
      lastName: 'Aguilar Mata',
      email: 'saguilar@utlm.cr',
      role: 'Estudiante',
      isCurrentUser: false,
    }
  ], [currentUser])

  const [members, setMembers] = React.useState<Member[]>(initialMembers)

  const handleUnenroll = (member: Member) => {
    if (window.confirm(`¿Estás seguro de que deseas darte de baja del curso?`)) {
      setMembers((prev) => prev.filter((m) => !m.isCurrentUser))
      toast.success('Te has dado de baja del curso con éxito')
      navigate({
        to: '/',
      })
    }
  }

  const columns = React.useMemo<ColumnDef<Member>[]>(() => [
    {
      id: 'avatar',
      accessorKey: 'avatar',
      header: 'Avatar',
      enableSorting: false,
      size: 80,
      cell: ({ row }) => {
        const initials = `${row.original.firstName[0] || ''}${row.original.lastName[0] || ''}`.toUpperCase()
        return (
          <Avatar>
            {row.original.avatarUrl && <AvatarImage src={row.original.avatarUrl} alt={row.original.firstName} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        )
      }
    },
    {
      accessorKey: 'lastName',
      header: 'Apellidos',
      size: 250,
    },
    {
      accessorKey: 'firstName',
      header: 'Nombre',
      size: 200,
    },
    {
      accessorKey: 'email',
      header: 'Correo electrónico',
      size: 300,
    },
    {
      accessorKey: 'role',
      header: 'Rol',
      size: 150,
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      header: () => <div className="text-right pr-4">Acciones</div>,
      enableSorting: false,
      size: 150,
      cell: ({ row }) => {
        if (row.original.isCurrentUser && row.original.role === 'Estudiante') {
          return (
            <div className="flex justify-end pr-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleUnenroll(row.original)}
                className="cursor-pointer h-8 text-xs px-3"
              >
                Dar de baja
              </Button>
            </div>
          )
        }
        return null
      }
    }
  ], [currentUser])

  const handleBack = () => {
    navigate({
      to: '/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber',
      search: { tab: 0 }
    })
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 md:px-8 space-y-6">
      {/* Header Navigation */}
      <button 
        type="button" 
        onClick={handleBack}
        className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Volver al curso</span>
      </button>

      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-normal tracking-tight">Lista de integrantes</h1>
        <p className="text-sm text-muted-foreground">
          Visualiza el equipo docente, tutores y estudiantes matriculados en este curso.
        </p>
      </div>

      <DataTable 
        columns={columns} 
        data={members} 
        filterKey="lastName"
        filterPlaceholder="Buscar por apellidos..."
        defaultSorting={[{ id: 'lastName', desc: false }]}
        columnLabels={{
          lastName: 'Apellidos',
          firstName: 'Nombre',
          email: 'Correo electrónico',
          role: 'Rol',
          actions: 'Acciones'
        }}
      />
    </div>
  )
}
