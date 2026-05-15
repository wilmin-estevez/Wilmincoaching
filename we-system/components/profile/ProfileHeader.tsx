import type { Client } from '@/lib/supabase/types'
import { StatusBadge } from '@/components/clients/StatusBadge'
import { formatDate, goalLabel } from '@/lib/utils'

export function ProfileHeader({ client }: { client: Client }) {
  const bmi = client.weight_kg && client.height_m
    ? (client.weight_kg / (client.height_m * client.height_m)).toFixed(1)
    : null

  return (
    <div className="brand-bar bg-we-carbon border-b border-we-carbon-2 px-6 py-5 flex items-start gap-6 flex-shrink-0">
      {/* Avatar */}
      <div className="w-14 h-14 bg-we-carbon-2 rounded-avatar flex items-center justify-center text-xl font-bold text-we-orange font-display flex-shrink-0">
        {client.name.slice(0, 2).toUpperCase()}
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <h1 className="font-display font-bold text-we-white text-2xl uppercase tracking-wide truncate">
            {client.name}
          </h1>
          <StatusBadge status={client.status} />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-we-gray-mid">
          {client.age && <span>{client.age} años</span>}
          {client.whatsapp && <span>📱 {client.whatsapp}</span>}
          {client.goal && <span>{goalLabel(client.goal)}</span>}
          {client.joined_at && <span>Desde {formatDate(client.joined_at)}</span>}
          {client.experience && <span>{client.experience}</span>}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-6 text-center flex-shrink-0">
        {client.weight_kg != null && (
          <div>
            <div className="font-display font-bold text-we-white text-2xl leading-none">{client.weight_kg}</div>
            <div className="text-[9px] text-we-gray-mid uppercase tracking-wide mt-1">kg actual</div>
          </div>
        )}
        {client.goal_weight_kg != null && (
          <div>
            <div className="font-display font-bold text-we-orange text-2xl leading-none">{client.goal_weight_kg}</div>
            <div className="text-[9px] text-we-gray-mid uppercase tracking-wide mt-1">kg meta</div>
          </div>
        )}
        {bmi && (
          <div>
            <div className="font-display font-bold text-we-white text-2xl leading-none">{bmi}</div>
            <div className="text-[9px] text-we-gray-mid uppercase tracking-wide mt-1">IMC</div>
          </div>
        )}
      </div>
    </div>
  )
}
