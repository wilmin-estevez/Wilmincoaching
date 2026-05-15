'use client'

import type { CycleLevel } from '@/lib/macros'

const DAYS_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const LEVEL_CLASSES: Record<CycleLevel, string> = {
  0: 'bg-we-success text-black',
  1: 'bg-we-warn text-black',
  2: 'bg-we-carbon-3 text-we-white',
}

const LEVEL_LABELS: Record<CycleLevel, string> = {
  0: 'ALTO',
  1: 'MED',
  2: 'BAJO',
}

interface Props {
  cycle: CycleLevel[]
  onChange: (c: CycleLevel[]) => void
}

export default function CarbCycleBar({ cycle, onChange }: Props) {
  function toggle(i: number) {
    const next = [...cycle] as CycleLevel[]
    next[i] = ((next[i] + 1) % 3) as CycleLevel
    onChange(next)
  }

  return (
    <div className="flex gap-1.5">
      {DAYS_SHORT.map((day, i) => {
        const level = (cycle[i] ?? 2) as CycleLevel
        return (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded text-center transition-colors cursor-pointer ${LEVEL_CLASSES[level]}`}
          >
            <span className="text-[9px] font-bold">{day}</span>
            <span className="text-[8px] leading-none">{LEVEL_LABELS[level]}</span>
          </button>
        )
      })}
    </div>
  )
}
