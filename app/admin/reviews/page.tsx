'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { FilterSelect } from '@/components/shared/filter-select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getReviews, getReviewStats } from '@/services/api'
import type { Review } from '@/data/mock-data'
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Truck } from 'lucide-react'

const sentimentOptions = [
  { value: 'positive', label: 'Positivas' },
  { value: 'negative', label: 'Negativas' },
]

const ratingOptions = [
  { value: '5', label: '5 estrellas' },
  { value: '4', label: '4 estrellas' },
  { value: '3', label: '3 estrellas' },
  { value: '2', label: '2 estrellas' },
  { value: '1', label: '1 estrella' },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? 'fill-primary text-primary'
              : 'fill-muted text-muted'
          }`}
        />
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<{
    averageProductRating: number
    averageDeliveryRating: number
    totalReviews: number
    positivePercentage: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sentimentFilter, setSentimentFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')

  async function loadData() {
    setIsLoading(true)
    try {
      const [reviewsData, statsData] = await Promise.all([
        getReviews(),
        getReviewStats(),
      ])
      setReviews(reviewsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredReviews = reviews.filter((review) => {
    const matchesSentiment =
      sentimentFilter === 'all' ||
      (sentimentFilter === 'positive' && review.isPositive) ||
      (sentimentFilter === 'negative' && !review.isPositive)
    const matchesRating =
      ratingFilter === 'all' ||
      review.productRating === parseInt(ratingFilter)
    return matchesSentiment && matchesRating
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Opiniones"
        description="Reseñas y calificaciones de clientes"
        icon={MessageSquare}
        onRefresh={loadData}
        isRefreshing={isLoading}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Calificación Producto"
          value={stats?.averageProductRating.toFixed(1) ?? '-'}
          icon={Star}
          description="promedio de 5"
          isLoading={isLoading}
        />
        <StatCard
          title="Calificación Entrega"
          value={stats?.averageDeliveryRating.toFixed(1) ?? '-'}
          icon={Truck}
          description="promedio de 5"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Reseñas"
          value={stats?.totalReviews ?? 0}
          icon={MessageSquare}
          isLoading={isLoading}
        />
        <StatCard
          title="Positivas"
          value={`${stats?.positivePercentage ?? 0}%`}
          icon={ThumbsUp}
          description="de todas las reseñas"
          isLoading={isLoading}
        />
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribución de Calificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter(
                  (r) => r.productRating === rating
                ).length
                const percentage = (count / reviews.length) * 100 || 0
                return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex w-24 items-center gap-1">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-4 w-4 fill-primary text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-12 text-right text-sm text-muted-foreground">
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Todas las Reseñas</CardTitle>
          <div className="flex gap-2">
            <FilterSelect
              value={sentimentFilter}
              onChange={setSentimentFilter}
              options={sentimentOptions}
              placeholder="Sentimiento"
              className="w-36"
            />
            <FilterSelect
              value={ratingFilter}
              onChange={setRatingFilter}
              options={ratingOptions}
              placeholder="Calificación"
              className="w-36"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No hay reseñas con los filtros aplicados
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface ReviewCardProps {
  review: Review
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className={review.isPositive ? '' : 'border-red-200 bg-red-50/30'}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
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
              <div className="mt-1 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Producto:</span>
                  <StarRating rating={review.productRating} />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Entrega:</span>
                  <StarRating rating={review.deliveryRating} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {review.isPositive ? (
              <Badge className="bg-emerald-100 text-emerald-800">
                <ThumbsUp className="mr-1 h-3 w-3" />
                Positiva
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">
                <ThumbsDown className="mr-1 h-3 w-3" />
                Negativa
              </Badge>
            )}
          </div>
        </div>
        <p className="mt-4 text-muted-foreground">{'"'}{review.comment}{'"'}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </CardContent>
    </Card>
  )
}
