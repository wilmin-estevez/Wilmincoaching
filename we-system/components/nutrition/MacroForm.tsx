'use client'

import type { Macros } from '@/lib/macros'

type NumericKey = Exclude<keyof Macros, 'cycle'>

const FIELDS: Array<{ key: NumericKey; label: string; unit: string }> = [
  { key: 'kcal',         label: 'Calorías',   unit: 'kcal' },
  { key: 'protein_g',    label: 'Proteína',    unit: 'g' },
  { key: 'carbs_high_g', label: 'Carbs ALTO',  unit: 'g' },
  { key: 'carbs_mid_g',  label: 'Carbs MEDIO', unit: 'g' },
  { key: 'carbs_low_g',  label: 'Carbs BAJO',  unit: 'g' },
  { key: 'fat_g',        label: 'Grasa',        unit: 'g' },
]

interface Props {
  macros: Macros
  onChange: (m: Macros) => void
}

export default function MacroForm({ macros, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {FIELDS.map(({ key, label, unit }) => (
        <div key={key}>
          <label className="text-[9px] text-we-gray-mid uppercase tracking-widest block mb-1">
            {label}
          </label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={macros[key] as number}
              onChange={(e) => onChange({ ...macros, [key]: Number(e.target.value) })}
              className="w-full bg-we-carbon-1 border border-we-carbon-3 rounded px-2 py-1.5 text-we-white text-sm focus:outline-none focus:border-we-orange"
            />
            <span className="text-we-gray-mid text-xs flex-shrink-0">{unit}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
