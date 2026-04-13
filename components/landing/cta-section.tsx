'use client'

import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '526561234567'
const WHATSAPP_MESSAGE = encodeURIComponent('¡Hola! Quiero hacer un pedido de empanadas')

export function CTASection() {
  return (
    <section className="bg-primary py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            ¿Listo para probar las mejores empanadas de Ciudad Juárez?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Haz tu pedido ahora por WhatsApp y recibe tus empanadas calientes en tu puerta.
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="gap-2 text-base"
            >
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5" />
                Ordenar por WhatsApp
              </a>
            </Button>
          </div>
          <p className="mt-6 text-sm text-primary-foreground/60">
            Horario de atención: Lunes a Domingo, 10:00 AM - 9:00 PM
          </p>
        </div>
      </div>
    </section>
  )
}
