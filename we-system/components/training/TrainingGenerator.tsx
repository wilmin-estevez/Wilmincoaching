'use client'

import { useState } from 'react'
import type { Client, TrainingPlanDays } from '@/lib/supabase/types'
import { DAYS_ES } from '@/lib/macros'
import DayTrainingView from './DayTrainingView'

interface PendingCopy {
  id: string
  days: TrainingPlanDays
  sourceName: string
}

interface SavedPlan {
  id: string
  name: string | null
  days: TrainingPlanDays
  created_at: string
  public_slug: string | null
  status: 'draft' | 'sent'
}

interface Props {
  client: Client
  previousPlan?: TrainingPlanDays | null
  pendingCopyPlan?: PendingCopy | null
  savedPlans?: SavedPlan[]
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })
}

const PLAN_DAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const

function planSummary(days: TrainingPlanDays) {
  const activeDays = PLAN_DAYS.filter(d => days[d])
  const names = activeDays.map(d => days[d]!.name).filter(Boolean)
  const totalExercises = activeDays.reduce((s, d) => s + (days[d]?.exercises.length ?? 0), 0)
  return { names, totalExercises, dayCount: activeDays.length }
}

export default function TrainingGenerator({ client, previousPlan, pendingCopyPlan, savedPlans: initialSavedPlans }: Props) {
  const [plan, setPlan] = useState<TrainingPlanDays | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedSlug, setSavedSlug] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editMsg, setEditMsg] = useState('')
  const [editing, setEditing] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const [showCopyModal, setShowCopyModal] = useState(false)
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([])
  const [copyTargetId, setCopyTargetId] = useState('')
  const [copying, setCopying] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  const [pendingCopy, setPendingCopy] = useState<PendingCopy | null>(pendingCopyPlan ?? null)
  const [approving, setApproving] = useState(false)

  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(initialSavedPlans ?? [])
  const [showAllPlans, setShowAllPlans] = useState(false)
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null)

  function toggleExpand(id: string) {
    setExpandedPlanId(prev => prev === id ? null : id)
  }

  async function generatePlan() {
    setLoading(true)
    setError(null)
    setEditMode(false)
    setSavedSlug(null)
    try {
      const res = await fetch('/api/generate-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client, previousPlan: previousPlan ?? undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error generando rutina')
      setPlan(data.days)
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
      setSavedPlans(prev => [{
        id: data.id,
        name: null,
        days: plan,
        created_at: new Date().toISOString(),
        public_slug: data.public_slug,
        status: 'draft',
      }, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  function loadSavedPlan(p: SavedPlan) {
    setPlan(p.days)
    setSavedSlug(p.public_slug)
    setEditMode(false)
  }

  async function assignPlan(p: SavedPlan) {
    try {
      const res = await fetch('/api/update-plan-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, status: 'sent' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error')
      setSavedPlans(prev => prev.map(sp => sp.id === p.id ? { ...sp, status: 'sent' } : sp))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error asignando rutina')
    }
  }

  async function deleteSavedPlan(id: string) {
    try {
      const res = await fetch('/api/delete-training-plan', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error('Error')
      setSavedPlans(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando rutina')
    }
  }

  function updateExercise(dayKey: string, index: number, field: string, value: string | number) {
    setPlan(prev => {
      if (!prev) return prev
      const day = prev[dayKey as keyof TrainingPlanDays]
      if (!day) return prev
      const exs = [...day.exercises]
      exs[index] = { ...exs[index], [field]: value }
      return { ...prev, [dayKey]: { ...day, exercises: exs } }
    })
    setSavedSlug(null)
  }

  function moveExercise(dayKey: string, index: number, dir: 'up' | 'down') {
    setPlan(prev => {
      if (!prev) return prev
      const day = prev[dayKey as keyof TrainingPlanDays]
      if (!day) return prev
      const exs = [...day.exercises]
      const newIdx = dir === 'up' ? index - 1 : index + 1
      if (newIdx < 0 || newIdx >= exs.length) return prev
      ;[exs[index], exs[newIdx]] = [exs[newIdx], exs[index]]
      return { ...prev, [dayKey]: { ...day, exercises: exs } }
    })
    setSavedSlug(null)
  }

  function deleteExercise(dayKey: string, index: number) {
    setPlan(prev => {
      if (!prev) return prev
      const day = prev[dayKey as keyof TrainingPlanDays]
      if (!day) return prev
      return { ...prev, [dayKey]: { ...day, exercises: day.exercises.filter((_, i) => i !== index) } }
    })
    setSavedSlug(null)
  }

  function renameDay(dayKey: string, newName: string) {
    setPlan(prev => {
      if (!prev) return prev
      const day = prev[dayKey as keyof TrainingPlanDays]
      if (!day) return prev
      return { ...prev, [dayKey]: { ...day, name: newName } }
    })
    setSavedSlug(null)
  }

  async function openCopyModal() {
    setShowCopyModal(true)
    setCopyError(null)
    setCopySuccess(false)
    if (clients.length === 0) {
      try {
        const res = await fetch('/api/list-clients')
        if (res.ok) {
          const data = await res.json()
          setClients((data.clients ?? []).filter((c: { id: string }) => c.id !== client.id))
        }
      } catch {}
    }
  }

  async function copyToClient() {
    if (!plan || !copyTargetId) return
    setCopying(true)
    setCopyError(null)
    try {
      const res = await fetch('/api/copy-training-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          days: plan,
          source_client_id: client.id,
          source_client_name: client.name,
          target_client_id: copyTargetId,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error copiando')
      setCopySuccess(true)
      setTimeout(() => setShowCopyModal(false), 1500)
    } catch (err) {
      setCopyError(err instanceof Error ? err.message : 'Error')
    } finally {
      setCopying(false)
    }
  }

  async function approveCopy() {
    if (!pendingCopy) return
    setApproving(true)
    try {
      const res = await fetch('/api/approve-training-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: pendingCopy.id, client_id: client.id }),
      })
      if (!res.ok) throw new Error('Error aprobando')
      setPlan(pendingCopy.days)
      setPendingCopy(null)
      setSavedSlug(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error aprobando rutina')
    } finally {
      setApproving(false)
    }
  }

  const trainingDays = DAYS_ES.filter((d) => plan?.[d])

  return (
    <div className="space-y-5 max-w-3xl">
      {pendingCopy && (
        <div className="bg-we-carbon border border-we-orange/40 rounded-card p-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-we-orange tracking-widest uppercase mb-0.5">
              Rutina pendiente de aprobación
            </div>
            <div className="text-sm text-we-white">
              Copiada desde <span className="font-bold">{pendingCopy.sourceName}</span>. ¿Activar para este cliente?
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={approveCopy}
              disabled={approving}
              className="h-9 px-4 bg-we-orange hover:bg-we-orange-dark disabled:opacity-50 text-white font-bold text-xs tracking-widest uppercase rounded-btn transition-colors"
            >
              {approving ? '...' : 'APROBAR'}
            </button>
            <button
              type="button"
              onClick={() => setPendingCopy(null)}
              className="h-9 px-3 border border-we-carbon-3 text-we-gray-mid hover:text-we-white text-xs rounded-btn transition-colors"
            >
              IGNORAR
            </button>
          </div>
        </div>
      )}

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

      {savedPlans.length > 0 && (
        <div className="bg-we-carbon border border-we-carbon-2 rounded-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-we-carbon-2">
            <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase">
              Historial de rutinas ({savedPlans.length})
            </div>
            {savedPlans.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllPlans(s => !s)}
                className="text-[10px] text-we-gray-mid hover:text-we-white transition-colors"
              >
                {showAllPlans ? 'Ver menos' : `Ver todos (${savedPlans.length})`}
              </button>
            )}
          </div>
          <div className="divide-y divide-we-carbon-2">
            {(showAllPlans ? savedPlans : savedPlans.slice(0, 5)).map(p => {
              const { names, totalExercises, dayCount } = planSummary(p.days)
              const sent = p.status === 'sent'
              const isExpanded = expandedPlanId === p.id
              return (
                <div key={p.id}>
                  <div
                    className="px-5 py-3 flex items-center gap-3 cursor-pointer hover:bg-we-carbon-1/40 transition-colors"
                    onClick={() => toggleExpand(p.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-we-white truncate mb-0.5">
                        {p.name && !p.name.startsWith('__') ? p.name : (names.slice(0, 3).join(' · ') || 'Programa de Entrenamiento')}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-we-gray-low">{dayCount} días · Generada {fmtDate(p.created_at)}</span>
                        {sent ? (
                          <span className="text-[9px] font-bold text-we-orange border border-we-orange/40 rounded px-1.5 py-0.5 tracking-widest">
                            Asignada
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-we-gray-mid border border-we-carbon-3 rounded px-1.5 py-0.5 tracking-widest">
                            Borrador
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0 items-center">
                      <span className="text-[11px] text-we-gray-low select-none">{isExpanded ? '▲' : '▼'}</span>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); loadSavedPlan(p) }}
                        className="h-7 px-2.5 text-[9px] font-bold border border-we-carbon-3 text-we-gray-mid hover:text-we-white hover:border-we-white rounded transition-colors tracking-widest"
                      >
                        CARGAR
                      </button>
                      {!sent ? (
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); assignPlan(p) }}
                          className="h-7 px-2.5 text-[9px] font-bold border border-we-orange/60 text-we-orange hover:bg-we-orange/10 rounded transition-colors tracking-widest"
                        >
                          ASIGNAR
                        </button>
                      ) : p.public_slug ? (
                        <a
                          href={`/plan/${p.public_slug}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="h-7 px-2.5 text-[9px] font-bold border border-we-carbon-3 text-we-gray-mid hover:text-we-white rounded transition-colors tracking-widest flex items-center"
                        >
                          VER →
                        </a>
                      ) : null}
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); deleteSavedPlan(p.id) }}
                        className="h-7 px-2 text-[13px] text-we-gray-low hover:text-we-danger rounded transition-colors leading-none"
                        title="Eliminar borrador"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-we-carbon-2 bg-we-carbon-1 px-5 py-4 space-y-4">
                      {PLAN_DAYS.filter(d => p.days[d]).map(d => (
                        <div key={d}>
                          <div className="text-[10px] font-bold text-we-orange tracking-[1.5px] uppercase mb-2">
                            {p.days[d]!.name || d}
                          </div>
                          <div className="space-y-1.5">
                            {p.days[d]!.exercises.map((ex, i) => (
                              <div key={i} className="flex items-center gap-2 text-[11px]">
                                {ex.superset_group && (
                                  <span className="text-[9px] font-bold text-we-orange border border-we-orange/40 rounded px-1 tracking-widest">
                                    SS-{ex.superset_group}
                                  </span>
                                )}
                                <span className="text-we-white font-medium">{ex.name}</span>
                                <span className="text-we-gray-mid">{ex.sets}×{ex.reps}</span>
                                {ex.rest_s > 0 && (
                                  <span className="text-we-gray-low">{ex.rest_s}s descanso</span>
                                )}
                                {ex.weight && ex.weight !== '0' && (
                                  <span className="text-we-gray-low">{ex.weight}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {plan && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-we-gray-mid">
              {trainingDays.length} días · {trainingDays.reduce((a, d) => a + (plan[d]?.exercises.length ?? 0), 0)} ejercicios
            </div>
            <button
              type="button"
              onClick={() => setEditMode(e => !e)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-btn border transition-colors ${
                editMode
                  ? 'bg-we-orange border-we-orange text-white'
                  : 'border-we-carbon-3 text-we-gray-mid hover:border-we-orange hover:text-we-orange'
              }`}
            >
              {editMode ? '✓ MODO EDICIÓN ACTIVO' : '✏️ EDITAR MANUALMENTE'}
            </button>
          </div>

          {trainingDays.map((day) => (
            <DayTrainingView
              key={day}
              day={plan[day]!}
              dayName={day}
              editMode={editMode}
              onUpdateExercise={(i, f, v) => updateExercise(day, i, f, v)}
              onMoveExercise={(i, dir) => moveExercise(day, i, dir)}
              onDeleteExercise={(i) => deleteExercise(day, i)}
              onRenameDay={(name) => renameDay(day, name)}
            />
          ))}

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

          <div className="flex gap-2 pt-2">
            {savedSlug ? (
              <>
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
                <button
                  type="button"
                  onClick={openCopyModal}
                  className="h-12 px-4 border border-we-carbon-3 text-we-gray-mid hover:text-we-orange text-xs font-bold tracking-widest uppercase rounded-card transition-colors"
                >
                  → OTRO CLIENTE
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={savePlan}
                  disabled={saving}
                  className="flex-1 h-12 border border-we-orange text-we-orange hover:bg-we-orange/10 disabled:opacity-50 font-bold text-sm tracking-widest uppercase rounded-card transition-colors"
                >
                  {saving ? 'GUARDANDO...' : 'GUARDAR RUTINA + GENERAR LINK'}
                </button>
                <button
                  type="button"
                  onClick={openCopyModal}
                  className="h-12 px-4 border border-we-carbon-3 text-we-gray-mid hover:text-we-orange text-xs font-bold tracking-widest uppercase rounded-card transition-colors"
                >
                  → OTRO CLIENTE
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showCopyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-6 w-full max-w-sm space-y-4">
            <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase">
              Copiar rutina a otro cliente
            </div>
            {clients.length === 0 ? (
              <p className="text-we-gray-mid text-sm">Cargando clientes...</p>
            ) : (
              <select
                value={copyTargetId}
                onChange={(e) => setCopyTargetId(e.target.value)}
                className="w-full h-10 bg-we-carbon-1 border border-we-carbon-3 rounded-btn px-3 text-sm text-we-white focus:outline-none focus:border-we-orange"
              >
                <option value="">Selecciona un cliente...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
            {copyError && <div className="text-we-danger text-xs">{copyError}</div>}
            {copySuccess && <div className="text-green-400 text-xs">✓ Rutina enviada. El cliente la verá al abrir su pestaña de entrenamiento.</div>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyToClient}
                disabled={copying || !copyTargetId}
                className="flex-1 h-10 bg-we-orange hover:bg-we-orange-dark disabled:opacity-40 text-white font-bold text-xs tracking-widest uppercase rounded-btn transition-colors"
              >
                {copying ? '...' : 'COPIAR RUTINA'}
              </button>
              <button
                type="button"
                onClick={() => setShowCopyModal(false)}
                className="h-10 px-4 border border-we-carbon-3 text-we-gray-mid text-xs rounded-btn hover:text-we-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
