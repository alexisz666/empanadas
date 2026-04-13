'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { DataTable, type Column } from '@/components/shared/data-table'
import { SearchInput } from '@/components/shared/search-input'
import { FilterSelect } from '@/components/shared/filter-select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getInventory } from '@/services/api'
import type { InventoryItem } from '@/data/mock-data'
import {
  Boxes,
  AlertTriangle,
  Package,
  DollarSign,
  Plus,
  Edit,
} from 'lucide-react'

const categoryOptions = [
  { value: 'ingredient', label: 'Ingredientes' },
  { value: 'packaging', label: 'Empaque' },
  { value: 'supply', label: 'Suministros' },
]

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  async function loadInventory() {
    setIsLoading(true)
    try {
      const data = await getInventory()
      setInventory(data)
    } catch (error) {
      console.error('Error loading inventory:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInventory()
  }, [])

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalItems = inventory.length
  const lowStockItems = inventory.filter((i) => i.isLowStock)
  const totalValue = inventory.reduce(
    (sum, i) => sum + i.currentStock * i.unitCost,
    0
  )

  const columns: Column<InventoryItem>[] = [
    {
      key: 'name',
      header: 'Insumo',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              item.isLowStock ? 'bg-red-100' : 'bg-primary/10'
            }`}
          >
            <Package
              className={`h-5 w-5 ${
                item.isLowStock ? 'text-red-600' : 'text-primary'
              }`}
            />
          </div>
          <div>
            <p className="font-medium text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.supplier}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Categoría',
      render: (item) => (
        <Badge variant="outline" className="capitalize">
          {item.category === 'ingredient'
            ? 'Ingrediente'
            : item.category === 'packaging'
            ? 'Empaque'
            : 'Suministro'}
        </Badge>
      ),
    },
    {
      key: 'currentStock',
      header: 'Stock',
      render: (item) => (
        <div className="flex items-center gap-2">
          <span
            className={`font-semibold ${
              item.isLowStock ? 'text-red-600' : ''
            }`}
          >
            {item.currentStock}
          </span>
          <span className="text-muted-foreground">{item.unit}</span>
          {item.isLowStock && (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
        </div>
      ),
    },
    {
      key: 'minStock',
      header: 'Mínimo',
      render: (item) => (
        <span className="text-muted-foreground">
          {item.minStock} {item.unit}
        </span>
      ),
    },
    {
      key: 'unitCost',
      header: 'Costo',
      render: (item) => <span>${item.unitCost}/{item.unit}</span>,
    },
    {
      key: 'lastRestockDate',
      header: 'Última Reposición',
      render: (item) => (
        <span className="text-muted-foreground">
          {new Date(item.lastRestockDate).toLocaleDateString('es-MX')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventario"
        description="Control de stock e insumos"
        icon={Boxes}
        onRefresh={loadInventory}
        isRefreshing={isLoading}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Insumo
          </Button>
        }
      />

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && !isLoading && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">
            Alerta de Stock Bajo
          </AlertTitle>
          <AlertDescription className="text-red-700">
            Los siguientes insumos necesitan reposición urgente:{' '}
            <strong>{lowStockItems.map((i) => i.name).join(', ')}</strong>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Insumos"
          value={totalItems}
          icon={Boxes}
          isLoading={isLoading}
        />
        <StatCard
          title="Stock Bajo"
          value={lowStockItems.length}
          icon={AlertTriangle}
          description="requieren atención"
          isLoading={isLoading}
        />
        <StatCard
          title="Valor Total"
          value={`$${totalValue.toLocaleString()}`}
          icon={DollarSign}
          description="en inventario"
          isLoading={isLoading}
        />
        <StatCard
          title="Proveedores"
          value={new Set(inventory.map((i) => i.supplier)).size}
          icon={Package}
          isLoading={isLoading}
        />
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Buscar insumo..."
              className="sm:w-64"
            />
            <FilterSelect
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categoryOptions}
              placeholder="Categoría"
              className="sm:w-48"
              allLabel="Todas"
            />
          </div>
          <DataTable
            columns={columns}
            data={filteredInventory}
            isLoading={isLoading}
            emptyMessage="No hay insumos"
            emptyDescription="Agrega tu primer insumo al inventario."
            rowClassName={(item) =>
              item.isLowStock ? 'bg-red-50/50' : ''
            }
          />
        </CardContent>
      </Card>

      {/* Daily Cut Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Corte Diario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/20">
            <div className="text-center">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">
                Función de corte diario
              </p>
              <p className="text-sm text-muted-foreground">
                Próximamente: registro de gastos y cierre de caja
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
