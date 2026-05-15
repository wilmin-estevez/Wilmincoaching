'use client'

import { useState } from 'react'
import type { Client, TrainingPlanDays } from '@/lib/supabase/types'
import { DAYS_ES } from '@/lib/macros'
import DayTrainingView from './DayTrainingView'

export default function TrainingGenerator({ client }: { client: Client }) {
  const [plan, setPlan] = useState<TrainingPlanDays | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedSlug, setSavedSlug] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function generatePlan() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error generando rutina')
      setPlan(data.days)
      setSavedSlug(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  async function savePlan() {
    if (!plan) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/save-training-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: client.id, days: plan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error guardando rutina')
      setSavedSlug(data.public_slug)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  const trainingDays = DAYS_ES.filter((d) => plan?.[d])

  return (
    <div className="space-y-5 max-w-3xl">
      <button
        type="button"
        onClick={generatePlan}
        disabled={loading}
        className="w-full h-12 bg-we-orange hover:bg-we-orange-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm tracking-widest uppercase rounded-card transition-colors"
      >
        {loading ? 'GENERANDO RUTINA CON IA... ~10s' : 'GENERAR RUTINA CON IA'}
      </button>

      {error && (
        <div className="bg-we-danger/10 border border-we-danger/30 rounded-card p-4 text-we-danger text-sm">
          {error}
        </div>
      )}

      {plan && (
        <div className="space-y-4">
          {trainingDays.map((day) => (
            <DayTrainingView key={day} day={plan[day]!} dayName={day} />
          ))}

          <div className="pt-2">
            {savedSlug ? (
              <div className="flex items-center gap-3">
                <a
                  href={`/plan/${savedSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 h-12 flex items-center justify-center border border-we-orange text-we-orange hover:bg-we-orange/10 font-bold text-sm tracking-widest uppercase rounded-card transition-colors"
                >
                  VER LINK PÚBLICO →
                </a>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/plan/${savedSlug}`)}
                  className="h-12 px-4 border border-we-carbon-3 text-we-gray-mid hover:text-we-white text-sm rounded-card transition-colors"
                >
                  COPIAR LINK
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={savePlan}
                disabled={saving}
                className="w-full h-12 border border-we-orange text-we-orange hover:bg-we-orange/10 disabled:opacity-50 font-bold text-sm tracking-widest uppercase rounded-card transition-colors"
              >
                {saving ? 'GUARDANDO...' : 'GUARDAR RUTINA + GENERAR LINK'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
