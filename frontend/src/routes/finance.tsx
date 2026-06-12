import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getDemoUser, type DemoUser } from '@/lib/demo-auth'
import { accountYears, formatCurrency, studentProfile } from '@/lib/student-data'

export const Route = createFileRoute('/finance')({
  component: StudentFinancePage,
})

function StudentFinancePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<DemoUser | null>(null)

  useEffect(() => {
    const currentUser = getDemoUser()
    if (!currentUser) {
      navigate({ to: '/auth/signin' })
      return
    }

    setUser(currentUser)
  }, [navigate])

  if (!user) return null

  if (user.role !== 'student') {
    return (
      <main className="mx-auto flex w-full max-w-4xl grow flex-col justify-center px-6 py-10">
        <div className="space-y-4 rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">{user.roleLabel}</p>
          <h1 className="text-2xl font-semibold">Modo en preparación</h1>
          <p className="text-muted-foreground">
            Por ahora solo está implementado el dashboard estudiantil. Inicia sesión con estudiante@utlm.cr para revisar el flujo actual.
          </p>
          <Button asChild>
            <Link to="/auth/signin">Cambiar usuario</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-7xl grow px-4 py-6 md:px-8">
      <section className="mb-6">
        <p className="text-sm font-medium text-muted-foreground">{studentProfile.career}</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Financiero</h1>
        <p className="text-sm text-muted-foreground">Estado de cuenta y pagos pendientes</p>
      </section>

      <div className="space-y-2 rounded-xl border border-border p-3">
        {accountYears.map((year, yearIndex) => (
          <Collapsible key={year.year} defaultOpen={yearIndex === 0}>
            <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
              <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
                <span className="text-base leading-none group-data-[panel-open]:hidden">+</span>
                <span className="hidden text-base leading-none group-data-[panel-open]:block">-</span>
              </CollapsibleTrigger>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <h3 className="truncate text-base font-semibold">{year.year}</h3>
                <div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                  <span>{year.charges.length} cobros</span>
                </div>
              </div>
            </div>
            <CollapsibleContent className="space-y-1 pl-8 pt-1">
              {year.charges.map((charge, chargeIndex) => (
                <Collapsible key={`${year.year}-${charge.period}`} defaultOpen={yearIndex === 0 && chargeIndex === 0}>
                  <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                    <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
                      <span className="text-base leading-none group-data-[panel-open]:hidden">+</span>
                      <span className="hidden text-base leading-none group-data-[panel-open]:block">-</span>
                    </CollapsibleTrigger>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="truncate text-base font-medium">{charge.period}</h4>
                        <p className="truncate text-sm text-muted-foreground">Fecha límite sin recargo: {charge.dueDateWithoutSurcharge}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant={charge.status === 'Pagado' ? 'secondary' : 'destructive'}>{charge.status}</Badge>
                        <span className="hidden font-mono text-sm font-medium sm:block">{formatCurrency(charge.balance)}</span>
                      </div>
                    </div>
                  </div>
                  <CollapsibleContent className="pl-8 pt-2">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={2} className="bg-muted/40 font-semibold">Detalle de créditos</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Créditos matriculados</TableCell>
                          <TableCell className="text-right font-mono">{charge.enrolledCredits}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Créditos al cobro</TableCell>
                          <TableCell className="text-right font-mono">{charge.billedCredits}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2} className="bg-muted/40 font-semibold">Detalle de montos</TableCell>
                        </TableRow>
                        {charge.amounts.map((amount) => (
                          <TableRow key={amount.concept}>
                            <TableCell className="font-medium">{amount.concept}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(amount.amount)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="font-semibold">Saldo</TableCell>
                          <TableCell className="text-right font-mono font-semibold">{formatCurrency(charge.balance)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </main>
  )
}
