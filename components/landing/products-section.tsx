'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/data/mock-data'

interface ProductsSectionProps {
  products: Product[]
  isLoading: boolean
}

export function ProductsSection({ products, isLoading }: ProductsSectionProps) {
  return (
    <section id="productos" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Nuestras empanadas
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hechas a mano con ingredientes frescos y la receta tradicional colombiana.
          </p>
        </div>

        {/* Products Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? [...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square animate-pulse bg-muted" />
                  <CardContent className="p-4">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted" />
                    <div className="mt-4 h-6 w-1/3 animate-pulse rounded bg-muted" />
                  </CardContent>
                </Card>
              ))
            : products.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-border/50 transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  {/* Image Placeholder */}
                  <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-accent/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-5xl">🥟</span>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {product.name}
                        </p>
                      </div>
                    </div>
                    {product.type && (
                      <Badge
                        className="absolute right-3 top-3"
                        variant="secondary"
                      >
                        {product.type.charAt(0).toUpperCase() +
                          product.type.slice(1)}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground">
                      {product.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        ${product.price}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        +{product.totalSold.toLocaleString()} vendidas
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </section>
  )
}
