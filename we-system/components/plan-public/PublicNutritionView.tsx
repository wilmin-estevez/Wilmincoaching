import type { NutritionPlan, NutritionPlanMeals } from '@/lib/supabase/types'

const DAYS_ES = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const
const CYCLE_LABEL: Record<number, string> = { 0: 'ALTO', 1: 'MEDIO', 2: 'BAJO' }
const MEAL_NAMES: Record<string, string> = {
  desayuno: 'Desayuno', merienda: 'Merienda', almuerzo: 'Almuerzo', cena: 'Cena',
}
const MEALS_ORDER = ['desayuno', 'merienda', 'almuerzo', 'cena'] as const

export default function PublicNutritionView({ plan }: { plan: NutritionPlan }) {
  const meals = plan.meals as NutritionPlanMeals

  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 bg-we-orange rounded-full flex-shrink-0" />
        <h2 className="text-we-white font-display font-bold text-lg uppercase tracking-wider">
          Plan Nutricional
        </h2>
      </div>

      {/* Macro summary */}
      <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-4 mb-5">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-we-orange font-display font-bold text-2xl">{plan.kcal_target}</div>
            <div className="text-[9px] text-we-gray-mid uppercase tracking-widest">kcal/día</div>
          </div>
          <div>
            <div className="text-we-orange font-display font-bold text-2xl">{plan.protein_g}g</div>
            <div className="text-[9px] text-we-gray-mid uppercase tracking-widest">Proteína</div>
          </div>
          <div>
            <div className="text-we-orange font-display font-bold text-2xl">{plan.fat_g}g</div>
            <div className="text-[9px] text-we-gray-mid uppercase tracking-widest">Grasa</div>
          </div>
        </div>
      </div>

      {/* 7 days */}
      {DAYS_ES.map((day) => {
        const dayData = meals?.[day]
        if (!dayData) return null
        return (
          <div key={day} className="mb-4 bg-we-carbon border border-we-carbon-2 rounded-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-we-carbon-2 flex items-center justify-between">
              <span className="text-[11px] font-bold text-we-white uppercase tracking-widest capitalize">
                {day}
              </span>
              <span className="text-[9px] text-we-gray-mid">
                Carbos: {CYCLE_LABEL[dayData.cycle_level]}
              </span>
            </div>
            <div className="divide-y divide-we-carbon-2">
              {MEALS_ORDER.map((mealKey) => {
                const meal = dayData[mealKey]
                if (!meal) return null
                return (
                  <div key={mealKey} className="px-4 py-4">
                    <div className="text-[10px] font-bold text-we-orange uppercase tracking-widest mb-3">
                      {MEAL_NAMES[mealKey]} · {meal.time}
                    </div>
                    <div className="space-y-3">
                      {meal.options.map((opt, i) => (
                        <div key={i} className="bg-we-carbon-1 rounded-lg p-3">
                          <div className="text-sm font-bold text-we-white mb-2">
                            Opción {i + 1}: {opt.name}
                          </div>
                          <div className="space-y-1 mb-2">
                            {opt.ingredients.map((ing, j) => (
                              <div key={j} className="text-xs text-we-gray-mid">
                                • {ing.food} — {ing.unit}
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-3 text-[10px] text-we-gray-mid border-t border-we-carbon-3 pt-2">
                            <span>{opt.protein_g}g Prot</span>
                            <span>{opt.carbs_g}g Carbs</span>
                            <span>{opt.fat_g}g Grasa</span>
                            <span className="ml-auto text-we-white font-bold">{opt.kcal} kcal</span>
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
    </section>
  )
}
