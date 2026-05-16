'use client'

import { useState } from 'react'
import type { Client, NutritionPlanMeals } from '@/lib/supabase/types'
import { calcMacros, defaultCycle, DAYS_ES, type Macros, type CycleLevel } from '@/lib/macros'
import MacroForm from './MacroForm'
import CarbCycleBar from './CarbCycleBar'
import DayPlanView from './DayPlanView'

export default function NutritionGenerator({ client }: { client: Client }) {
  const [macros, setMacros] = useState<Macros>(() => calcMacros(client))
  const [cycle, setCycle] = useState<CycleLevel[]>(() => defaultCycle(client.training_days))
  const [plan, setPlan] = useState<NutritionPlanMeals | null>(null)
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
      const res = await fetch('/api/generate-nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client, macros, cycle }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error generando plan')
      setPlan(data.meals)
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
      const res = await fetch('/api/edit-nutrition-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, message: editMsg }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error modificando plan')
      setPlan(data.meals)
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
      const res = await fetch('/api/save-nutrition-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: client.id, macros, cycle, meals: plan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error guardando plan')
      setSavedSlug(data.public_slug)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Macro + Cycle config card */}
      <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-5 space-y-5">
        <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase">
          Macros objetivo
        </div>
        <MacroForm macros={macros} onChange={setMacros} />
        <div className="border-t border-we-carbon-2 pt-4">
          <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase mb-3">
            Ciclo de carbos — 7 días
          </div>
          <CarbCycleBar cycle={cycle} onChange={setCycle} />
        </div>
      </div>

      {/* Generate CTA */}
      <button
        onClick={generatePlan}
        disabled={loading}
        className="w-full h-12 bg-we-orange hover:bg-we-orange-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm tracking-widest uppercase rounded-card transition-colors"
      >
        {loading ? 'GENERANDO PLAN CON IA... ~15s' : 'GENERAR PLAN CON IA'}
      </button>

      {error && (
        <div className="bg-we-danger/10 border border-we-danger/30 rounded-card p-4 text-we-danger text-sm">
          {error}
        </div>
      )}

      {/* Generated plan */}
      {plan && (
        <div className="space-y-4">
          {DAYS_ES.map((day) => {
            const dayData = plan[day]
            if (!dayData) return null
            return <DayPlanView key={day} day={dayData} dayName={day} />
          })}

          {/* Edit with AI */}
          <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-4 space-y-3">
            <div className="text-[10px] font-bold text-we-white tracking-[2px] uppercase">
              Editar plan con IA
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={editMsg}
                onChange={(e) => setEditMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && editPlan()}
                placeholder="Ej: Quita el arroz del almuerzo y ponle yuca..."
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

          {/* Save / public link */}
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
                {saving ? 'GUARDANDO...' : 'GUARDAR PLAN + GENERAR LINK'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
