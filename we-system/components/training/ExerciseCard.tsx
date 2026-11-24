'use client'

import { useEffect, useState } from 'react'
import { findExerciseGif } from '@/lib/exerciseGif'
import type { Exercise } from '@/lib/supabase/types'

interface Props {
  ex: Exercise
  index: number
  total: number
  editMode?: boolean
  onUpdate?: (field: string, value: string | number) => void
  onMove?: (dir: 'up' | 'down') => void
  onDelete?: () => void
}

export default function ExerciseCard({ ex, index, total, editMode, onUpdate, onMove, onDelete }: Props) {
  const [gifUrl, setGifUrl] = useState<string | null>(ex.gif_url ?? null)
  const [gifOpen, setGifOpen] = useState(false)

  useEffect(() => {
    if (ex.gif_url) {
      setGifUrl(ex.gif_url)
      return
    }
    findExerciseGif(ex.name).then(setGifUrl)
  }, [ex.name, ex.gif_url])

  return (
    <div className="px-5 py-3 flex items-start gap-4">
      <div className="flex flex-col items-center gap-0.5 flex-shrink-0 mt-0.5">
        {editMode ? (
          <>
            <button
              type="button"
              onClick={() => onMove?.('up')}
              disabled={index === 0}
              className="w-5 h-5 flex items-center justify-center text-[10px] text-we-gray-mid hover:text-we-white disabled:opacity-20 transition-colors"
              title="Subir"
            >
              ▲
            </button>
            <div className="w-5 h-5 rounded-full bg-we-carbon-3 flex items-center justify-center text-[9px] text-we-orange font-bold">
              {index + 1}
            </div>
            <button
              type="button"
              onClick={() => onMove?.('down')}
              disabled={index === total - 1}
              className="w-5 h-5 flex items-center justify-center text-[10px] text-we-gray-mid hover:text-we-white disabled:opacity-20 transition-colors"
              title="Bajar"
            >
              ▼
            </button>
          </>
        ) : (
          <div className="w-6 h-6 rounded-full bg-we-carbon-3 flex items-center justify-center text-[10px] text-we-gray-mid font-bold">
            {index + 1}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
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
          {editMode && (
            <button
              type="button"
              onClick={onDelete}
              className="text-[9px] font-bold text-we-danger border border-we-danger/40 rounded px-1.5 py-0.5 hover:bg-we-danger/10 transition-colors flex-shrink-0 ml-auto"
            >
              QUITAR
            </button>
          )}
        </div>
        <div className="text-[10px] text-we-gray-mid mt-0.5">
          {ex.muscle} · {ex.equipment}
        </div>
        {ex.notes && !editMode && (
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
        {editMode && (
          <input
            type="text"
            value={ex.notes ?? ''}
            onChange={(e) => onUpdate?.('notes', e.target.value)}
            placeholder="Nota del ejercicio..."
            className="mt-1.5 w-full h-7 bg-we-carbon-1 border border-we-carbon-3 rounded px-2 text-[11px] text-we-gray-mid placeholder:text-we-gray-low focus:outline-none focus:border-we-orange/60 transition-colors"
          />
        )}
      </div>

      {editMode ? (
        <div className="flex gap-2 text-[10px] flex-shrink-0">
          {[
            { field: 'sets',   label: 'series', type: 'number', value: ex.sets },
            { field: 'reps',   label: 'reps',   type: 'text',   value: ex.reps },
            { field: 'rest_s', label: 'desc.s', type: 'number', value: ex.rest_s },
            { field: 'weight', label: 'peso',   type: 'text',   value: ex.weight },
          ].map(({ field, label, type, value }) => (
            <div key={field} className="flex flex-col items-center gap-0.5">
              <input
                type={type}
                value={value ?? ''}
                onChange={(e) => onUpdate?.(field, type === 'number' ? Number(e.target.value) : e.target.value)}
                className="w-14 h-7 bg-we-carbon-1 border border-we-carbon-3 rounded px-1.5 text-[11px] text-we-white text-center focus:outline-none focus:border-we-orange/60 transition-colors"
              />
              <div className="text-we-gray-low">{label}</div>
            </div>
          ))}
        </div>
      ) : (
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
      )}
    </div>
  )
}
