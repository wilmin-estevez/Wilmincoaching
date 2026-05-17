import type { TrainingDay } from '@/lib/supabase/types'
import ExerciseCard from './ExerciseCard'

export default function DayTrainingView({ day, dayName }: { day: TrainingDay; dayName: string }) {
  return (
    <div className="bg-we-carbon border border-we-carbon-2 rounded-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-we-carbon-2">
        <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase">{dayName}</div>
        <div className="text-[10px] text-we-orange font-bold uppercase tracking-widest">{day.name}</div>
      </div>
      <div className="divide-y divide-we-carbon-2">
        {day.exercises.map((ex, i) => (
          <ExerciseCard key={i} ex={ex} index={i} />
        ))}
      </div>
    </div>
  )
}
