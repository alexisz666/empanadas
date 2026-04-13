'use client'

import { TrendingUp, Users, CalendarCheck, ThumbsUp } from 'lucide-react'

interface MetricsSectionProps {
  metrics: {
    totalSold: number
    happyCustomers: number
    eventsAttended: number
    positiveReviews: number
    mostPopular: string
  } | null
  isLoading: boolean
}

const metricsConfig = [
  {
    key: 'totalSold' as const,
    label: 'Empanadas vendidas',
    icon: TrendingUp,
    format: (v: number) => `+${v.toLocaleString()}`,
  },
  {
    key: 'happyCustomers' as const,
    label: 'Clientes felices',
    icon: Users,
    format: (v: number) => `+${v.toLocaleString()}`,
  },
  {
    key: 'eventsAttended' as const,
    label: 'Eventos atendidos',
    icon: CalendarCheck,
    format: (v: number) => `+${v}`,
  },
  {
    key: 'positiveReviews' as const,
    label: 'Opiniones positivas',
    icon: ThumbsUp,
    format: (v: number) => `${v}%`,
  },
]

export function MetricsSection({ metrics, isLoading }: MetricsSectionProps) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Nuestros números hablan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Miles de clientes ya disfrutan de nuestras empanadas. Sé parte de nuestra familia.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center rounded-2xl border border-border/50 bg-card p-8 text-center"
                >
                  <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
                  <div className="mt-4 h-10 w-24 animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
                </div>
              ))
            : metricsConfig.map((metric) => {
                const Icon = metric.icon
                const value = metrics?.[metric.key] ?? 0
                return (
                  <div
                    key={metric.key}
                    className="flex flex-col items-center rounded-2xl border border-border/50 bg-card p-8 text-center transition-all hover:border-primary/50 hover:shadow-lg"
                  >
                    <div className="inline-flex rounded-xl bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="mt-4 text-4xl font-bold text-foreground">
                      {metric.format(value)}
                    </p>
                    <p className="mt-2 text-muted-foreground">{metric.label}</p>
                  </div>
                )
              })}
        </div>

        {/* Most Popular */}
        {metrics?.mostPopular && !isLoading && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Producto más popular:{' '}
              <span className="font-semibold text-primary">
                {metrics.mostPopular}
              </span>
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
