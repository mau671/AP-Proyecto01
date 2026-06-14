import { Outlet, createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'

import { LineTabs } from '@/components/line-tabs'

const profileSections = [
  { label: 'Datos personales', to: '/profile/personal' },
  { label: 'Datos académicos', to: '/profile/academic' },
  { label: 'Historial académico', to: '/profile/academic-history' },
  { label: 'Plan de estudios', to: '/profile/study-plan' },
  { label: 'Contacto', to: '/profile/contact' },
  { label: 'Documentos', to: '/profile/documents' },
] as const

export const Route = createFileRoute('/profile')({
  component: ProfileLayout,
})

function ProfileLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const activeTab = profileSections.some((section) => section.to === location.pathname)
    ? location.pathname
    : '/profile/personal'

  return (
    <main className="flex grow flex-col">
      <LineTabs
        tabs={profileSections.map((section) => ({ label: section.label, value: section.to }))}
        value={activeTab}
        onValueChange={(value) => {
          const next = profileSections.find((section) => section.to === value)
          if (!next) return
          navigate({ to: next.to })
        }}
      />

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <Outlet />
      </div>
    </main>
  )
}
