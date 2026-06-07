import { Outlet, createRootRouteWithContext, useLocation } from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'

import { Header } from '@/components/header'
import { Providers } from '@/components/providers'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
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

  return (
    <Providers>
      {!isAuthPage && <Header />}
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
        <Outlet />
      </div>
      <TanStackDevtools
        config={{ position: 'bottom-right' }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </Providers>
  )
}
