import { createClient } from '@/lib/supabase/server'
import TrainingGenerator from '@/components/training/TrainingGenerator'
import type { Client, TrainingPlanDays } from '@/lib/supabase/types'

export default async function EntrenamientoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: clientData }, { data: plansData }] = await Promise.all([
    supabase.from('clients').select('*').eq('id', id).single(),
    supabase
      .from('training_plans')
      .select('id, name, days, created_at, public_slug')
      .eq('client_id', id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const client = clientData as unknown as Client | null
  if (!client) {
    return <p className="text-we-gray-mid text-sm">Cliente no encontrado.</p>
  }

  const plans = (plansData ?? []) as unknown as Array<{
    id: string
    name: string | null
    days: TrainingPlanDays
    created_at: string
    public_slug: string | null
  }>

  const previousPlan = plans.find(p => !p.name?.startsWith('__copy_pending__'))?.days ?? null

  const pendingCopyPlan = plans.find(p => p.name?.startsWith('__copy_pending__')) ?? null
  let pendingCopySourceName: string | null = null
  if (pendingCopyPlan?.name) {
    const parts = pendingCopyPlan.name.split(':')
    pendingCopySourceName = parts[2] ? decodeURIComponent(parts[2]) : 'otro cliente'
  }

  return (
    <TrainingGenerator
      client={client}
      previousPlan={previousPlan}
      pendingCopyPlan={
        pendingCopyPlan
          ? { id: pendingCopyPlan.id, days: pendingCopyPlan.days, sourceName: pendingCopySourceName ?? 'otro cliente' }
          : null
      }
    />
  )
}
