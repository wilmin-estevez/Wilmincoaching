import { cn } from '@/lib/utils'
import type { ClientStatus } from '@/lib/supabase/types'

const STATUS_LABELS: Record<ClientStatus, string> = {
  active:  'Activo',
  renew:   'Por renovar',
  expired: 'Vencido',
  new:     'Nuevo',
}

const STATUS_STYLES: Record<ClientStatus, string> = {
  active:  'bg-we-success/10 text-we-success',
  renew:   'bg-we-warn/10 text-we-warn',
  expired: 'bg-we-danger/10 text-we-danger',
  new:     'bg-we-orange/10 text-we-orange',
}

export function StatusBadge({ status }: { status: ClientStatus }) {
  return (
    <span className={cn(
      'text-[10px] font-bold px-2 py-0.5 rounded-chip uppercase tracking-wide',
      STATUS_STYLES[status] ?? 'bg-we-carbon-2 text-we-gray-mid'
    )}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
