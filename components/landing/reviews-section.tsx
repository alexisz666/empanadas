'use client'

import { Card, CardContent } from '@/components/ui/card'
import type { Review } from '@/data/mock-data'

interface ReviewsSectionProps {
  reviews: Review[]
  isLoading: boolean
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? 'fill-primary text-primary' : 'fill-muted text-muted'
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function ReviewsSection({ reviews, isLoading }: ReviewsSectionProps) {
  return (
    <section id="opiniones" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Las opiniones de quienes ya probaron nuestras empanadas.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? [...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
                      <div className="flex-1">
                        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                        <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-muted" />
                      </div>
                    </div>
                    <div className="mt-4 h-16 w-full animate-pulse rounded bg-muted" />
                  </CardContent>
                </Card>
              ))
            : reviews.map((review) => (
                <Card
                  key={review.id}
                  className="border-border/50 transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-lg font-bold text-primary">
                          {review.clientName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {review.clientName}
                        </p>
                        <StarRating rating={review.productRating} />
                      </div>
                    </div>
                    <p className="mt-4 text-muted-foreground">
                      {'"'}{review.comment}{'"'}
                    </p>
                    <p className="mt-4 text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </section>
  )
}
