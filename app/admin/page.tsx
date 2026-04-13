'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { DashboardCharts } from '@/components/admin/dashboard-charts'
import { TopClientsTable } from '@/components/admin/top-clients-table'
import { RecentOrdersTable } from '@/components/admin/recent-orders-table'
import { AlertsPanel } from '@/components/admin/alerts-panel'
import {
  getDashboardMetrics,
  getWeeklySalesChart,
  getTopClients,
  getOrders,
  getLowStockItems,
} from '@/services/api'
import type { DashboardMetrics, Client, Order, InventoryItem } from '@/data/mock-data'
import {
  LayoutDashboard,
  DollarSign,
  ShoppingCart,
  Users,
  Timer,
} from 'lucide-react'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [salesData, setSalesData] = useState<Array<{ name: string; ventas: number; empanadas: number }>>([])
  const [topClients, setTopClients] = useState<Client[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([])

  async function loadData() {
    try {
      const [metricsData, salesChartData, clientsData, ordersData, lowStock] =
        await Promise.all([
          getDashboardMetrics(),
          getWeeklySalesChart(),
          getTopClients(10),
          getOrders(),
          getLowStockItems(),
        ])

      setMetrics(metricsData)
      setSalesData(salesChartData)
      setTopClients(clientsData)
      setRecentOrders(ordersData.slice(0, 5))
      setLowStockItems(lowStock)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function handleRefresh() {
    setIsRefreshing(true)
    loadData()
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(value)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Resumen general del negocio"
        icon={LayoutDashboard}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Alerts */}
      <AlertsPanel
        lowStockItems={lowStockItems}
        pendingOrders={metrics?.pendingOrders ?? 0}
        isLoading={isLoading}
      />

      {/* Main Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ventas Hoy"
          value={formatCurrency(metrics?.salesToday ?? 0)}
          description="vs ayer"
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
          isLoading={isLoading}
        />
        <StatCard
          title="Pedidos Hoy"
          value={metrics?.ordersToday ?? 0}
          description="pedidos completados"
          icon={ShoppingCart}
          trend={{ value: 8, isPositive: true }}
          isLoading={isLoading}
        />
        <StatCard
          title="Clientes Totales"
          value={(metrics?.totalClients ?? 0).toLocaleString()}
          description={`+${metrics?.newClientsMonth ?? 0} este mes`}
          icon={Users}
          trend={{ value: 5, isPositive: true }}
          isLoading={isLoading}
        />
        <StatCard
          title="Tiempo Promedio"
          value={`${metrics?.averageDeliveryTime ?? 0} min`}
          description="de entrega"
          icon={Timer}
          trend={{ value: 3, isPositive: false }}
          isLoading={isLoading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ventas del Mes"
          value={formatCurrency(metrics?.salesMonth ?? 0)}
          description="687 pedidos"
          isLoading={isLoading}
        />
        <StatCard
          title="Ventas del Año"
          value={formatCurrency(metrics?.salesYear ?? 0)}
          description="8,934 pedidos"
          isLoading={isLoading}
        />
        <StatCard
          title="Empanadas Hoy"
          value={(metrics?.empanadasSoldToday ?? 0).toLocaleString()}
          description="unidades vendidas"
          isLoading={isLoading}
        />
        <StatCard
          title="Ticket Promedio"
          value={formatCurrency(metrics?.averageOrderValue ?? 0)}
          description="por pedido"
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <DashboardCharts salesData={salesData} isLoading={isLoading} />

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopClientsTable clients={topClients} isLoading={isLoading} />
        <RecentOrdersTable orders={recentOrders} isLoading={isLoading} />
      </div>
    </div>
  )
}
