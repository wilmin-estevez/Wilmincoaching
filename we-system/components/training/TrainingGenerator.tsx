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
  const [editMsg, setEditMsg] = useState('')
  const [editing, setEditing] = useState(false)

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

  async function editPlan() {
    if (!plan || !editMsg.trim()) return
    setEditing(true)
    setError(null)
    try {
      const trainingDays = DAYS_ES.filter((d) => plan[d])
      const res = await fetch('/api/edit-training-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, message: editMsg, trainingDays }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error modificando rutina')
      setPlan(data.days)
      setSavedSlug(null)
      setEditMsg('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setEditing(false)
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

          {/* Edit with AI */}
          <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-4 space-y-3">
            <div className="text-[10px] font-bold text-we-white tracking-[2px] uppercase">
              Editar rutina con IA
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={editMsg}
                onChange={(e) => setEditMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && editPlan()}
                placeholder="Ej: Cambia las sentadillas por prensa en piernas..."
                disabled={editing}
                className="flex-1 h-10 bg-we-carbon-1 border border-we-carbon-3 rounded-lg px-3 text-sm text-we-white placeholder:text-we-gray-mid focus:outline-none focus:border-we-orange disabled:opacity-50"
              />
              <button
                type="button"
                onClick={editPlan}
                disabled={editing || !editMsg.trim()}
                className="h-10 px-5 bg-we-orange hover:bg-we-orange-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs tracking-widest uppercase rounded-lg transition-colors whitespace-nowrap"
              >
                {editing ? '...' : 'APLICAR'}
              </button>
            </div>
          </div>

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
                <a
                  href={`/plan/${savedSlug}/print`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-12 px-4 flex items-center border border-we-carbon-3 text-we-gray-mid hover:text-we-white text-xs font-bold tracking-widest uppercase rounded-card transition-colors"
                >
                  PDF
                </a>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/plan/${savedSlug}`)}
                  className="h-12 px-4 border border-we-carbon-3 text-we-gray-mid hover:text-we-white text-sm rounded-card transition-colors"
                >
                  COPIAR
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
