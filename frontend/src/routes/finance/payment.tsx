import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  CreditCard,
  CheckCircle,
  Smartphone,
  Info,
  ArrowLeft,
  Receipt,
  ArrowRight,
  Landmark,
  Plus,
  ShieldCheck,
  MoreHorizontal,
  Pencil,
  Trash2,
  Star,
} from 'lucide-react'
import { toast } from 'sonner'
import { PaymentIcon } from 'react-svg-credit-card-payment-icons'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/student-data'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/finance/payment')({
  component: StudentFinancePaymentPage,
})

// Mock saved cards
interface SavedCard {
  id: string
  brand: 'Visa' | 'Mastercard'
  last4: string
  holder: string
  expiry: string
  isDefault: boolean
}

const initialSavedCards: SavedCard[] = [
  {
    id: 'card-1',
    brand: 'Visa',
    last4: '4242',
    holder: 'Mauricio Vásquez',
    expiry: '12/27',
    isDefault: true,
  },
  {
    id: 'card-2',
    brand: 'Mastercard',
    last4: '8888',
    holder: 'Mauricio Vásquez',
    expiry: '08/26',
    isDefault: false,
  },
]

function StudentFinancePaymentPage() {
  const [mySavedCards, setMySavedCards] = useState<SavedCard[]>(initialSavedCards)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [isPaid, setIsPaid] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sinpe' | 'bank'>('card')

  // Card Selection State
  const [selectedCardId, setSelectedCardId] = useState<string>(
    mySavedCards.find((c) => c.isDefault)?.id || mySavedCards[0]?.id || ''
  )
  const [showNewCardForm, setShowNewCardForm] = useState(false)
  const [saveNewCard, setSaveNewCard] = useState(true)
  const [cardToEditId, setCardToEditId] = useState<string | null>(null)

  // New Card Form State
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')

  // SINPE State
  const [sinpePhone, setSinpePhone] = useState('')
  const [sinpeReference, setSinpeReference] = useState('')

  // Bank Transfer State
  const [bankEmitter, setBankEmitter] = useState('')
  const [bankReference, setBankReference] = useState('')

  // Simulated payment data
  const pendingAmount = 9060.55
  const simulatedReceiptNumber = 'REC-2026-98741'
  const currentDate = new Date().toLocaleDateString('es-CR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handleGoToDetails = () => {
    setCurrentStep(2)
  }

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === 'card') {
      if (showNewCardForm) {
        if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
          toast.error('Datos incompletos', {
            description: 'Por favor complete todos los campos de la nueva tarjeta.',
          })
          return
        }
      } else if (!selectedCardId) {
        toast.error('Selecciona una tarjeta', {
          description: 'Elige una tarjeta guardada o agrega una nueva.',
        })
        return
      }
    } else if (paymentMethod === 'sinpe') {
      if (!sinpePhone || !sinpeReference) {
        toast.error('Datos incompletos', {
          description: 'Por favor ingrese el número de teléfono emisor y la referencia del SINPE.',
        })
        return
      }
    } else if (paymentMethod === 'bank') {
      if (!bankEmitter || !bankReference) {
        toast.error('Datos incompletos', {
          description: 'Por favor ingrese el banco de origen y la referencia de la transferencia.',
        })
        return
      }
    }
    setCurrentStep(3)
  }

  const handleConfirmPayment = () => {
    setIsPaid(true)
    toast.success('Pago procesado con éxito', {
      description: `El pago por ${formatCurrency(pendingAmount)} fue registrado correctamente.`,
    })
  }

  // Get the display text for the selected payment method on step 3
  const getPaymentMethodLabel = () => {
    if (paymentMethod === 'card') {
      if (showNewCardForm) {
        return `Tarjeta bancaria (*${cardNumber.replace(/\s/g, '').slice(-4) || '0000'})`
      }
      const card = mySavedCards.find((c) => c.id === selectedCardId)
      return card ? `${card.brand} •••• ${card.last4}` : 'Tarjeta guardada'
    }
    if (paymentMethod === 'sinpe') return `SINPE Móvil (Ref: ${sinpeReference})`
    return `Transferencia Bancaria (${bankEmitter} - Ref: ${bankReference})`
  }

  const isPaymentFormValid = paymentMethod === 'card'
    ? (showNewCardForm ? !!(cardNumber && cardExpiry && cardCvv && cardName) : !!selectedCardId)
    : paymentMethod === 'sinpe'
      ? !!(sinpePhone && sinpeReference)
      : !!(bankEmitter && bankReference)

  const steps = [
    { id: 1, label: 'Método de pago' },
    { id: 2, label: 'Completar datos' },
    { id: 3, label: 'Confirmar' },
  ] as const

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* 3-Step Stepper */}
      <div className="w-full max-w-xl mx-auto flex justify-center mb-6">
        <div className="flex items-center justify-center w-full">
          {steps.map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all border-2 select-none bg-background',
                    currentStep === s.id
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : currentStep > s.id
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-muted text-muted-foreground'
                  )}
                >
                  {currentStep > s.id ? '✓' : s.id}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-wider mt-1.5 hidden sm:block whitespace-nowrap',
                    currentStep === s.id ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 w-16 sm:w-24 mx-2 sm:mx-4 transition-colors',
                    currentStep > s.id ? 'bg-emerald-500' : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Confirm and Receipt */}
      {currentStep === 3 ? (
        <div className="mx-auto w-full max-w-2xl text-center py-6">
          {isPaid ? (
            <Card className="p-8 border-emerald-500/30 shadow-md flex flex-col gap-6">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="size-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">¡Pago confirmado!</h2>
                <p className="text-sm text-muted-foreground">
                  Tu transacción ha sido procesada de manera exitosa en nuestros sistemas estudiantiles.
                </p>
              </div>
              <div className="border border-border/60 rounded-lg p-4 bg-muted/20 text-left space-y-3 text-sm">
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Comprobante N°</span>
                  <span className="font-mono font-semibold text-foreground">{simulatedReceiptNumber}</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Fecha / Hora</span>
                  <span className="font-semibold text-foreground">{currentDate}</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Concepto</span>
                  <span className="font-semibold text-foreground">Matrícula I Semestre 2026 - Saldo</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Método de pago</span>
                  <span className="font-semibold text-foreground">{getPaymentMethodLabel()}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-foreground">Monto Pagado</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(pendingAmount)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/finance/account" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 size-4 shrink-0" />
                    Volver al estado
                  </Button>
                </Link>
                <Link to="/finance/history" className="flex-1">
                  <Button className="w-full">
                    <Receipt className="mr-2 size-4 shrink-0" />
                    Ver historial de pagos
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="p-8 shadow-md flex flex-col gap-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Revisar pago</h2>
                <p className="text-sm text-muted-foreground">
                  Por favor verifica la información antes de proceder con el pago.
                </p>
              </div>
              <div className="border border-border/60 rounded-lg p-4 bg-muted/20 text-left space-y-3 text-sm">
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Concepto</span>
                  <span className="font-semibold text-foreground">Matrícula I Semestre 2026 - Saldo</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Método de pago</span>
                  <span className="font-semibold text-foreground">{getPaymentMethodLabel()}</span>
                </div>
                <div className="flex justify-between pt-1 text-base">
                  <span className="font-bold text-foreground">Total a pagar</span>
                  <span className="font-mono font-extrabold text-foreground">
                    {formatCurrency(pendingAmount)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="mr-2 size-4" />
                  Regresar
                </Button>
                <Button type="button" className="flex-1" onClick={handleConfirmPayment}>
                  Procesar pago
                </Button>
              </div>
            </Card>
          )}
        </div>
      ) : (
        /* Steps 1 and 2 */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Select payment method */}
            {currentStep === 1 && (
              <Card className="p-5 flex flex-col gap-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Selecciona el método de pago:
                </h3>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(val) => setPaymentMethod(val as any)}
                  className="w-full space-y-2"
                >
                  <FieldLabel
                    htmlFor="pay-card"
                    className={cn(
                      'block cursor-pointer rounded-lg border p-4 transition-all hover:bg-muted/10',
                      paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border bg-card'
                    )}
                  >
                    <Field orientation="horizontal" className="justify-between items-center w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-muted text-muted-foreground">
                          <CreditCard className="size-4.5" />
                        </div>
                        <FieldContent>
                          <FieldTitle className="font-semibold text-sm">Tarjeta</FieldTitle>
                          <FieldDescription className="text-xs text-muted-foreground">
                            Tarjeta de crédito o débito (Visa, MasterCard, AMEX)
                          </FieldDescription>
                        </FieldContent>
                      </div>
                      <RadioGroupItem value="card" id="pay-card" />
                    </Field>
                  </FieldLabel>

                  <FieldLabel
                    htmlFor="pay-sinpe"
                    className={cn(
                      'block cursor-pointer rounded-lg border p-4 transition-all hover:bg-muted/10',
                      paymentMethod === 'sinpe' ? 'border-primary bg-primary/5' : 'border-border bg-card'
                    )}
                  >
                    <Field orientation="horizontal" className="justify-between items-center w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-muted text-muted-foreground">
                          <Smartphone className="size-4.5" />
                        </div>
                        <FieldContent>
                          <FieldTitle className="font-semibold text-sm">SINPE Móvil</FieldTitle>
                          <FieldDescription className="text-xs text-muted-foreground">
                            Transferencia inmediata al teléfono institucional
                          </FieldDescription>
                        </FieldContent>
                      </div>
                      <RadioGroupItem value="sinpe" id="pay-sinpe" />
                    </Field>
                  </FieldLabel>

                  <FieldLabel
                    htmlFor="pay-bank"
                    className={cn(
                      'block cursor-pointer rounded-lg border p-4 transition-all hover:bg-muted/10',
                      paymentMethod === 'bank' ? 'border-primary bg-primary/5' : 'border-border bg-card'
                    )}
                  >
                    <Field orientation="horizontal" className="justify-between items-center w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-muted text-muted-foreground">
                          <Landmark className="size-4.5" />
                        </div>
                        <FieldContent>
                          <FieldTitle className="font-semibold text-sm">Transferencia bancaria</FieldTitle>
                          <FieldDescription className="text-xs text-muted-foreground">
                            Depósito bancario directo a cuenta de ahorros o IBAN
                          </FieldDescription>
                        </FieldContent>
                      </div>
                      <RadioGroupItem value="bank" id="pay-bank" />
                    </Field>
                  </FieldLabel>
                </RadioGroup>

                <Button onClick={handleGoToDetails} className="w-full h-10 font-semibold">
                  Continuar
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Card>
            )}

            {/* Step 2: Complete payment details */}
            {currentStep === 2 && (
              <form onSubmit={handleProcessPayment} className="space-y-6">
                <Card className="p-5 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {paymentMethod === 'card'
                        ? (showNewCardForm && mySavedCards.length > 0
                            ? (cardToEditId ? 'Editar tarjeta' : 'Nueva tarjeta')
                            : 'Pago con tarjeta')
                        : paymentMethod === 'sinpe'
                          ? 'Detalles de SINPE Móvil'
                          : 'Detalles de transferencia'}
                    </h3>
                    {paymentMethod === 'card' && showNewCardForm && mySavedCards.length > 0 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setShowNewCardForm(false)
                          setCardToEditId(null)
                          setSelectedCardId(mySavedCards.find((c) => c.isDefault)?.id || mySavedCards[0]?.id || '')
                        }}
                        className="-my-2 h-8 text-xs font-semibold px-2 hover:bg-muted"
                      >
                        <ArrowLeft className="mr-1.5 size-3.5" />
                        Tarjetas guardadas
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setCurrentStep(1)}
                        className="-my-2 h-8 text-xs font-semibold px-2 hover:bg-muted"
                      >
                        <ArrowLeft className="mr-1.5 size-3.5" />
                        Cambiar método
                      </Button>
                    )}
                  </div>

                  {paymentMethod === 'card' ? (
                    <CardPaymentSection
                      savedCards={mySavedCards}
                      setSavedCards={setMySavedCards}
                      selectedCardId={selectedCardId}
                      setSelectedCardId={setSelectedCardId}
                      showNewCardForm={showNewCardForm}
                      setShowNewCardForm={setShowNewCardForm}
                      saveNewCard={saveNewCard}
                      setSaveNewCard={setSaveNewCard}
                      cardNumber={cardNumber}
                      setCardNumber={setCardNumber}
                      cardExpiry={cardExpiry}
                      setCardExpiry={setCardExpiry}
                      cardCvv={cardCvv}
                      setCardCvv={setCardCvv}
                      cardName={cardName}
                      setCardName={setCardName}
                      cardToEditId={cardToEditId}
                      setCardToEditId={setCardToEditId}
                    />
                  ) : paymentMethod === 'sinpe' ? (
                    <div className="space-y-4">
                      <div className="rounded-xl bg-muted/40 border border-border p-5 text-sm">
                        <h4 className="font-semibold text-foreground mb-4">Detalles de transferencia</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-border/40 pb-2">
                            <span className="text-muted-foreground">Teléfono SINPE</span>
                            <span className="font-medium text-foreground font-mono select-all">8888-9999</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-border/40 pb-2">
                            <span className="text-muted-foreground">A nombre de</span>
                            <span className="font-medium text-foreground">Universidad Tecnológica La Mejor</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-border/40 pb-2">
                            <span className="text-muted-foreground">Monto a enviar</span>
                            <span className="font-medium text-foreground">{formatCurrency(pendingAmount)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Concepto</span>
                            <span className="font-medium text-foreground">2024143009</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-5 text-xs leading-relaxed">
                          Transfiere el monto exacto al número indicado arriba. Tu pago será procesado y aplicado una vez que se verifique el comprobante.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel htmlFor="sinpe-phone">Teléfono de origen (Emisor)</FieldLabel>
                          <Input
                            id="sinpe-phone"
                            placeholder="8888-8888"
                            maxLength={9}
                            value={sinpePhone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '')
                              setSinpePhone(val.length > 4 ? `${val.slice(0, 4)}-${val.slice(4, 8)}` : val)
                            }}
                            required
                          />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="sinpe-ref">Número de Referencia / Comprobante</FieldLabel>
                          <Input
                            id="sinpe-ref"
                            placeholder="Ej: 98741022"
                            value={sinpeReference}
                            onChange={(e) => setSinpeReference(e.target.value)}
                            required
                          />
                        </Field>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-xl bg-muted/40 border border-border p-5 text-sm">
                        <h4 className="font-semibold text-foreground mb-4">Detalles de transferencia</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-border/40 pb-2">
                            <span className="text-muted-foreground">Nombre del banco</span>
                            <span className="font-medium text-foreground">Banco Nacional de Costa Rica</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-border/40 pb-2">
                            <span className="text-muted-foreground">Cuenta IBAN</span>
                            <span className="font-medium text-foreground font-mono select-all">CR12012345678901234567</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-border/40 pb-2">
                            <span className="text-muted-foreground">Cédula jurídica</span>
                            <span className="font-medium text-foreground">3-101-998877</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Concepto</span>
                            <span className="font-medium text-foreground">2024143009</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-5 text-xs leading-relaxed">
                          Transfiere el monto exacto a la cuenta bancaria indicada arriba. El pago puede tardar de 1 a 2 días hábiles en verse reflejado en el sistema.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel htmlFor="bank-emitter">Banco de origen</FieldLabel>
                          <Input
                            id="bank-emitter"
                            placeholder="Ej: BCR, BAC, BNCR"
                            value={bankEmitter}
                            onChange={(e) => setBankEmitter(e.target.value)}
                            required
                          />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="bank-ref">Número de referencia bancaria</FieldLabel>
                          <Input
                            id="bank-ref"
                            placeholder="Ej: DEP-7482910"
                            value={bankReference}
                            onChange={(e) => setBankReference(e.target.value)}
                            required
                          />
                        </Field>
                      </div>
                    </div>
                  )}
                </Card>

                {!cardToEditId ? (
                  <Button 
                    type="submit" 
                    className="w-full h-11 font-semibold text-base shadow-sm"
                    disabled={!isPaymentFormValid}
                  >
                    Continuar
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="w-full h-11 font-semibold text-base shadow-sm"
                    onClick={(e) => {
                      e.preventDefault()
                      if (!cardNumber || !cardExpiry || !cardName) {
                        toast.error('Datos incompletos', { description: 'Por favor completa todos los campos requeridos.' })
                        return
                      }
                      toast.success('Tarjeta actualizada', { description: 'Los cambios de tu tarjeta han sido guardados.' })
                      setShowNewCardForm(false)
                      setCardToEditId(null)
                      setSelectedCardId(cardToEditId)
                    }}
                  >
                    Guardar cambios
                  </Button>
                )}
              </form>
            )}
          </div>

          {/* Right Column: Invoice summary */}
          <div className="space-y-4">
            <Card className="p-6 flex flex-col gap-6 border-border shadow-xs sticky top-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Resumen de cobro
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Concepto</span>
                  <span className="font-medium text-foreground text-right">Matrícula I Semestre 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">Cobro pendiente</span>
                </div>
                <hr className="border-border/60" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aranceles matrícula</span>
                  <span className="font-mono">{formatCurrency(6000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fondo bienestar estudiantil</span>
                  <span className="font-mono">{formatCurrency(3060.55)}</span>
                </div>
                <hr className="border-border/60" />
                <div className="flex justify-between text-base">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-mono font-extrabold text-foreground">{formatCurrency(pendingAmount)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

/* ==========================================================================
   Card Payment Section — Saved cards + New card form
   ========================================================================== */
function CardPaymentSection({
  savedCards,
  setSavedCards,
  selectedCardId,
  setSelectedCardId,
  showNewCardForm,
  setShowNewCardForm,
  saveNewCard,
  setSaveNewCard,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  cardName,
  setCardName,
  cardToEditId,
  setCardToEditId,
}: {
  savedCards: SavedCard[]
  setSavedCards: (cards: SavedCard[]) => void
  selectedCardId: string
  setSelectedCardId: (id: string) => void
  showNewCardForm: boolean
  setShowNewCardForm: (show: boolean) => void
  saveNewCard: boolean
  setSaveNewCard: (save: boolean) => void
  cardNumber: string
  setCardNumber: (val: string) => void
  cardExpiry: string
  setCardExpiry: (val: string) => void
  cardCvv: string
  setCardCvv: (val: string) => void
  cardName: string
  setCardName: (val: string) => void
  cardToEditId: string | null
  setCardToEditId: (id: string | null) => void
}) {
  const hasSavedCards = savedCards.length > 0
  const [cardToDelete, setCardToDelete] = useState<string | null>(null)

  const handleDeleteConfirm = () => {
    if (!cardToDelete) return
    setSavedCards(savedCards.filter((c) => c.id !== cardToDelete))
    if (selectedCardId === cardToDelete) {
      const remaining = savedCards.filter((c) => c.id !== cardToDelete)
      setSelectedCardId(remaining.find((c) => c.isDefault)?.id || remaining[0]?.id || '')
      if (remaining.length === 0) {
        setShowNewCardForm(true)
      }
    }
    toast.success('Tarjeta eliminada', {
      description: 'La tarjeta ha sido removida de tus métodos guardados.',
    })
    setCardToDelete(null)
  }

  // If no saved cards, always show the new card form
  if (!hasSavedCards) {
    return (
      <div className="space-y-5">
        <NewCardForm
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          cardExpiry={cardExpiry}
          setCardExpiry={setCardExpiry}
          cardCvv={cardCvv}
          setCardCvv={setCardCvv}
          cardName={cardName}
          setCardName={setCardName}
          saveNewCard={saveNewCard}
          setSaveNewCard={setSaveNewCard}
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Saved Cards List */}
      {!showNewCardForm && (
        <div className="space-y-3">
          <RadioGroup
            value={selectedCardId}
            onValueChange={(val) => setSelectedCardId(val)}
            className="w-full space-y-2"
          >
            {savedCards.map((card) => (
              <FieldLabel
                key={card.id}
                htmlFor={`saved-${card.id}`}
                className={cn(
                  'block cursor-pointer rounded-xl border p-4 transition-all hover:bg-muted/10',
                  selectedCardId === card.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card'
                )}
              >
                <Field orientation="horizontal" className="items-center w-full">
                  <RadioGroupItem value={card.id} id={`saved-${card.id}`} className="mr-3" />
                  <div className="flex items-center gap-4 flex-1">
                    {/* Card Brand Visual */}
                    <div className="flex w-10 shrink-0 items-center justify-center">
                      <PaymentIcon
                        type={card.brand === 'Visa' ? 'visa' : 'mastercard'}
                        format="flatRounded"
                        className="w-full h-auto"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {card.brand} •••• {card.last4}
                        </span>
                        {card.isDefault && (
                          <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-bold">
                            Principal
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {card.holder} • Exp. {card.expiry}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          setCardNumber(`**** **** **** ${card.last4}`)
                          setCardName(card.holder)
                          setCardExpiry(card.expiry)
                          setCardCvv('')
                          setCardToEditId(card.id)
                          setShowNewCardForm(true)
                        }}>
                          <Pencil className="mr-2 size-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          const updated = savedCards.map(c => ({
                            ...c,
                            isDefault: c.id === card.id
                          }))
                          setSavedCards(updated)
                          toast.success('Tarjeta principal actualizada', {
                            description: `La tarjeta terminada en ${card.last4} ahora es la predeterminada.`,
                          })
                        }}>
                          <Star className="mr-2 size-4" />
                          Marcar como principal
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          onClick={(e) => { e.stopPropagation(); setCardToDelete(card.id) }}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>

          <Dialog open={!!cardToDelete} onOpenChange={(open) => !open && setCardToDelete(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Eliminar tarjeta?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. La tarjeta será removida de tus métodos de pago guardados.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCardToDelete(null)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDeleteConfirm}>
                  Eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add New Card Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-10 text-sm font-semibold border-dashed"
            onClick={() => {
              setShowNewCardForm(true)
              setSelectedCardId('')
              setCardToEditId(null)
              setCardNumber('')
              setCardName('')
              setCardExpiry('')
              setCardCvv('')
            }}
          >
            <Plus className="mr-2 size-4" />
            Agregar nueva tarjeta
          </Button>
        </div>
      )}

      {/* New Card Form */}
      {showNewCardForm && (
        <div className="space-y-5">
          <NewCardForm
            cardNumber={cardNumber}
            setCardNumber={setCardNumber}
            cardExpiry={cardExpiry}
            setCardExpiry={setCardExpiry}
            cardCvv={cardCvv}
            setCardCvv={setCardCvv}
            cardName={cardName}
            setCardName={setCardName}
            saveNewCard={saveNewCard}
            setSaveNewCard={setSaveNewCard}
            isEditing={!!cardToEditId}
          />
        </div>
      )}
    </div>
  )
}

/* ==========================================================================
   New Card Form - Premium card input with visual preview
   ========================================================================== */
function NewCardForm({
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  cardName,
  setCardName,
  saveNewCard,
  setSaveNewCard,
  isEditing,
}: {
  cardNumber: string
  setCardNumber: (val: string) => void
  cardExpiry: string
  setCardExpiry: (val: string) => void
  cardCvv: string
  setCardCvv: (val: string) => void
  cardName: string
  setCardName: (val: string) => void
  saveNewCard: boolean
  setSaveNewCard: (val: boolean) => void
  isEditing?: boolean
}) {
  const rawDigits = cardNumber.replace(/\s/g, '')
  const isVisa = rawDigits.startsWith('4')
  const isMC = rawDigits.startsWith('5') || rawDigits.startsWith('2')

  return (
    <div className="space-y-5">
      {/* Mini Card Preview */}
      <div
        className={cn(
          'relative w-full max-w-xs mx-auto aspect-[1.586/1] rounded-2xl p-5 flex flex-col justify-between text-white overflow-hidden select-none shadow-lg',
          isVisa
            ? 'bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900'
            : isMC
              ? 'bg-gradient-to-br from-red-600 via-red-700 to-orange-600'
              : 'bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900'
        )}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-[-20%] top-[-30%] size-[80%] rounded-full bg-white/20" />
          <div className="absolute left-[-10%] bottom-[-40%] size-[60%] rounded-full bg-white/10" />
        </div>

        {/* Chip & Brand */}
        <div className="flex items-start justify-between relative z-10">
          <div className="size-9 rounded-md bg-gradient-to-br from-amber-300 to-amber-500 opacity-80" />
          <span className="text-sm font-extrabold italic tracking-tight opacity-90">
            {isVisa ? 'VISA' : isMC ? 'Mastercard' : 'Card'}
          </span>
        </div>

        {/* Number */}
        <div className="relative z-10 font-mono text-base sm:text-lg tracking-[0.15em] font-medium">
          {rawDigits.length > 0
            ? rawDigits.replace(/(.{4})/g, '$1 ').trim()
            : '•••• •••• •••• ••••'}
        </div>

        {/* Name & Expiry */}
        <div className="flex items-end justify-between relative z-10">
          <div>
            <span className="block text-[8px] uppercase tracking-widest opacity-60">Titular</span>
            <span className="block text-xs font-semibold truncate max-w-[140px]">
              {cardName || 'TU NOMBRE'}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[8px] uppercase tracking-widest opacity-60">Exp.</span>
            <span className="block text-xs font-semibold font-mono">
              {cardExpiry || 'MM/AA'}
            </span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <Field>
          <FieldLabel htmlFor="new-card-name">Nombre del titular</FieldLabel>
          <Input
            id="new-card-name"
            placeholder="Nombre exacto en la tarjeta"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="new-card-number">Número de tarjeta</FieldLabel>
          <div className="relative">
            <Input
              id="new-card-number"
              placeholder="XXXX XXXX XXXX XXXX"
              maxLength={19}
              value={cardNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
                setCardNumber(val)
              }}
              required
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <CreditCard className="size-4" />
            </div>
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="new-card-expiry">Expiración</FieldLabel>
            <Input
              id="new-card-expiry"
              placeholder="MM/AA"
              maxLength={5}
              value={cardExpiry}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, '')
                if (val.length > 2) {
                  val = val.substring(0, 2) + '/' + val.substring(2, 4)
                }
                setCardExpiry(val)
              }}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-card-cvv">CVV</FieldLabel>
            <Input
              id="new-card-cvv"
              placeholder="123"
              type="password"
              maxLength={4}
              value={cardCvv}
              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
              required
            />
          </Field>
        </div>

        {/* Save card option */}
        {!isEditing && (
          <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
            <Checkbox
              checked={saveNewCard}
              onCheckedChange={(val) => setSaveNewCard(val === true)}
            />
            <span className="text-sm text-muted-foreground">Guardar datos de tarjeta para futuros pagos</span>
          </label>
        )}

        {/* Security note */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
          <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
          <span>Tu información de pago se transmite de forma segura.</span>
        </div>
      </div>
    </div>
  )
}
