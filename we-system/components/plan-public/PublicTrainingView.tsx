import type { TrainingPlan, TrainingPlanDays } from '@/lib/supabase/types'

const DAYS_ES = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const

export default function PublicTrainingView({ plan }: { plan: TrainingPlan }) {
  const days = plan.days as TrainingPlanDays

  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 bg-we-orange rounded-full flex-shrink-0" />
        <h2 className="text-we-white font-display font-bold text-lg uppercase tracking-wider">
          Plan de Entrenamiento
        </h2>
      </div>

      {DAYS_ES.map((day) => {
        const dayData = days?.[day]
        if (!dayData) return null
        return (
          <div key={day} className="mb-4 bg-we-carbon border border-we-carbon-2 rounded-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-we-carbon-2 flex items-center justify-between">
              <span className="text-[11px] font-bold text-we-white uppercase tracking-widest capitalize">
                {day}
              </span>
              <span className="text-[10px] text-we-orange font-bold uppercase">{dayData.name}</span>
            </div>
            <div className="divide-y divide-we-carbon-2">
              {dayData.exercises.map((ex, i) => (
                <div key={i} className="px-4 py-3 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-we-carbon-3 flex items-center justify-center text-[9px] text-we-gray-mid font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-we-white">{ex.name}</div>
                    <div className="text-[10px] text-we-gray-mid">{ex.muscle}</div>
                  </div>
                  <div className="flex gap-3 text-[10px] text-we-gray-mid text-center flex-shrink-0">
                    <div>
                      <div className="text-we-white font-bold text-sm">{ex.sets}×{ex.reps}</div>
                      <div>series</div>
                    </div>
                    {ex.weight && (
                      <div>
                        <div className="text-we-orange font-bold text-sm">{ex.weight}</div>
                        <div>peso</div>
                      </div>
                    )}
                    <div>
                      <div className="text-we-white font-bold text-sm">{ex.rest_s}s</div>
                      <div>desc.</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}
