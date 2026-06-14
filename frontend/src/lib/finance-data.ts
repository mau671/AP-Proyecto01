export interface PaymentHistoryItem {
  id: string
  date: string
  concept: string
  period: string
  method: string
  reference: string
  amount: number
}

export interface OtherChargeItem {
  id: string
  category: 'Biblioteca' | 'Fotocopias e impresiones' | 'Servicios estudiantiles' | 'Laboratorios'
  concept: string
  date: string
  status: 'Pendiente' | 'Pagado'
  amount: number
}

export const paymentHistory: PaymentHistoryItem[] = [
  {
    id: 'pay-001',
    date: '2025-07-20',
    concept: 'Pago Matrícula y Cargos',
    period: '2025 - Semestre II',
    method: 'Tarjeta de Crédito (Visa *4321)',
    reference: 'REF-88392019',
    amount: 150000.00,
  },
  {
    id: 'pay-002',
    date: '2025-12-15',
    concept: 'Pago Matrícula Curso de Verano',
    period: '2025 - Verano I',
    method: 'Transferencia SINPE Móvil',
    reference: 'SINPE-9904221',
    amount: 45000.00,
  },
  {
    id: 'pay-003',
    date: '2025-02-12',
    concept: 'Pago Matrícula y Cargos',
    period: '2025 - Semestre I',
    method: 'Tarjeta de Débito (MasterCard *9876)',
    reference: 'REF-33491822',
    amount: 140000.00,
  },
  {
    id: 'pay-004',
    date: '2024-07-22',
    concept: 'Pago Matrícula y Cargos',
    period: '2024 - Semestre II',
    method: 'Transferencia SINPE Móvil',
    reference: 'SINPE-7728491',
    amount: 135000.00,
  },
]

export const otherCharges: OtherChargeItem[] = [
  // Biblioteca
  {
    id: 'chg-001',
    category: 'Biblioteca',
    concept: 'Multa por entrega tardía - Libro "Introduction to Algorithms"',
    date: '2026-04-10',
    status: 'Pendiente',
    amount: 1500.00,
  },
  {
    id: 'chg-002',
    category: 'Biblioteca',
    concept: 'Reposición de carné de biblioteca',
    date: '2025-10-14',
    status: 'Pagado',
    amount: 2500.00,
  },
  // Fotocopias e impresiones
  {
    id: 'chg-003',
    category: 'Fotocopias e impresiones',
    concept: 'Impresiones en laboratorio de cómputo (30 páginas)',
    date: '2026-05-18',
    status: 'Pendiente',
    amount: 900.00,
  },
  {
    id: 'chg-004',
    category: 'Fotocopias e impresiones',
    concept: 'Fotocopias antología de Lenguajes de Programación',
    date: '2025-08-05',
    status: 'Pagado',
    amount: 3400.00,
  },
  // Servicios estudiantiles
  {
    id: 'chg-005',
    category: 'Servicios estudiantiles',
    concept: 'Certificación de materias aprobadas',
    date: '2026-06-01',
    status: 'Pendiente',
    amount: 5000.00,
  },
  {
    id: 'chg-006',
    category: 'Servicios estudiantiles',
    concept: 'Constancia de estudiante regular',
    date: '2026-02-10',
    status: 'Pagado',
    amount: 2000.00,
  },
  // Laboratorios
  {
    id: 'chg-007',
    category: 'Laboratorios',
    concept: 'Reposición de cable Ethernet dañado (Lab de Redes)',
    date: '2026-05-22',
    status: 'Pendiente',
    amount: 3000.00,
  },
  {
    id: 'chg-008',
    category: 'Laboratorios',
    concept: 'Materiales especiales para laboratorio de Circuitos',
    date: '2025-03-04',
    status: 'Pagado',
    amount: 7500.00,
  },
]

export const paymentMethods = [
  { id: 'card', name: 'Tarjeta de crédito/débito', description: 'Visa, MasterCard, AMEX' },
  { id: 'sinpe', name: 'SINPE Móvil / Transferencia', description: 'Pago inmediato al 8888-9999' },
]
