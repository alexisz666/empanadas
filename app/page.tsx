'use client'

import { useEffect, useState } from 'react'
import { HeroSection } from '@/components/landing/hero-section'
import { ServicesSection } from '@/components/landing/services-section'
import { ProductsSection } from '@/components/landing/products-section'
import { EventPricingSection } from '@/components/landing/event-pricing-section'
import { MetricsSection } from '@/components/landing/metrics-section'
import { TeamSection } from '@/components/landing/team-section'
import { ReviewsSection } from '@/components/landing/reviews-section'
import { CTASection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'
import { LandingHeader } from '@/components/landing/landing-header'
import {
  getPublicMetrics,
  getFeaturedProducts,
  getEventPricing,
  getTeamMembers,
  getPublicReviews,
} from '@/services/api'
import type { Product, Review, TeamMember } from '@/data/mock-data'

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [publicMetrics, setPublicMetrics] = useState<{
    totalSold: number
    happyCustomers: number
    eventsAttended: number
    positiveReviews: number
    mostPopular: string
  } | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [eventPricing, setEventPricing] = useState<Array<{
    quantity: string
    pricePerUnit: number
    description: string
  }>>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [metricsData, productsData, pricingData, teamData, reviewsData] =
          await Promise.all([
            getPublicMetrics(),
            getFeaturedProducts(),
            getEventPricing(),
            getTeamMembers(),
            getPublicReviews(),
          ])

        setPublicMetrics(metricsData)
        setProducts(productsData)
        setEventPricing(pricingData)
        setTeam(teamData)
        setReviews(reviewsData)
      } catch (error) {
        console.error('Error loading landing data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProductsSection products={products} isLoading={isLoading} />
        <EventPricingSection pricing={eventPricing} isLoading={isLoading} />
        <MetricsSection metrics={publicMetrics} isLoading={isLoading} />
        <TeamSection team={team} isLoading={isLoading} />
        <ReviewsSection reviews={reviews} isLoading={isLoading} />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
