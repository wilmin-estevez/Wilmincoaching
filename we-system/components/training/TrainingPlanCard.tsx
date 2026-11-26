'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { TrainingPlanDays } from '@/lib/supabase/types'

interface PlanCardProps {
  id: string
  name: string | null
  days: TrainingPlanDays
  createdAt: string
  publicSlug: string | null
  status: 'draft' | 'sent'
  clientId: string
  clientName: string
}

const DAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const

function planLabel(name: string | null, days: TrainingPlanDays): string {
  if (name && !name.startsWith('__')) return name
  const activeDays = DAYS.filter(d => days[d])
  const names = activeDays.map(d => days[d]!.name).filter(Boolean)
  return names.slice(0, 4).join(' · ') || 'Sin nombre'
}

function planStats(days: TrainingPlanDays) {
  const activeDays = DAYS.filter(d => days[d])
  const totalEx = activeDays.reduce((s, d) => s + (days[d]?.exercises.length ?? 0), 0)
  return { dayCount: activeDays.length, totalEx }
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function TrainingPlanCard({
  id, name, days, createdAt, publicSlug, status: initialStatus, clientId, clientName,
}: PlanCardProps) {
  const [status, setStatus] = useState(initialStatus)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const label = planLabel(name, days)
  const { dayCount, totalEx } = planStats(days)

  async function assign() {
    setLoading(true)
    try {
      const res = await fetch('/api/update-plan-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'sent' }),
      })
      if (res.ok) setStatus('sent')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-we-carbon border border-we-carbon-2 rounded-card overflow-hidden">
      <div
        className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-we-carbon-1/40 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-bold text-we-white truncate">{label}</span>
            {status === 'sent' ? (
              <span className="text-[9px] font-bold text-we-orange border border-we-orange/40 rounded px-1.5 py-0.5 tracking-widest flex-shrink-0">
                ASIGNADO
              </span>
            ) : (
              <span className="text-[9px] font-bold text-we-gray-mid border border-we-carbon-3 rounded px-1.5 py-0.5 tracking-widest flex-shrink-0">
                BORRADOR
              </span>
            )}
          </div>
          <div className="text-[11px] text-we-orange font-medium">{clientName}</div>
          <div className="text-[10px] text-we-gray-low mt-0.5">
            {fmtDate(createdAt)} · {dayCount} días · {totalEx} ejercicios
          </div>
        </div>

        <div className="flex gap-1.5 flex-shrink-0 items-center">
          <span className="text-[11px] text-we-gray-low select-none">{expanded ? '▲' : '▼'}</span>
          {status === 'draft' && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); assign() }}
              disabled={loading}
              className="h-8 px-3 text-[9px] font-bold border border-we-orange/60 text-we-orange hover:bg-we-orange/10 disabled:opacity-40 rounded-btn transition-colors tracking-widest"
            >
              {loading ? '...' : 'ASIGNAR'}
            </button>
          )}
          {status === 'sent' && publicSlug && (
            <a
              href={`/plan/${publicSlug}`}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="h-8 px-3 text-[9px] font-bold border border-we-carbon-3 text-we-gray-mid hover:text-we-white rounded-btn transition-colors tracking-widest flex items-center"
            >
              VER →
            </a>
          )}
          <Link
            href={`/clients/${clientId}/entrenamiento`}
            onClick={e => e.stopPropagation()}
            className="h-8 px-3 text-[9px] font-bold border border-we-carbon-3 text-we-gray-mid hover:text-we-white hover:border-we-white rounded-btn transition-colors tracking-widest flex items-center"
          >
            EDITAR →
          </Link>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-we-carbon-2 bg-we-carbon-1 px-5 py-4 space-y-4">
          {DAYS.filter(d => days[d]).map(d => (
            <div key={d}>
              <div className="text-[10px] font-bold text-we-orange tracking-[1.5px] uppercase mb-2">
                {days[d]!.name || d}
              </div>
              <div className="space-y-1.5">
                {days[d]!.exercises.map((ex, i) => (
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
}
