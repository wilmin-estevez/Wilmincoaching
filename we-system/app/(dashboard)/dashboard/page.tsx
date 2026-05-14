import { createClient } from '@/lib/supabase/server'
import { Topbar } from '@/components/shell/Topbar'
import { KPIGrid } from '@/components/dashboard/KPIGrid'
import { HeroStrip } from '@/components/dashboard/HeroStrip'
import type { Client } from '@/lib/supabase/types'

type RecentClient = Pick<Client, 'id' | 'name' | 'status' | 'plan_expires_at'>

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: totalActive },
    { count: toRenew },
    { count: newForms },
    { data: recentClients },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'renew'),
    supabase.from('form_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('clients').select('id, name, status, plan_expires_at').order('created_at', { ascending: false }).limit(5) as unknown as Promise<{ data: RecentClient[] | null }>,
  ])

  const kpis = [
    {
      label: 'Asesorados activos',
      value: totalActive ?? 0,
      delta: 'Total en sistema',
      deltaType: 'good' as const,
    },
    {
      label: 'Por renovar',
      value: toRenew ?? 0,
      delta: toRenew && toRenew > 0 ? 'Esta semana' : 'Al día',
      deltaType: toRenew && toRenew > 0 ? 'warn' as const : 'good' as const,
    },
    {
      label: 'Formularios nuevos',
      value: newForms ?? 0,
      delta: newForms && newForms > 0 ? 'Esperando plan' : 'Sin pendientes',
      deltaType: newForms && newForms > 0 ? 'good' as const : undefined,
    },
    {
      label: 'Expirados',
      value: 0,
      delta: 'Sin vencidos',
      deltaType: 'good' as const,
    },
  ]

  return (
    <>
      <Topbar title="DASHBOARD" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <HeroStrip newForms={newForms ?? 0} />
        <KPIGrid kpis={kpis} />

        {/* Recent clients */}
        <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-5">
          <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase mb-4">
            Asesorados recientes
          </div>
          <div className="space-y-2">
            {(recentClients ?? []).map(client => (
              <div key={client.id} className="flex items-center gap-3 py-2 border-b border-we-carbon-2 last:border-0">
                <div className="w-8 h-8 bg-we-carbon-2 rounded-avatar flex items-center justify-center text-xs font-bold text-we-orange font-display">
                  {client.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 text-sm text-we-white">{client.name}</div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-chip uppercase tracking-wide ${
                  client.status === 'active' ? 'bg-we-success/10 text-we-success' :
                  client.status === 'renew'  ? 'bg-we-warn/10 text-we-warn' :
                  'bg-we-danger/10 text-we-danger'
                }`}>
                  {client.status === 'active' ? 'Activo' : client.status === 'renew' ? 'Por renovar' : 'Expirado'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
