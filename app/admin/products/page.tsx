'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { FilterSelect } from '@/components/shared/filter-select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getProducts, getTopSellingProducts } from '@/services/api'
import type { Product } from '@/data/mock-data'
import { Package, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const categoryOptions = [
  { value: 'empanada', label: 'Empanadas' },
  { value: 'bebida', label: 'Bebidas' },
  { value: 'combo', label: 'Combos' },
  { value: 'extra', label: 'Extras' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')

  async function loadProducts() {
    setIsLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const filteredProducts =
    categoryFilter === 'all'
      ? products
      : products.filter((p) => p.category === categoryFilter)

  const totalSold = products.reduce((sum, p) => sum + p.totalSold, 0)
  const topProduct = products.reduce((max, p) =>
    p.totalSold > max.totalSold ? p : max
  , products[0])
  const leastSold = products.reduce((min, p) =>
    p.totalSold < min.totalSold ? p : min
  , products[0])

  const chartData = products
    .filter((p) => p.category === 'empanada')
    .map((p) => ({
      name: p.name.replace('Empanada de ', '').replace('Empanada ', ''),
      vendidas: p.totalSold,
    }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Productos"
        description="Análisis de productos y ventas"
        icon={Package}
        onRefresh={loadProducts}
        isRefreshing={isLoading}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Vendidas"
          value={totalSold.toLocaleString()}
          description="unidades totales"
          icon={Package}
          isLoading={isLoading}
        />
        <StatCard
          title="Más Vendido"
          value={topProduct?.name.replace('Empanada de ', '') ?? '-'}
          description={`${topProduct?.totalSold.toLocaleString()} uds`}
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <StatCard
          title="Menos Vendido"
          value={leastSold?.name.replace('Empanada ', '') ?? '-'}
          description={`${leastSold?.totalSold.toLocaleString()} uds`}
          icon={TrendingDown}
          isLoading={isLoading}
        />
        <StatCard
          title="Productos"
          value={products.length}
          description="en catálogo"
          icon={BarChart3}
          isLoading={isLoading}
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ventas por Tipo de Empanada</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[300px] animate-pulse rounded bg-muted" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    'Vendidas',
                  ]}
                />
                <Bar
                  dataKey="vendidas"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Products Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Catálogo de Productos</CardTitle>
          <FilterSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
            placeholder="Categoría"
            className="w-40"
            allLabel="Todas"
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="flex h-full items-center justify-center">
          <span className="text-4xl">
            {product.category === 'empanada'
              ? '🥟'
              : product.category === 'bebida'
              ? '🥤'
              : product.category === 'combo'
              ? '🍽️'
              : '🛒'}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {product.description}
            </p>
          </div>
          <Badge variant={product.isAvailable ? 'default' : 'secondary'}>
            {product.isAvailable ? 'Disponible' : 'Agotado'}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            ${product.price}
          </span>
          <div className="text-right">
            <p className="text-sm font-medium">
              {product.totalSold.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">vendidas</p>
          </div>
        </div>
        {product.type && (
          <Badge variant="outline" className="mt-2">
            {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
