import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { Header } from '@/components/header'
import { Providers } from '@/components/providers'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => (
    <div className="flex grow flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">Página no encontrada</p>
    </div>
  ),
})

function RootComponent() {
  const location = useLocation()
  const isAuthPage = location.pathname.startsWith('/auth')
  const pathParts = location.pathname.split("/").filter(Boolean)
  const isCoursePath = pathParts[0] === "courses" && pathParts.length >= 6
  const isProfilePath = pathParts[0] === "profile"
  const isFinancePath = pathParts[0] === "finance"
  const isEnrollmentPath = pathParts[0] === "enrollment"

  let wrapperClass = "min-h-0 flex-1 w-full min-w-0"
  if (isEnrollmentPath) {
    wrapperClass += " flex flex-col md:overflow-hidden overflow-y-auto [scrollbar-gutter:auto]"
  } else if (isCoursePath || isProfilePath || isFinancePath) {
    wrapperClass += " flex flex-col overflow-hidden"
  } else {
    wrapperClass += " overflow-y-auto [scrollbar-gutter:stable]"
  }

  return (
    <Providers>
      {!isAuthPage && <Header />}
      <div className={wrapperClass}>
        <Outlet />
      </div>
      <TanStackDevtools
        config={{ position: 'bottom-right' }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </Providers>
  )
}
