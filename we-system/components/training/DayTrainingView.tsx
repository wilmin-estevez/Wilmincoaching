'use client'

import { useState } from 'react'
import type { TrainingDay, Exercise } from '@/lib/supabase/types'
import ExerciseCard from './ExerciseCard'

interface Props {
  day: TrainingDay
  dayName: string
  editMode?: boolean
  onUpdateExercise?: (index: number, field: string, value: string | number) => void
  onMoveExercise?: (index: number, dir: 'up' | 'down') => void
  onDeleteExercise?: (index: number) => void
  onRenameDay?: (newName: string) => void
}

function groupExercises(exercises: Exercise[]) {
  const groups: Array<{ group: string | null; items: Array<{ ex: Exercise; index: number }> }> = []
  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i]
    const g = ex.superset_group ?? null
    const last = groups[groups.length - 1]
    if (g && last?.group === g) {
      last.items.push({ ex, index: i })
    } else {
      groups.push({ group: g, items: [{ ex, index: i }] })
    }
  }
  return groups
}

const SS_COLORS: Record<string, string> = {
  A: 'border-l-orange-400',
  B: 'border-l-blue-400',
  C: 'border-l-green-400',
  D: 'border-l-purple-400',
}

export default function DayTrainingView({ day, dayName, editMode, onUpdateExercise, onMoveExercise, onDeleteExercise, onRenameDay }: Props) {
  const [localName, setLocalName] = useState(day.name)
  const groups = groupExercises(day.exercises)

  return (
    <div className="bg-we-carbon border border-we-carbon-2 rounded-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-we-carbon-2">
        <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase">{dayName}</div>
        {editMode ? (
          <input
            type="text"
            value={localName}
            onChange={(e) => {
              setLocalName(e.target.value)
              onRenameDay?.(e.target.value)
            }}
            className="bg-we-carbon-1 border border-we-orange/60 rounded px-2 py-0.5 text-[11px] text-we-orange font-bold uppercase tracking-widest focus:outline-none w-48"
          />
        ) : (
          <div className="text-[10px] text-we-orange font-bold uppercase tracking-widest">{day.name}</div>
        )}
      </div>

      <div className="divide-y divide-we-carbon-2">
        {groups.map((group) =>
          group.group ? (
            <div
              key={`ss-${group.group}-${group.items[0].index}`}
              className={`border-l-4 ${SS_COLORS[group.group] ?? 'border-l-orange-400'}`}
            >
              <div className="flex items-center gap-2 px-5 pt-2 pb-0">
                <span className="text-[9px] font-bold text-orange-400 border border-orange-400/40 rounded px-1.5 py-0.5 tracking-widest">
                  SUPERSERIE {group.group}
                </span>
              </div>
              {group.items.map(({ ex, index }) => (
                <ExerciseCard
                  key={index}
                  ex={ex}
                  index={index}
                  total={day.exercises.length}
                  editMode={editMode}
                  onUpdate={(field, value) => onUpdateExercise?.(index, field, value)}
                  onMove={(dir) => onMoveExercise?.(index, dir)}
                  onDelete={() => onDeleteExercise?.(index)}
                />
              ))}
            </div>
          ) : (
            group.items.map(({ ex, index }) => (
              <ExerciseCard
                key={index}
                ex={ex}
                index={index}
                total={day.exercises.length}
                editMode={editMode}
                onUpdate={(field, value) => onUpdateExercise?.(index, field, value)}
                onMove={(dir) => onMoveExercise?.(index, dir)}
                onDelete={() => onDeleteExercise?.(index)}
              />
            ))
          )
        )}
      </div>
    </div>
  )
}
