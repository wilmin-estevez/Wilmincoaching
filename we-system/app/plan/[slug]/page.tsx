import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import PublicNutritionView from '@/components/plan-public/PublicNutritionView'
import PublicTrainingView from '@/components/plan-public/PublicTrainingView'
import type { NutritionPlan, TrainingPlan } from '@/lib/supabase/types'

export default async function PublicPlanPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createServiceClient()

  let { data: nutritionRaw } = await supabase
    .from('nutrition_plans')
    .select('*')
    .eq('public_slug', slug)
    .single()

  // If slug belongs to a training plan instead, resolve via client
  if (!nutritionRaw) {
    const { data: trainingBySlug } = await supabase
      .from('training_plans')
      .select('client_id')
      .eq('public_slug', slug)
      .single()

    if (!trainingBySlug) notFound()

    const { data: nutritionByClient } = await supabase
      .from('nutrition_plans')
      .select('*')
      .eq('client_id', trainingBySlug.client_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    nutritionRaw = nutritionByClient
    if (!nutritionRaw) notFound()
  }

  const nutritionPlan = nutritionRaw as unknown as NutritionPlan | null
  if (!nutritionPlan) notFound()

  const [{ data: clientRaw }, { data: trainingRaw }] = await Promise.all([
    supabase
      .from('clients')
      .select('name, goal')
      .eq('id', nutritionPlan.client_id)
      .single(),
    supabase
      .from('training_plans')
      .select('*')
      .eq('client_id', nutritionPlan.client_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
  ])

  const clientName = (clientRaw as { name: string } | null)?.name ?? 'Cliente'
  const trainingPlan = trainingRaw as unknown as TrainingPlan | null

  return (
    <div className="min-h-screen bg-we-black">
      {/* Header */}
      <div className="border-b border-we-carbon-2 px-4 py-4 flex items-center gap-3 sticky top-0 bg-we-black z-10">
        <div className="w-9 h-9 bg-we-orange rounded-md flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0">
          WE
        </div>
        <div className="min-w-0">
          <div className="text-[10px] text-we-gray-mid uppercase tracking-widest">
            Plan personalizado
          </div>
          <div className="text-we-white font-display font-bold text-lg leading-tight truncate">
            {clientName}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-10 pb-20">
        <PublicNutritionView plan={nutritionPlan} />
        {trainingPlan && <PublicTrainingView plan={trainingPlan} />}
      </div>
    </div>
  )
}
