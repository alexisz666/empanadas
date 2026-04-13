'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { DataTable, type Column } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { FilterSelect } from '@/components/shared/filter-select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getCampaigns, launchCampaign } from '@/services/api'
import type { Campaign } from '@/data/mock-data'
import {
  Megaphone,
  Users,
  CheckCircle,
  Calendar,
  MessageCircle,
  Send,
  Eye,
} from 'lucide-react'

const statusOptions = [
  { value: 'draft', label: 'Borrador' },
  { value: 'scheduled', label: 'Programada' },
  { value: 'active', label: 'Activa' },
  { value: 'completed', label: 'Completada' },
]

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [isLaunching, setIsLaunching] = useState(false)

  async function loadCampaigns() {
    setIsLoading(true)
    try {
      const data = await getCampaigns()
      setCampaigns(data)
    } catch (error) {
      console.error('Error loading campaigns:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCampaigns()
  }, [])

  const filteredCampaigns =
    statusFilter === 'all'
      ? campaigns
      : campaigns.filter((c) => c.status === statusFilter)

  const totalCampaigns = campaigns.length
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length
  const totalReached = campaigns.reduce((sum, c) => sum + c.reachedPeople, 0)
  const totalUsed = campaigns.reduce((sum, c) => sum + c.usedBy, 0)

  async function handleLaunchCampaign(campaignId: string) {
    setIsLaunching(true)
    try {
      const result = await launchCampaign(campaignId)
      if (result.success) {
        // Update campaign status
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === campaignId ? { ...c, status: 'active' as const } : c
          )
        )
        setSelectedCampaign(null)
      }
    } catch (error) {
      console.error('Error launching campaign:', error)
    } finally {
      setIsLaunching(false)
    }
  }

  const columns: Column<Campaign>[] = [
    {
      key: 'name',
      header: 'Campaña',
      render: (campaign) => (
        <div>
          <p className="font-medium text-foreground">{campaign.name}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {campaign.description}
          </p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      render: (campaign) => (
        <Badge variant="outline" className="capitalize">
          {campaign.type === 'discount'
            ? 'Descuento'
            : campaign.type === 'combo'
            ? 'Combo'
            : campaign.type === 'seasonal'
            ? 'Temporada'
            : 'Evento'}
        </Badge>
      ),
    },
    {
      key: 'dates',
      header: 'Fechas',
      render: (campaign) => (
        <div className="text-sm">
          <p>{new Date(campaign.startDate).toLocaleDateString('es-MX')}</p>
          <p className="text-muted-foreground">
            {new Date(campaign.endDate).toLocaleDateString('es-MX')}
          </p>
        </div>
      ),
    },
    {
      key: 'reachedPeople',
      header: 'Alcance',
      render: (campaign) => (
        <span>{campaign.reachedPeople.toLocaleString()}</span>
      ),
    },
    {
      key: 'usedBy',
      header: 'Usada por',
      render: (campaign) => (
        <span className="font-medium">{campaign.usedBy}</span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (campaign) => <StatusBadge status={campaign.status} />,
    },
    {
      key: 'actions',
      header: '',
      render: (campaign) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedCampaign(campaign)
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campañas"
        description="Gestión de promociones y campañas"
        icon={Megaphone}
        onRefresh={loadCampaigns}
        isRefreshing={isLoading}
        actions={
          <Button>
            <Megaphone className="mr-2 h-4 w-4" />
            Nueva Campaña
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Campañas"
          value={totalCampaigns}
          icon={Megaphone}
          isLoading={isLoading}
        />
        <StatCard
          title="Activas"
          value={activeCampaigns}
          icon={CheckCircle}
          isLoading={isLoading}
        />
        <StatCard
          title="Personas Alcanzadas"
          value={totalReached.toLocaleString()}
          icon={Users}
          isLoading={isLoading}
        />
        <StatCard
          title="Promociones Usadas"
          value={totalUsed}
          icon={Calendar}
          isLoading={isLoading}
        />
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Lista de Campañas</CardTitle>
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="Estado"
            className="w-40"
          />
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredCampaigns}
            isLoading={isLoading}
            emptyMessage="No hay campañas"
            emptyDescription="Crea tu primera campaña para empezar."
          />
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5" />
            Plantillas de Mensaje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <p className="mb-2 text-sm font-medium">Promoción de Descuento</p>
            <Textarea
              readOnly
              value="¡Hola {nombre}! Esta semana tenemos {descuento}% de descuento en todas las empanadas. ¡Te esperamos!"
              className="resize-none bg-muted/50"
            />
          </div>
          <div className="rounded-lg border p-4">
            <p className="mb-2 text-sm font-medium">Recordatorio de Evento</p>
            <Textarea
              readOnly
              value="¡Hola {nombre}! Recuerda que mañana es tu evento. Tu pedido de {cantidad} empanadas estará listo. ¡Gracias por elegirnos!"
              className="resize-none bg-muted/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Campaign Detail Dialog */}
      <Dialog
        open={!!selectedCampaign}
        onOpenChange={() => setSelectedCampaign(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedCampaign?.name}</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-6">
              {/* Info */}
              <div>
                <p className="text-muted-foreground">
                  {selectedCampaign.description}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <StatusBadge status={selectedCampaign.status} />
                  <Badge variant="outline" className="capitalize">
                    {selectedCampaign.type}
                  </Badge>
                  {selectedCampaign.discount && (
                    <Badge className="bg-primary/10 text-primary">
                      {selectedCampaign.discount}% OFF
                    </Badge>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Inicio</p>
                  <p className="font-medium">
                    {new Date(selectedCampaign.startDate).toLocaleDateString(
                      'es-MX',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fin</p>
                  <p className="font-medium">
                    {new Date(selectedCampaign.endDate).toLocaleDateString(
                      'es-MX',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {selectedCampaign.reachedPeople.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Personas alcanzadas
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {selectedCampaign.usedBy}
                  </p>
                  <p className="text-sm text-muted-foreground">Usada por</p>
                </div>
              </div>

              {/* Message Template */}
              {selectedCampaign.messageTemplate && (
                <div>
                  <p className="mb-2 text-sm font-medium">Mensaje de WhatsApp</p>
                  <div className="rounded-lg border bg-muted/50 p-3">
                    <p className="text-sm">{selectedCampaign.messageTemplate}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              {(selectedCampaign.status === 'draft' ||
                selectedCampaign.status === 'scheduled') && (
                <Button
                  className="w-full"
                  onClick={() => handleLaunchCampaign(selectedCampaign.id)}
                  disabled={isLaunching}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isLaunching ? 'Enviando...' : 'Lanzar por WhatsApp'}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
