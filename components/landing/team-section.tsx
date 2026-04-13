'use client'

import { Card, CardContent } from '@/components/ui/card'
import type { TeamMember } from '@/data/mock-data'

interface TeamSectionProps {
  team: TeamMember[]
  isLoading: boolean
}

export function TeamSection({ team, isLoading }: TeamSectionProps) {
  return (
    <section id="equipo" className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Conoce a nuestro equipo
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Personas apasionadas por la cocina colombiana y por darte la mejor experiencia.
          </p>
        </div>

        {/* Team Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? [...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square animate-pulse bg-muted" />
                  <CardContent className="p-6">
                    <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
                    <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-muted" />
                    <div className="mt-4 h-4 w-full animate-pulse rounded bg-muted" />
                  </CardContent>
                </Card>
              ))
            : team.map((member) => (
                <Card
                  key={member.id}
                  className="overflow-hidden border-border/50 transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  {/* Avatar Placeholder */}
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
                        <span className="text-4xl font-bold text-primary">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary">{member.role}</p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </section>
  )
}
