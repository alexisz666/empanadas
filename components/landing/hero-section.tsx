'use client'

import { Button } from '@/components/ui/button'
import { MessageCircle, Calendar, ArrowRight } from 'lucide-react'

const WHATSAPP_NUMBER = '526561234567' // TODO: Reemplazar con número real
const WHATSAPP_MESSAGE = encodeURIComponent('¡Hola! Quiero hacer un pedido de empanadas')
const WHATSAPP_EVENT_MESSAGE = encodeURIComponent('¡Hola! Me interesa cotizar empanadas para un evento')

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_40%,rgba(var(--primary)/0.1)_0%,transparent_50%)]" />
      
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">
                Ahora en Ciudad Juárez
              </span>
            </div>
            
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Las empanadas
              <span className="block text-primary">colombianas</span>
              que te van a encantar
            </h1>
            
            <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
              Hechas con receta tradicional colombiana, masa crujiente y rellenos 
              abundantes. Perfectas para cualquier ocasión: desde un antojo personal 
              hasta tu próximo evento.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button asChild size="lg" className="gap-2 text-base">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  Ordenar por WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 text-base">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_EVENT_MESSAGE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="h-5 w-5" />
                  Cotizar para evento
                </a>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-background bg-muted"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">+1,200</span> clientes satisfechos
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 fill-primary text-primary"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">4.9</span> de calificación
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative mx-auto aspect-square w-full max-w-lg lg:mx-0">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20" />
            <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm" />
            <div className="absolute inset-8 flex items-center justify-center rounded-xl bg-muted">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-4xl">🥟</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Imagen de empanadas
                </p>
              </div>
            </div>
            
            {/* Floating badges */}
            <div className="absolute -left-4 top-1/4 rounded-xl border border-border bg-card p-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <ArrowRight className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Entrega rápida</p>
                  <p className="font-semibold text-foreground">30 min</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -right-4 bottom-1/4 rounded-xl border border-border bg-card p-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-xl">🔥</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Siempre frescas</p>
                  <p className="font-semibold text-foreground">Recién hechas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
