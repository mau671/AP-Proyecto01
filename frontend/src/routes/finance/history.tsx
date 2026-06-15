import { createFileRoute } from '@tanstack/react-router'
import { FileDown, CreditCard, Smartphone, ShieldCheck, ArrowUpDown, MoreHorizontal, Download, Copy, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

import { type ColumnDef } from '@tanstack/react-table'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/ui/data-table'

import { formatCurrency } from '@/lib/student-data'
import { paymentHistory, type PaymentHistoryItem } from '@/lib/finance-data'

export const Route = createFileRoute('/finance/history')({
  component: StudentFinanceHistoryPage,
})

const handleDownloadReceipt = (reference: string) => {
  toast.success('Descargando comprobante', {
    description: `El archivo PDF del comprobante ${reference} se ha descargado.`,
  })
}

// Column Definitions
export const columns: ColumnDef<PaymentHistoryItem>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="ml-2 h-8 data-[state=open]:bg-accent"
        >
          Fecha
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'))
      return (
        <div className="font-mono font-medium text-sm ml-2">
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
    accessorKey: 'concept',
    header: 'Concepto',
    cell: ({ row }) => {
      const payment = row.original
      const conceptStr = payment.concept
      const sentenceCaseConcept = conceptStr.charAt(0).toUpperCase() + conceptStr.slice(1).toLowerCase()
      return (
        <div>
          <div className="font-semibold text-sm text-foreground">{sentenceCaseConcept}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <span className="font-mono">{payment.reference}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'period',
    header: 'Periodo',
    cell: ({ row }) => {
      const period = row.getValue('period') as string
      return <div className="text-sm">{period.replace(' - ', ': ')}</div>
    },
  },
  {
    accessorKey: 'method',
    header: 'Método de Pago',
    cell: ({ row }) => {
      const method = row.getValue('method') as string
      const isCard = method.toLowerCase().includes('tarjeta')
      return (
        <div className="flex items-center gap-2 text-xs">
          {isCard ? (
            <CreditCard className="size-4 text-blue-500 shrink-0" />
          ) : (
            <Smartphone className="size-4 text-teal-500 shrink-0" />
          )}
          <span className="font-medium truncate max-w-[150px]">{method}</span>
        </div>
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
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(payment.reference)
                  toast.success('Referencia copiada al portapapeles')
                }}
              >
                <Copy className="mr-2 size-4" />
                Copiar referencia
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadReceipt(payment.reference)}>
                <Download className="mr-2 size-4" />
                Descargar PDF
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function StudentFinanceHistoryPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* KPIs Generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 flex flex-col justify-center">
          <span className="text-sm font-medium text-muted-foreground">Total pagado</span>
          <span className="text-2xl font-bold mt-1">
            {formatCurrency(paymentHistory.reduce((sum, p) => sum + p.amount, 0))}
          </span>
        </Card>
        <Card className="p-4 flex flex-col justify-center">
          <span className="text-sm font-medium text-muted-foreground">Último pago</span>
          <span className="text-2xl font-bold mt-1">
            {paymentHistory.length > 0 
              ? new Date(paymentHistory[0].date).toLocaleDateString('es-CR')
              : '-'}
          </span>
        </Card>
        <Card className="p-4 flex flex-col justify-center">
          <span className="text-sm font-medium text-muted-foreground">Transacciones</span>
          <span className="text-2xl font-bold mt-1">
            {paymentHistory.length}
          </span>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={paymentHistory}
        filterKey="concept"
        filterPlaceholder="Filtrar por concepto..."
        columnLabels={{
          date: 'Fecha',
          concept: 'Concepto',
          period: 'Periodo',
          method: 'Método',
          amount: 'Monto'
        }}
      />
    </div>
  )
}
