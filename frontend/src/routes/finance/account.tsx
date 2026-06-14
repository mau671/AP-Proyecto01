import { Link, createFileRoute } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { accountYears, formatCurrency } from '@/lib/student-data'
import { Wallet, Landmark, Receipt } from 'lucide-react'

export const Route = createFileRoute('/finance/account')({
  component: StudentFinanceAccountPage,
})

function StudentFinanceAccountPage() {
  const pendingBalance = 9060.55

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* KPI Cards Summary - No color bars, neutral icons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col justify-center">
          <span className="text-sm font-medium text-muted-foreground">Saldo pendiente</span>
          <span className="text-2xl font-bold mt-1">
            {formatCurrency(pendingBalance)}
          </span>
        </Card>
        <Card className="p-4 flex flex-col justify-center">
          <span className="text-sm font-medium text-muted-foreground">Cobros pendientes</span>
          <span className="text-2xl font-bold mt-1">
            1
          </span>
        </Card>
        <Card className="p-4 flex flex-col justify-center">
          <span className="text-sm font-medium text-muted-foreground">Estado financiero</span>
          <span className="text-xl font-bold mt-1">
            Al día para trámites
          </span>
        </Card>
      </div>

      {/* Account Statement Accordions - Match main page course list style & indentation */}
      <div className="space-y-2 pt-2">
        {accountYears.map((year) => (
          <Collapsible key={year.year}>
            <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
              <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
                <CollapseSquare />
              </CollapsibleTrigger>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <h3 className="truncate text-base font-medium">{year.year}</h3>
                <div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                  <span>{year.charges.length} cobros</span>
                </div>
              </div>
            </div>

            {/* Indented periods container matching main page's index.tsx (pl-8) */}
            <CollapsibleContent className="space-y-1 pl-8 pt-1 text-sm text-muted-foreground">
              {year.charges.map((charge) => (
                <Collapsible key={`${year.year}-${charge.period}`}>
                  <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                    <CollapsibleTrigger className="group grid size-6 shrink-0 place-items-center rounded-sm border border-border text-foreground">
                      <CollapseSquare />
                    </CollapsibleTrigger>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <h4 className="truncate text-base font-medium text-foreground">{charge.period}</h4>
                      <div className="flex shrink-0 items-center gap-3 text-sm text-muted-foreground">
                        <Badge variant={charge.status === 'Pagado' ? 'secondary' : 'destructive'}>
                          {charge.status}
                        </Badge>
                        <span className="font-mono text-foreground font-semibold">
                          {formatCurrency(charge.balance)}
                        </span>
                        {charge.status !== 'Pagado' && (
                          <Button size="sm" variant="outline" asChild className="h-7 px-2.5 text-xs font-semibold">
                            <Link to="/finance/payment">Pagar ahora</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Indented table container matching main page (pl-8) */}
                  <CollapsibleContent className="pl-8 pt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead colSpan={2} className="bg-muted/40 font-semibold text-xs uppercase tracking-wider py-1.5 pl-2">
                            Detalle de cobro
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium text-xs pl-2">Créditos matriculados</TableCell>
                          <TableCell className="text-right font-mono text-xs">{charge.enrolledCredits}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-xs pl-2">Créditos al cobro</TableCell>
                          <TableCell className="text-right font-mono text-xs">{charge.billedCredits}</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={2} className="bg-muted/40 font-semibold text-xs uppercase tracking-wider py-1.5 pl-2">
                            Detalle de montos
                          </TableCell>
                        </TableRow>
                        {charge.amounts.map((amount) => (
                          <TableRow key={amount.concept}>
                            <TableCell className="font-medium text-xs pl-2">{amount.concept}</TableCell>
                            <TableCell className="text-right font-mono text-xs">{formatCurrency(amount.amount)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted/20 font-semibold">
                          <TableCell className="text-xs pl-2">Saldo Total del Periodo</TableCell>
                          <TableCell className="text-right font-mono text-xs">{formatCurrency(charge.balance)}</TableCell>
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
    </div>
  )
}

function CollapseSquare() {
  return (
    <>
      <span className="text-base leading-none group-data-[panel-open]:hidden">+</span>
      <span className="hidden text-base leading-none group-data-[panel-open]:block">-</span>
    </>
  )
}
