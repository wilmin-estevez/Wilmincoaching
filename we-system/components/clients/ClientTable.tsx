import Link from 'next/link'
import type { Client } from '@/lib/supabase/types'
import { StatusBadge } from './StatusBadge'
import { goalLabel, daysRemaining } from '@/lib/utils'

interface ClientTableProps {
  clients: Client[]
}

export function ClientTable({ clients }: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-8 text-center">
        <p className="text-we-gray-mid text-sm">Sin asesorados en esta categoría.</p>
      </div>
    )
  }

  return (
    <div className="bg-we-carbon border border-we-carbon-2 rounded-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-we-carbon-2">
            {['Nombre', 'Objetivo', 'Peso actual → meta', 'Días restantes', 'Estado'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-[9px] font-bold text-we-gray-mid tracking-[2px] uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-we-carbon-2">
          {clients.map(client => {
            const days = daysRemaining(client.plan_expires_at)
            return (
              <tr key={client.id} className="hover:bg-we-carbon-1 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/clients/${client.id}/resumen`} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-we-carbon-2 rounded-avatar flex items-center justify-center text-xs font-bold text-we-orange font-display flex-shrink-0">
                      {client.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-we-white font-medium hover:text-we-orange transition-colors">
                        {client.name}
                      </div>
                      {client.whatsapp && (
                        <div className="text-[10px] text-we-gray-low">{client.whatsapp}</div>
                      )}
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-we-gray-mid">
                  {goalLabel(client.goal)}
                </td>
                <td className="px-4 py-3">
                  {client.weight_kg ? (
                    <span className="text-we-white">{client.weight_kg} kg</span>
                  ) : '—'}
                  {client.goal_weight_kg ? (
                    <span className="text-we-gray-low"> → {client.goal_weight_kg} kg</span>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  {days === null ? (
                    <span className="text-we-gray-low">—</span>
                  ) : days < 0 ? (
                    <span className="text-we-danger font-bold">Vencido</span>
                  ) : days <= 7 ? (
                    <span className="text-we-warn font-bold">{days}d</span>
                  ) : (
                    <span className="text-we-white">{days}d</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={client.status} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
