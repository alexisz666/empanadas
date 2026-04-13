'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'completed'

interface StatusBadgeProps {
  status: OrderStatus | CampaignStatus | string
  className?: string
}

const orderStatusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pendiente',
    className: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  },
  preparing: {
    label: 'Preparando',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  ready: {
    label: 'Listo',
    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  },
  delivering: {
    label: 'En ruta',
    className: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100',
  },
  delivered: {
    label: 'Entregado',
    className: 'bg-slate-100 text-slate-800 hover:bg-slate-100',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
}

const campaignStatusConfig: Record<CampaignStatus, { label: string; className: string }> = {
  draft: {
    label: 'Borrador',
    className: 'bg-slate-100 text-slate-800 hover:bg-slate-100',
  },
  scheduled: {
    label: 'Programada',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  active: {
    label: 'Activa',
    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  },
  completed: {
    label: 'Completada',
    className: 'bg-slate-100 text-slate-800 hover:bg-slate-100',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config =
    orderStatusConfig[status as OrderStatus] ||
    campaignStatusConfig[status as CampaignStatus] ||
    { label: status, className: 'bg-slate-100 text-slate-800' }

  return (
    <Badge
      variant="secondary"
      className={cn('font-medium', config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
