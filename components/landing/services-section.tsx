'use client'

import { Card, CardContent } from '@/components/ui/card'
import { MessageCircle, Calendar, Phone } from 'lucide-react'

const services = [
  {
    icon: MessageCircle,
    title: 'Pedidos Individuales',
    description:
      'Ordena tus empanadas favoritas por WhatsApp. Entrega a domicilio o recoge en nuestro local.',
    features: ['Entrega rápida', 'Pago en efectivo o transferencia', 'Mínimo 3 empanadas'],
  },
  {
    icon: Calendar,
    title: 'Pedidos para Eventos',
    description:
      'Fiestas, reuniones de oficina, bodas o cualquier celebración. Tenemos precios especiales por mayoreo.',
    features: ['Precios por volumen', 'Entrega programada', 'Empanadas calientes garantizadas'],
  },
  {
    icon: Phone,
    title: 'Pedidos por Llamada',
    description:
      'Si prefieres, también puedes llamarnos directamente para hacer tu pedido o resolver dudas.',
    features: ['Atención personalizada', 'Asesoría de cantidades', 'Horario extendido'],
  },
]

export function ServicesSection() {
  return (
    <section id="servicios" className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Formas de ordenar
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Te hacemos fácil disfrutar de nuestras empanadas. Elige la forma que más te convenga.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Card
                key={service.title}
                className="group relative overflow-hidden border-border/50 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {service.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
