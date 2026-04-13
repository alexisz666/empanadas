'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Check } from 'lucide-react'

const WHATSAPP_NUMBER = '526561234567'

interface EventPricingSectionProps {
  pricing: Array<{
    quantity: string
    pricePerUnit: number
    description: string
  }>
  isLoading: boolean
}

export function EventPricingSection({ pricing, isLoading }: EventPricingSectionProps) {
  return (
    <section id="eventos" className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Precios para eventos
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Entre más pidas, mejor precio. Perfecto para fiestas, reuniones y celebraciones.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? [...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
                    <div className="mt-4 h-10 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="mt-4 h-4 w-full animate-pulse rounded bg-muted" />
                  </CardContent>
                </Card>
              ))
            : pricing.map((tier, index) => (
                <Card
                  key={tier.quantity}
                  className={`relative overflow-hidden transition-all hover:shadow-lg ${
                    index === 2
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border/50 hover:border-primary/50'
                  }`}
                >
                  {index === 2 && (
                    <div className="absolute right-0 top-0 rounded-bl-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Popular
                    </div>
                  )}
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-muted-foreground">
                      {tier.quantity} empanadas
                    </p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">
                        ${tier.pricePerUnit}
                      </span>
                      <span className="text-muted-foreground">/c.u.</span>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        Entrega incluida
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        Salsas gratis
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        Empanadas calientes
                      </li>
                    </ul>
                    <Button
                      asChild
                      className="mt-6 w-full gap-2"
                      variant={index === 2 ? 'default' : 'outline'}
                    >
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `¡Hola! Me interesa cotizar empanadas para un evento. Cantidad aproximada: ${tier.quantity}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Cotizar
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </section>
  )
}
