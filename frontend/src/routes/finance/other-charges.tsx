import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowUpDown, ChevronDown, ArrowRight } from 'lucide-react'

import { type ColumnDef } from '@tanstack/react-table'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/ui/data-table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { formatCurrency } from '@/lib/student-data'
import { otherCharges, type OtherChargeItem } from '@/lib/finance-data'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/finance/other-charges')({
  component: StudentFinanceOtherChargesPage,
})

export const columns: ColumnDef<OtherChargeItem>[] = [
  {
    accessorKey: 'category',
    header: 'Categoría',
    cell: ({ row }) => <div className="font-medium text-sm text-muted-foreground">{row.getValue('category')}</div>,
  },
  {
    accessorKey: 'concept',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 h-8 data-[state=open]:bg-accent"
        >
          Concepto
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const concept = row.getValue('concept') as string
      const isTruncated = concept.length > 30
      
      const content = <div className="font-semibold text-sm text-foreground truncate max-w-[200px]">{concept}</div>
      
      if (!isTruncated) return content

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>{concept}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: 'date',
    header: 'Fecha',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'))
      return (
        <div className="text-sm font-mono ml-2">
          {date.toLocaleDateString('es-CR', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          })}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge
          variant={status === 'Pagado' ? 'secondary' : 'destructive'}
          className={cn(
            status === 'Pagado'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none'
              : ''
          )}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Monto</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-mono font-bold text-sm text-foreground">
          {formatCurrency(row.getValue('amount'))}
        </div>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const charge = row.original

      return charge.status === 'Pendiente' ? (
        <div className="text-right flex justify-end">
          <Button size="sm" variant="outline" asChild className="h-7 text-xs font-semibold px-2.5 whitespace-nowrap shrink-0">
            <Link to="/finance/payment" className="flex items-center gap-1">
              Pagar
              <ArrowRight className="size-3.5 shrink-0" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="text-right">
          <span className="text-xs text-muted-foreground font-medium px-2.5">—</span>
        </div>
      )
    },
  },
]

function StudentFinanceOtherChargesPage() {
  const totalPending = otherCharges
    .filter((c) => c.status === 'Pendiente')
    .reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* KPIs sin separator (sin border-b ni pb-6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 flex flex-col justify-center">
          <span className="text-sm font-medium text-muted-foreground">Total pendiente</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold">
              {formatCurrency(totalPending)}
            </span>
            {totalPending > 0 && (
              <Button size="sm" asChild className="h-8">
                <Link to="/finance/payment">Pagar todo</Link>
              </Button>
            )}
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-center">
          <span className="text-sm font-medium text-muted-foreground">Total pagado</span>
          <span className="text-2xl font-bold mt-1">
            {formatCurrency(otherCharges.filter(c => c.status === 'Pagado').reduce((sum, c) => sum + c.amount, 0))}
          </span>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={otherCharges}
        filterKey="concept"
        filterPlaceholder="Filtrar por concepto..."
        columnLabels={{
          category: 'Categoría',
          concept: 'Concepto',
          date: 'Fecha',
          status: 'Estado',
          amount: 'Monto'
        }}
      />
    </div>
  )
}
