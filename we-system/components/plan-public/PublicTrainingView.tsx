'use client'

import { useEffect, useState } from 'react'
import type { TrainingPlan, TrainingPlanDays, Exercise } from '@/lib/supabase/types'
import { findExerciseGif } from '@/lib/exerciseGif'

const DAYS_ES = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const

function PublicExerciseRow({ ex, index }: { ex: Exercise; index: number }) {
  const [gifUrl, setGifUrl] = useState<string | null>(null)
  const [gifOpen, setGifOpen] = useState(false)

  useEffect(() => {
    findExerciseGif(ex.name).then(setGifUrl)
  }, [ex.name])

  return (
    <div className="px-4 py-3 flex items-start gap-3">
      <div className="w-5 h-5 rounded-full bg-we-carbon-3 flex items-center justify-center text-[9px] text-we-gray-mid font-bold flex-shrink-0 mt-0.5">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-sm font-bold text-we-white">{ex.name}</div>
          {gifUrl && (
            <button
              type="button"
              onClick={() => setGifOpen(o => !o)}
              className="text-[9px] font-bold text-we-orange border border-we-orange/40 rounded px-1.5 py-0.5 hover:bg-we-orange/10 transition-colors"
            >
              {gifOpen ? 'OCULTAR' : 'VER'}
            </button>
          )}
        </div>
        <div className="text-[10px] text-we-gray-mid">{ex.muscle}</div>
        {gifUrl && gifOpen && (
          <div className="mt-3 rounded-lg overflow-hidden bg-we-carbon-3 inline-block">
            <img
              src={gifUrl}
              alt={ex.name}
              className="max-h-48 w-auto rounded-lg"
              loading="lazy"
            />
          </div>
        )}
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
  )
}

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
                <PublicExerciseRow key={i} ex={ex} index={i} />
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}
