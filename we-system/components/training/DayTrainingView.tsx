import type { TrainingDay } from '@/lib/supabase/types'

export default function DayTrainingView({ day, dayName }: { day: TrainingDay; dayName: string }) {
  return (
    <div className="bg-we-carbon border border-we-carbon-2 rounded-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-we-carbon-2">
        <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase">{dayName}</div>
        <div className="text-[10px] text-we-orange font-bold uppercase tracking-widest">{day.name}</div>
      </div>
      <div className="divide-y divide-we-carbon-2">
        {day.exercises.map((ex, i) => (
          <div key={i} className="px-5 py-3 flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-we-carbon-3 flex items-center justify-center text-[10px] text-we-gray-mid font-bold flex-shrink-0 mt-0.5">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-we-white">{ex.name}</div>
              <div className="text-[10px] text-we-gray-mid mt-0.5">
                {ex.muscle} · {ex.equipment}
              </div>
              {ex.notes && (
                <div className="text-[10px] text-we-gray-low mt-1">{ex.notes}</div>
              )}
            </div>
            <div className="flex gap-4 text-[10px] text-we-gray-mid flex-shrink-0 text-center">
              <div>
                <div className="text-we-white font-bold text-sm">{ex.sets}</div>
                <div>series</div>
              </div>
              <div>
                <div className="text-we-white font-bold text-sm">{ex.reps}</div>
                <div>reps</div>
              </div>
              <div>
                <div className="text-we-white font-bold text-sm">{ex.rest_s}s</div>
                <div>desc.</div>
              </div>
              {ex.weight && (
                <div>
                  <div className="text-we-orange font-bold text-sm">{ex.weight}</div>
                  <div>peso</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
