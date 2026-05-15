import type { DayMeals } from '@/lib/supabase/types'

const MEAL_NAMES: Record<string, string> = {
  desayuno: 'Desayuno',
  merienda: 'Merienda',
  almuerzo: 'Almuerzo',
  cena:     'Cena',
}

const CYCLE_COLOR: Record<number, string> = {
  0: 'text-we-success',
  1: 'text-we-warn',
  2: 'text-we-gray-mid',
}

const CYCLE_LABEL: Record<number, string> = {
  0: 'ALTO',
  1: 'MEDIO',
  2: 'BAJO',
}

const MEALS_ORDER = ['desayuno', 'merienda', 'almuerzo', 'cena'] as const

export default function DayPlanView({ day, dayName }: { day: DayMeals; dayName: string }) {
  return (
    <div className="bg-we-carbon border border-we-carbon-2 rounded-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-we-carbon-2">
        <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase">{dayName}</div>
        <div className={`text-[10px] font-bold tracking-widest uppercase ${CYCLE_COLOR[day.cycle_level]}`}>
          Carbos: {CYCLE_LABEL[day.cycle_level]}
        </div>
      </div>
      <div className="p-4 space-y-5">
        {MEALS_ORDER.map((mealKey) => {
          const meal = day[mealKey]
          if (!meal) return null
          return (
            <div key={mealKey}>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[10px] font-bold text-we-white uppercase tracking-widest">
                  {MEAL_NAMES[mealKey]}
                </span>
                <span className="text-[9px] text-we-gray-mid">{meal.time}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {meal.options.map((opt, i) => (
                  <div
                    key={i}
                    className="bg-we-carbon-1 border border-we-carbon-3 rounded p-3 space-y-2"
                  >
                    <div className="text-[10px] font-bold text-we-orange leading-tight">{opt.name}</div>
                    <div className="space-y-0.5">
                      {opt.ingredients.map((ing, j) => (
                        <div key={j} className="text-[9px] text-we-gray-mid leading-relaxed">
                          {ing.food} — {ing.amount_g}g ({ing.unit})
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-we-carbon-3 pt-1 flex gap-1.5 text-[8px] text-we-gray-mid">
                      <span>{opt.protein_g}P</span>
                      <span>{opt.carbs_g}C</span>
                      <span>{opt.fat_g}G</span>
                      <span className="ml-auto text-we-white">{opt.kcal}kcal</span>
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
}
