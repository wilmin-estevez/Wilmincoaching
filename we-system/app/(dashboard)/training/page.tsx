import { createClient } from '@/lib/supabase/server'
import { Topbar } from '@/components/shell/Topbar'
import { TrainingPlanCard } from '@/components/training/TrainingPlanCard'
import type { TrainingPlanDays, PlanStatus } from '@/lib/supabase/types'

type RawPlan = {
  id: string
  name: string | null
  days: TrainingPlanDays
  created_at: string
  public_slug: string | null
  status: PlanStatus
  clients: { id: string; name: string } | null
}

export default async function TrainingPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('training_plans')
    .select('id, name, days, created_at, public_slug, status, clients(id, name)')
    .order('created_at', { ascending: false })
    .limit(100)

  const plans = ((data ?? []) as unknown as RawPlan[]).filter(
    p => !p.name?.startsWith('__copy_pending__') && p.clients,
  )

  const drafts = plans.filter(p => p.status === 'draft')
  const assigned = plans.filter(p => p.status === 'sent')

  return (
    <>
      <Topbar title="ENTRENAMIENTO" accent={`· ${plans.length}`} />
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        {plans.length === 0 && (
          <p className="text-we-gray-mid text-sm">
            No hay programas de entrenamiento guardados todavía.
          </p>
        )}

        {drafts.length > 0 && (
          <section className="space-y-3">
            <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase">
              Borradores ({drafts.length})
            </div>
            <div className="space-y-2">
              {drafts.map(p => (
                <TrainingPlanCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  days={p.days}
                  createdAt={p.created_at}
                  publicSlug={p.public_slug}
                  status={p.status}
                  clientId={p.clients!.id}
                  clientName={p.clients!.name}
                />
              ))}
            </div>
          </section>
        )}

        {assigned.length > 0 && (
          <section className="space-y-3">
            <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase">
              Asignados ({assigned.length})
            </div>
            <div className="space-y-2">
              {assigned.map(p => (
                <TrainingPlanCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  days={p.days}
                  createdAt={p.created_at}
                  publicSlug={p.public_slug}
                  status={p.status}
                  clientId={p.clients!.id}
                  clientName={p.clients!.name}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  )
}
