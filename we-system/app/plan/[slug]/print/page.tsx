import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import PrintTrigger from './PrintTrigger'
import type { NutritionPlan, NutritionPlanMeals, TrainingPlan, TrainingPlanDays } from '@/lib/supabase/types'

const DAYS_ES = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const
const CYCLE_LABEL: Record<number, string> = { 0: 'ALTO carbohidratos', 1: 'MEDIO carbohidratos', 2: 'BAJO carbohidratos' }
const MEALS_ORDER = ['desayuno', 'merienda', 'almuerzo', 'cena'] as const
const MEAL_NAMES: Record<string, string> = { desayuno: 'Desayuno', merienda: 'Merienda', almuerzo: 'Almuerzo', cena: 'Cena' }
const MEAL_TIMES: Record<string, string> = { desayuno: '7:00am', merienda: '10:30am', almuerzo: '1:00pm', cena: '7:00pm' }
const DAY_LABELS: Record<string, string> = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves',
  viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo',
}

export default async function PrintPage({
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

  if (!nutritionRaw) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: trainingBySlug } = await (supabase as any)
      .from('training_plans')
      .select('client_id')
      .eq('public_slug', slug)
      .single()

    if (!trainingBySlug) notFound()

    const clientIdFromTraining = (trainingBySlug as { client_id: string }).client_id
    const { data: nutritionByClient } = await supabase
      .from('nutrition_plans')
      .select('*')
      .eq('client_id', clientIdFromTraining)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    nutritionRaw = nutritionByClient
    if (!nutritionRaw) notFound()
  }

  const nutritionPlan = nutritionRaw as unknown as NutritionPlan | null
  if (!nutritionPlan) notFound()

  const [{ data: clientRaw }, { data: trainingRaw }] = await Promise.all([
    supabase.from('clients').select('name, goal').eq('id', nutritionPlan.client_id).single(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from('training_plans')
      .select('*')
      .eq('client_id', nutritionPlan.client_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
  ])

  const clientName = (clientRaw as { name: string } | null)?.name ?? 'Cliente'
  const trainingPlan = trainingRaw as unknown as TrainingPlan | null
  const meals = nutritionPlan.meals as NutritionPlanMeals

  return (
    <div style={{ background: 'white', color: '#1a1a1a', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", margin: 0, padding: 0 }}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <PrintTrigger />

        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-4" style={{ borderBottom: '2px solid #f97316' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Plan personalizado</div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{clientName}</h1>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
              {nutritionPlan.kcal_target} kcal/día · {nutritionPlan.protein_g}g proteína · {nutritionPlan.fat_g}g grasa
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#f97316', fontWeight: 'bold', fontSize: '18px' }}>WE</div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>Wilmin Estévez Coaching</div>
          </div>
        </div>

        {/* Nutrition Plan */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '4px', height: '20px', background: '#f97316', borderRadius: '2px', display: 'inline-block' }} />
            Plan Nutricional
          </h2>

          {DAYS_ES.map((day) => {
            const dayData = meals?.[day]
            if (!dayData) return null
            return (
              <div key={day} className="day-block" style={{ marginBottom: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#111827', textTransform: 'uppercase' }}>{DAY_LABELS[day]}</span>
                  <span style={{ fontSize: '11px', color: '#ea580c', fontWeight: '500' }}>{CYCLE_LABEL[dayData.cycle_level]}</span>
                </div>
                <div>
                  {MEALS_ORDER.map((mealKey) => {
                    const meal = dayData[mealKey]
                    if (!meal) return null
                    return (
                      <div key={mealKey} style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6' }}>
                        <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          {MEAL_NAMES[mealKey]} · {meal.time ?? MEAL_TIMES[mealKey]}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          {meal.options.map((opt, i) => (
                            <div key={i} style={{ background: '#f9fafb', borderRadius: '6px', padding: '10px' }}>
                              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
                                Opción {i + 1}: {opt.name}
                              </div>
                              <div style={{ marginBottom: '6px' }}>
                                {opt.ingredients.map((ing, j) => (
                                  <div key={j} style={{ fontSize: '10px', color: '#6b7280' }}>
                                    • {ing.food} — {ing.unit}
                                  </div>
                                ))}
                              </div>
                              <div style={{ display: 'flex', gap: '8px', fontSize: '9px', color: '#9ca3af', paddingTop: '4px', borderTop: '1px solid #e5e7eb' }}>
                                <span>{opt.protein_g}g P</span>
                                <span>{opt.carbs_g}g C</span>
                                <span>{opt.fat_g}g G</span>
                                <span style={{ marginLeft: 'auto', fontWeight: 'bold', color: '#374151' }}>{opt.kcal} kcal</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Training Plan */}
        {trainingPlan && (() => {
          const days = trainingPlan.days as TrainingPlanDays
          const activeDays = DAYS_ES.filter((d) => days?.[d])
          if (!activeDays.length) return null
          return (
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '4px', height: '20px', background: '#f97316', borderRadius: '2px', display: 'inline-block' }} />
                Plan de Entrenamiento
              </h2>
              {activeDays.map((day) => {
                const dayData = days[day]!
                return (
                  <div key={day} className="day-block" style={{ marginBottom: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#111827', textTransform: 'uppercase' }}>{DAY_LABELS[day]}</span>
                      <span style={{ fontSize: '11px', color: '#ea580c', fontWeight: '500' }}>{dayData.name}</span>
                    </div>
                    <div>
                      {dayData.exercises.map((ex, i) => (
                        <div key={i} style={{ padding: '10px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#6b7280', fontWeight: 'bold', flexShrink: 0 }}>
                            {i + 1}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1f2937' }}>{ex.name}</div>
                            <div style={{ fontSize: '10px', color: '#6b7280' }}>{ex.muscle}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '10px', color: '#6b7280', textAlign: 'right', flexShrink: 0 }}>
                            <div>
                              <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '13px' }}>{ex.sets}×{ex.reps}</div>
                              <div>series</div>
                            </div>
                            <div>
                              <div style={{ fontWeight: 'bold', color: '#f97316', fontSize: '13px' }}>{ex.weight}</div>
                              <div>peso</div>
                            </div>
                            <div>
                              <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '13px' }}>{ex.rest_s}s</div>
                              <div>desc.</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })()}

        {/* Footer */}
        <div style={{ marginTop: '40px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: '11px', color: '#9ca3af' }}>
          Plan generado por Wilmin Estévez Coaching · we-system-seven.vercel.app
        </div>
      </div>
    </div>
  )
}
