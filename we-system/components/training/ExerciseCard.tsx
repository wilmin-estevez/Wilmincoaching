'use client'

import { useEffect, useState } from 'react'
import { findExerciseGif } from '@/lib/exerciseGif'
import type { Exercise } from '@/lib/supabase/types'

export default function ExerciseCard({ ex, index }: { ex: Exercise; index: number }) {
  const [gifUrl, setGifUrl] = useState<string | null>(null)
  const [gifOpen, setGifOpen] = useState(false)

  useEffect(() => {
    findExerciseGif(ex.name).then(setGifUrl)
  }, [ex.name])

  return (
    <div className="px-5 py-3 flex items-start gap-4">
      <div className="w-6 h-6 rounded-full bg-we-carbon-3 flex items-center justify-center text-[10px] text-we-gray-mid font-bold flex-shrink-0 mt-0.5">
        {index + 1}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold text-we-white">{ex.name}</div>
          {gifUrl && (
            <button
              type="button"
              onClick={() => setGifOpen(o => !o)}
              className="text-[9px] font-bold text-we-orange border border-we-orange/40 rounded px-1.5 py-0.5 hover:bg-we-orange/10 transition-colors flex-shrink-0"
            >
              {gifOpen ? 'OCULTAR' : 'VER'}
            </button>
          )}
        </div>
        <div className="text-[10px] text-we-gray-mid mt-0.5">
          {ex.muscle} · {ex.equipment}
        </div>
        {ex.notes && (
          <div className="text-[10px] text-we-gray-low mt-1">{ex.notes}</div>
        )}
        {gifUrl && gifOpen && (
          <div className="mt-3 rounded-lg overflow-hidden bg-we-carbon-3 inline-block">
            <img
              src={gifUrl}
              alt={ex.name}
              className="max-h-52 w-auto rounded-lg"
              loading="lazy"
            />
          </div>
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
  )
}
