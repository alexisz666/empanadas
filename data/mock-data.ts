// =============================================
// MOCK DATA - Empanadas Business Management
// =============================================
// Este archivo contiene todos los datos mock centralizados.
// Reemplazar estos datos por llamadas a API cuando se conecte a MongoDB.

// =============================================
// TIPOS DE DATOS
// =============================================

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: 'empanada' | 'bebida' | 'combo' | 'extra'
  type?: 'carne' | 'pollo' | 'mixta' | 'vegetariana'
  image: string
  isAvailable: boolean
  totalSold: number
}

export interface Client {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
  isFrequent: boolean
  createdAt: string
}

export interface Order {
  id: string
  clientId: string
  clientName: string
  clientPhone: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
  type: 'individual' | 'event'
  deliveryMethod: 'pickup' | 'delivery'
  deliveryAddress?: string
  paymentMethod: 'cash' | 'card' | 'transfer'
  isPaid: boolean
  isUrgent: boolean
  notes?: string
  createdAt: string
  estimatedDeliveryTime?: string
  deliveryPersonId?: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface DeliveryPerson {
  id: string
  name: string
  phone: string
  isActive: boolean
  currentOrders: number
  totalDeliveries: number
  averageDeliveryTime: number // in minutes
}

export interface Campaign {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: 'draft' | 'scheduled' | 'active' | 'completed'
  type: 'discount' | 'combo' | 'seasonal' | 'event'
  discount?: number
  reachedPeople: number
  usedBy: number
  messageTemplate?: string
}

export interface InventoryItem {
  id: string
  name: string
  category: 'ingredient' | 'packaging' | 'supply'
  currentStock: number
  minStock: number
  unit: string
  unitCost: number
  supplier: string
  lastRestockDate: string
  isLowStock: boolean
}

export interface Review {
  id: string
  clientId: string
  clientName: string
  orderId: string
  productRating: number
  deliveryRating: number
  comment: string
  isPositive: boolean
  createdAt: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  image: string
  description: string
}

export interface DashboardMetrics {
  salesToday: number
  salesMonth: number
  salesYear: number
  ordersToday: number
  ordersMonth: number
  ordersYear: number
  averageOrderValue: number
  empanadasSoldToday: number
  empanadasSoldMonth: number
  empanadasSoldYear: number
  totalClients: number
  newClientsMonth: number
  pendingOrders: number
  averageDeliveryTime: number
}

// =============================================
// PRODUCTOS
// =============================================

export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Empanada de Carne',
    description: 'Deliciosa empanada rellena de carne molida sazonada con especias colombianas',
    price: 25,
    category: 'empanada',
    type: 'carne',
    image: '/images/empanada-carne.jpg',
    isAvailable: true,
    totalSold: 15420,
  },
  {
    id: 'prod-002',
    name: 'Empanada de Pollo',
    description: 'Empanada rellena de pollo desmenuzado con hogao tradicional',
    price: 25,
    category: 'empanada',
    type: 'pollo',
    image: '/images/empanada-pollo.jpg',
    isAvailable: true,
    totalSold: 12350,
  },
  {
    id: 'prod-003',
    name: 'Empanada Mixta',
    description: 'Lo mejor de dos mundos: carne y pollo en una sola empanada',
    price: 28,
    category: 'empanada',
    type: 'mixta',
    image: '/images/empanada-mixta.jpg',
    isAvailable: true,
    totalSold: 8920,
  },
  {
    id: 'prod-004',
    name: 'Empanada Vegetariana',
    description: 'Rellena de champiñones, papa y verduras salteadas',
    price: 28,
    category: 'empanada',
    type: 'vegetariana',
    image: '/images/empanada-veggie.jpg',
    isAvailable: true,
    totalSold: 3250,
  },
  {
    id: 'prod-005',
    name: 'Agua de Jamaica',
    description: 'Bebida refrescante de flor de jamaica',
    price: 15,
    category: 'bebida',
    image: '/images/jamaica.jpg',
    isAvailable: true,
    totalSold: 6780,
  },
  {
    id: 'prod-006',
    name: 'Combo Familiar',
    description: '12 empanadas surtidas + 2 litros de agua fresca',
    price: 280,
    category: 'combo',
    image: '/images/combo-familiar.jpg',
    isAvailable: true,
    totalSold: 1890,
  },
]

// =============================================
// CLIENTES
// =============================================

export const mockClients: Client[] = [
  {
    id: 'cli-001',
    name: 'María García',
    phone: '+52 656 123 4567',
    email: 'maria.garcia@email.com',
    address: 'Col. Centro, Av. Juárez 123',
    totalOrders: 45,
    totalSpent: 4520,
    lastOrderDate: '2026-04-07',
    isFrequent: true,
    createdAt: '2025-01-15',
  },
  {
    id: 'cli-002',
    name: 'Carlos Rodríguez',
    phone: '+52 656 234 5678',
    email: 'carlos.rod@email.com',
    address: 'Col. Nogales, Calle 5 #456',
    totalOrders: 38,
    totalSpent: 3890,
    lastOrderDate: '2026-04-06',
    isFrequent: true,
    createdAt: '2025-02-20',
  },
  {
    id: 'cli-003',
    name: 'Ana Martínez',
    phone: '+52 656 345 6789',
    address: 'Col. Partido Romero, Av. Tecnológico 789',
    totalOrders: 32,
    totalSpent: 3450,
    lastOrderDate: '2026-04-08',
    isFrequent: true,
    createdAt: '2025-03-10',
  },
  {
    id: 'cli-004',
    name: 'Roberto Sánchez',
    phone: '+52 656 456 7890',
    totalOrders: 28,
    totalSpent: 2980,
    lastOrderDate: '2026-04-05',
    isFrequent: true,
    createdAt: '2025-04-05',
  },
  {
    id: 'cli-005',
    name: 'Laura Hernández',
    phone: '+52 656 567 8901',
    email: 'laura.h@email.com',
    address: 'Col. Bellavista, Calle Roble 234',
    totalOrders: 25,
    totalSpent: 2650,
    lastOrderDate: '2026-04-04',
    isFrequent: true,
    createdAt: '2025-05-12',
  },
  {
    id: 'cli-006',
    name: 'Fernando López',
    phone: '+52 656 678 9012',
    totalOrders: 22,
    totalSpent: 2340,
    lastOrderDate: '2026-04-03',
    isFrequent: true,
    createdAt: '2025-06-18',
  },
  {
    id: 'cli-007',
    name: 'Patricia Díaz',
    phone: '+52 656 789 0123',
    totalOrders: 18,
    totalSpent: 1890,
    lastOrderDate: '2026-04-02',
    isFrequent: false,
    createdAt: '2025-07-22',
  },
  {
    id: 'cli-008',
    name: 'Miguel Torres',
    phone: '+52 656 890 1234',
    totalOrders: 15,
    totalSpent: 1560,
    lastOrderDate: '2026-04-01',
    isFrequent: false,
    createdAt: '2025-08-30',
  },
  {
    id: 'cli-009',
    name: 'Sofía Ramírez',
    phone: '+52 656 901 2345',
    totalOrders: 12,
    totalSpent: 1280,
    lastOrderDate: '2026-03-28',
    isFrequent: false,
    createdAt: '2025-09-14',
  },
  {
    id: 'cli-010',
    name: 'Daniel Flores',
    phone: '+52 656 012 3456',
    totalOrders: 8,
    totalSpent: 890,
    lastOrderDate: '2026-03-25',
    isFrequent: false,
    createdAt: '2025-10-08',
  },
  {
    id: 'cli-011',
    name: 'Isabel Moreno',
    phone: '+52 656 111 2222',
    totalOrders: 5,
    totalSpent: 520,
    lastOrderDate: '2026-03-20',
    isFrequent: false,
    createdAt: '2026-01-05',
  },
  {
    id: 'cli-012',
    name: 'Andrés Castillo',
    phone: '+52 656 222 3333',
    totalOrders: 3,
    totalSpent: 310,
    lastOrderDate: '2026-03-15',
    isFrequent: false,
    createdAt: '2026-02-12',
  },
]

// =============================================
// PEDIDOS
// =============================================

export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    clientId: 'cli-003',
    clientName: 'Ana Martínez',
    clientPhone: '+52 656 345 6789',
    items: [
      { productId: 'prod-001', productName: 'Empanada de Carne', quantity: 6, unitPrice: 25, subtotal: 150 },
      { productId: 'prod-002', productName: 'Empanada de Pollo', quantity: 6, unitPrice: 25, subtotal: 150 },
      { productId: 'prod-005', productName: 'Agua de Jamaica', quantity: 2, unitPrice: 15, subtotal: 30 },
    ],
    total: 330,
    status: 'pending',
    type: 'individual',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Col. Partido Romero, Av. Tecnológico 789',
    paymentMethod: 'transfer',
    isPaid: true,
    isUrgent: false,
    createdAt: '2026-04-08T10:30:00',
    estimatedDeliveryTime: '2026-04-08T11:30:00',
  },
  {
    id: 'ord-002',
    clientId: 'cli-001',
    clientName: 'María García',
    clientPhone: '+52 656 123 4567',
    items: [
      { productId: 'prod-006', productName: 'Combo Familiar', quantity: 1, unitPrice: 280, subtotal: 280 },
    ],
    total: 280,
    status: 'preparing',
    type: 'individual',
    deliveryMethod: 'pickup',
    paymentMethod: 'cash',
    isPaid: false,
    isUrgent: false,
    createdAt: '2026-04-08T10:15:00',
    estimatedDeliveryTime: '2026-04-08T11:00:00',
  },
  {
    id: 'ord-003',
    clientId: 'cli-002',
    clientName: 'Carlos Rodríguez',
    clientPhone: '+52 656 234 5678',
    items: [
      { productId: 'prod-001', productName: 'Empanada de Carne', quantity: 50, unitPrice: 22, subtotal: 1100 },
      { productId: 'prod-002', productName: 'Empanada de Pollo', quantity: 50, unitPrice: 22, subtotal: 1100 },
    ],
    total: 2200,
    status: 'pending',
    type: 'event',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Salón de Eventos Los Arcos, Col. Centro',
    paymentMethod: 'transfer',
    isPaid: true,
    isUrgent: true,
    notes: 'Evento empresarial - Entregar a las 2:00 PM',
    createdAt: '2026-04-08T08:00:00',
    estimatedDeliveryTime: '2026-04-08T14:00:00',
    deliveryPersonId: 'del-001',
  },
  {
    id: 'ord-004',
    clientId: 'cli-005',
    clientName: 'Laura Hernández',
    clientPhone: '+52 656 567 8901',
    items: [
      { productId: 'prod-003', productName: 'Empanada Mixta', quantity: 4, unitPrice: 28, subtotal: 112 },
      { productId: 'prod-004', productName: 'Empanada Vegetariana', quantity: 2, unitPrice: 28, subtotal: 56 },
    ],
    total: 168,
    status: 'ready',
    type: 'individual',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Col. Bellavista, Calle Roble 234',
    paymentMethod: 'card',
    isPaid: true,
    isUrgent: false,
    createdAt: '2026-04-08T09:45:00',
    estimatedDeliveryTime: '2026-04-08T10:45:00',
    deliveryPersonId: 'del-002',
  },
  {
    id: 'ord-005',
    clientId: 'cli-007',
    clientName: 'Patricia Díaz',
    clientPhone: '+52 656 789 0123',
    items: [
      { productId: 'prod-001', productName: 'Empanada de Carne', quantity: 3, unitPrice: 25, subtotal: 75 },
      { productId: 'prod-002', productName: 'Empanada de Pollo', quantity: 3, unitPrice: 25, subtotal: 75 },
    ],
    total: 150,
    status: 'delivering',
    type: 'individual',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Col. Las Fuentes, Av. Principal 567',
    paymentMethod: 'cash',
    isPaid: false,
    isUrgent: false,
    createdAt: '2026-04-08T09:00:00',
    estimatedDeliveryTime: '2026-04-08T10:00:00',
    deliveryPersonId: 'del-001',
  },
  {
    id: 'ord-006',
    clientId: 'cli-004',
    clientName: 'Roberto Sánchez',
    clientPhone: '+52 656 456 7890',
    items: [
      { productId: 'prod-001', productName: 'Empanada de Carne', quantity: 8, unitPrice: 25, subtotal: 200 },
    ],
    total: 200,
    status: 'delivered',
    type: 'individual',
    deliveryMethod: 'pickup',
    paymentMethod: 'cash',
    isPaid: true,
    isUrgent: false,
    createdAt: '2026-04-08T08:30:00',
  },
]

// =============================================
// REPARTIDORES
// =============================================

export const mockDeliveryPersons: DeliveryPerson[] = [
  {
    id: 'del-001',
    name: 'Juan Pérez',
    phone: '+52 656 111 0001',
    isActive: true,
    currentOrders: 2,
    totalDeliveries: 1245,
    averageDeliveryTime: 28,
  },
  {
    id: 'del-002',
    name: 'Pedro Gómez',
    phone: '+52 656 111 0002',
    isActive: true,
    currentOrders: 1,
    totalDeliveries: 987,
    averageDeliveryTime: 32,
  },
  {
    id: 'del-003',
    name: 'Luis Mendoza',
    phone: '+52 656 111 0003',
    isActive: false,
    currentOrders: 0,
    totalDeliveries: 756,
    averageDeliveryTime: 35,
  },
]

// =============================================
// CAMPAÑAS Y PROMOCIONES
// =============================================

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-001',
    name: 'Martes de Empanadas',
    description: '2x1 en empanadas de carne todos los martes',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    status: 'active',
    type: 'discount',
    discount: 50,
    reachedPeople: 2450,
    usedBy: 189,
    messageTemplate: '¡Hola! Este martes disfruta de nuestras empanadas 2x1. ¡Te esperamos!',
  },
  {
    id: 'camp-002',
    name: 'Combo Oficina',
    description: 'Combo especial para empresas: 24 empanadas + 3L de bebida',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    status: 'active',
    type: 'combo',
    reachedPeople: 890,
    usedBy: 45,
    messageTemplate: '¡Pide el Combo Oficina para tu equipo! 24 empanadas + bebida por solo $480',
  },
  {
    id: 'camp-003',
    name: 'Semana Santa',
    description: 'Empanadas vegetarianas con 15% de descuento',
    startDate: '2026-04-13',
    endDate: '2026-04-20',
    status: 'scheduled',
    type: 'seasonal',
    discount: 15,
    reachedPeople: 0,
    usedBy: 0,
    messageTemplate: '¡Celebra Semana Santa con nuestras empanadas vegetarianas! 15% OFF',
  },
  {
    id: 'camp-004',
    name: 'Lanzamiento Invierno',
    description: 'Promoción especial de lanzamiento de nuevos sabores',
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    status: 'completed',
    type: 'seasonal',
    discount: 20,
    reachedPeople: 3200,
    usedBy: 287,
  },
]

// =============================================
// INVENTARIO
// =============================================

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv-001',
    name: 'Harina de maíz',
    category: 'ingredient',
    currentStock: 25,
    minStock: 10,
    unit: 'kg',
    unitCost: 45,
    supplier: 'Distribuidora La Norteña',
    lastRestockDate: '2026-04-05',
    isLowStock: false,
  },
  {
    id: 'inv-002',
    name: 'Carne molida',
    category: 'ingredient',
    currentStock: 8,
    minStock: 15,
    unit: 'kg',
    unitCost: 180,
    supplier: 'Carnicería Don José',
    lastRestockDate: '2026-04-07',
    isLowStock: true,
  },
  {
    id: 'inv-003',
    name: 'Pollo desmenuzado',
    category: 'ingredient',
    currentStock: 12,
    minStock: 10,
    unit: 'kg',
    unitCost: 120,
    supplier: 'Avícola del Norte',
    lastRestockDate: '2026-04-06',
    isLowStock: false,
  },
  {
    id: 'inv-004',
    name: 'Papa',
    category: 'ingredient',
    currentStock: 30,
    minStock: 20,
    unit: 'kg',
    unitCost: 25,
    supplier: 'Central de Abastos',
    lastRestockDate: '2026-04-04',
    isLowStock: false,
  },
  {
    id: 'inv-005',
    name: 'Aceite vegetal',
    category: 'ingredient',
    currentStock: 5,
    minStock: 8,
    unit: 'L',
    unitCost: 55,
    supplier: 'Distribuidora La Norteña',
    lastRestockDate: '2026-04-03',
    isLowStock: true,
  },
  {
    id: 'inv-006',
    name: 'Bolsas de papel',
    category: 'packaging',
    currentStock: 500,
    minStock: 200,
    unit: 'piezas',
    unitCost: 0.5,
    supplier: 'Empaques del Norte',
    lastRestockDate: '2026-04-01',
    isLowStock: false,
  },
  {
    id: 'inv-007',
    name: 'Servilletas',
    category: 'supply',
    currentStock: 150,
    minStock: 300,
    unit: 'paquetes',
    unitCost: 15,
    supplier: 'Empaques del Norte',
    lastRestockDate: '2026-03-28',
    isLowStock: true,
  },
  {
    id: 'inv-008',
    name: 'Salsa picante',
    category: 'ingredient',
    currentStock: 20,
    minStock: 15,
    unit: 'botellas',
    unitCost: 35,
    supplier: 'Salsas Regionales',
    lastRestockDate: '2026-04-02',
    isLowStock: false,
  },
]

// =============================================
// RESEÑAS Y OPINIONES
// =============================================

export const mockReviews: Review[] = [
  {
    id: 'rev-001',
    clientId: 'cli-001',
    clientName: 'María García',
    orderId: 'ord-prev-001',
    productRating: 5,
    deliveryRating: 5,
    comment: '¡Las mejores empanadas de Ciudad Juárez! Siempre frescas y deliciosas.',
    isPositive: true,
    createdAt: '2026-04-06',
  },
  {
    id: 'rev-002',
    clientId: 'cli-002',
    clientName: 'Carlos Rodríguez',
    orderId: 'ord-prev-002',
    productRating: 5,
    deliveryRating: 4,
    comment: 'Excelente sabor, el pedido llegó 10 minutos tarde pero todo muy bien.',
    isPositive: true,
    createdAt: '2026-04-05',
  },
  {
    id: 'rev-003',
    clientId: 'cli-003',
    clientName: 'Ana Martínez',
    orderId: 'ord-prev-003',
    productRating: 4,
    deliveryRating: 5,
    comment: 'Muy ricas, la entrega fue súper rápida. Volveré a pedir.',
    isPositive: true,
    createdAt: '2026-04-04',
  },
  {
    id: 'rev-004',
    clientId: 'cli-007',
    clientName: 'Patricia Díaz',
    orderId: 'ord-prev-004',
    productRating: 3,
    deliveryRating: 4,
    comment: 'Estaban un poco frías, pero el sabor estuvo bien.',
    isPositive: false,
    createdAt: '2026-04-03',
  },
  {
    id: 'rev-005',
    clientId: 'cli-005',
    clientName: 'Laura Hernández',
    orderId: 'ord-prev-005',
    productRating: 5,
    deliveryRating: 5,
    comment: 'Las empanadas vegetarianas son increíbles, muy recomendadas.',
    isPositive: true,
    createdAt: '2026-04-02',
  },
  {
    id: 'rev-006',
    clientId: 'cli-008',
    clientName: 'Miguel Torres',
    orderId: 'ord-prev-006',
    productRating: 2,
    deliveryRating: 3,
    comment: 'El pedido llegó incompleto, faltaron 2 empanadas.',
    isPositive: false,
    createdAt: '2026-04-01',
  },
]

// =============================================
// EQUIPO DE TRABAJO
// =============================================

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'team-001',
    name: 'Rosa Elena',
    role: 'Fundadora y Chef Principal',
    image: '/images/team/rosa.jpg',
    description: 'Con más de 20 años de experiencia en cocina colombiana tradicional.',
  },
  {
    id: 'team-002',
    name: 'Diego Armando',
    role: 'Coordinador de Producción',
    image: '/images/team/diego.jpg',
    description: 'Encargado de que cada empanada salga perfecta.',
  },
  {
    id: 'team-003',
    name: 'Lucía Fernanda',
    role: 'Atención al Cliente',
    image: '/images/team/lucia.jpg',
    description: 'Tu primer contacto, siempre lista para ayudarte.',
  },
]

// =============================================
// MÉTRICAS DEL DASHBOARD
// =============================================

export const mockDashboardMetrics: DashboardMetrics = {
  salesToday: 4580,
  salesMonth: 145670,
  salesYear: 1892450,
  ordersToday: 23,
  ordersMonth: 687,
  ordersYear: 8934,
  averageOrderValue: 212,
  empanadasSoldToday: 184,
  empanadasSoldMonth: 5480,
  empanadasSoldYear: 71234,
  totalClients: 1234,
  newClientsMonth: 89,
  pendingOrders: 5,
  averageDeliveryTime: 28,
}

// =============================================
// DATOS PARA GRÁFICAS
// =============================================

export const mockSalesChartData = [
  { name: 'Lun', ventas: 4200, empanadas: 168 },
  { name: 'Mar', ventas: 5800, empanadas: 232 },
  { name: 'Mié', ventas: 4100, empanadas: 164 },
  { name: 'Jue', ventas: 4900, empanadas: 196 },
  { name: 'Vie', ventas: 6200, empanadas: 248 },
  { name: 'Sáb', ventas: 7500, empanadas: 300 },
  { name: 'Dom', ventas: 3800, empanadas: 152 },
]

export const mockMonthlySalesData = [
  { name: 'Ene', ventas: 125000 },
  { name: 'Feb', ventas: 132000 },
  { name: 'Mar', ventas: 148000 },
  { name: 'Abr', ventas: 145670 },
]

export const mockProductSalesData = [
  { name: 'Carne', value: 45, fill: 'var(--chart-1)' },
  { name: 'Pollo', value: 35, fill: 'var(--chart-2)' },
  { name: 'Mixta', value: 12, fill: 'var(--chart-3)' },
  { name: 'Veggie', value: 8, fill: 'var(--chart-4)' },
]

// =============================================
// MÉTRICAS PÚBLICAS (LANDING)
// =============================================

export const mockPublicMetrics = {
  totalSold: 71234,
  happyCustomers: 1234,
  eventsAttended: 89,
  positiveReviews: 98,
  mostPopular: 'Empanada de Carne',
}

// =============================================
// PRECIOS PARA EVENTOS
// =============================================

export const mockEventPricing = [
  { quantity: '25-50', pricePerUnit: 23, description: 'Ideal para reuniones pequeñas' },
  { quantity: '51-100', pricePerUnit: 22, description: 'Perfecto para eventos medianos' },
  { quantity: '101-200', pricePerUnit: 21, description: 'Ideal para fiestas y celebraciones' },
  { quantity: '200+', pricePerUnit: 20, description: 'Grandes eventos y empresas' },
]
