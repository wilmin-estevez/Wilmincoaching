'use client'

import { useState } from 'react'
import { addNote, deleteNote } from '@/app/actions/notes-actions'
import { formatDate } from '@/lib/utils'
import type { ClientNote } from '@/lib/supabase/types'

const CATEGORIES = [
  { key: 'general',       label: 'General' },
  { key: 'salud',         label: 'Salud' },
  { key: 'nutricion',     label: 'Nutrición' },
  { key: 'entrenamiento', label: 'Entrenamiento' },
  { key: 'motivacion',    label: 'Motivación' },
  { key: 'objetivo',      label: 'Objetivo' },
]

interface Props {
  clientId: string
  clientName: string
  clientInfo: string
  initialNotes: ClientNote[]
}

export default function NotesWithAI({ clientId, clientName, clientInfo, initialNotes }: Props) {
  const [inputMsg, setInputMsg] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [editedSuggestion, setEditedSuggestion] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [filterCategory, setFilterCategory] = useState('')
  const [aiError, setAiError] = useState<string | null>(null)

  async function askAI() {
    if (!inputMsg.trim()) return
    setLoadingAI(true)
    setAiError(null)
    try {
      const res = await fetch('/api/notes-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientInfo,
          existingNotes: initialNotes.map(n => `[${n.category || 'general'}] ${n.content}`).join('\n---\n'),
          message: inputMsg,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error')
      setAiSuggestion(data.note)
      setEditedSuggestion(data.note)
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Error con la IA')
    } finally {
      setLoadingAI(false)
    }
  }

  async function handleSave() {
    const content = (aiSuggestion ? editedSuggestion : inputMsg).trim()
    if (!content) return
    setSaving(true)
    try {
      await addNote(clientId, content, selectedCategory)
      setInputMsg('')
      setAiSuggestion('')
      setEditedSuggestion('')
    } finally {
      setSaving(false)
    }
  }

  const filtered = filterCategory
    ? initialNotes.filter(n => n.category === filterCategory)
    : initialNotes

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-5 space-y-3">
        <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase">Nueva nota</div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              type="button"
              onClick={() => setSelectedCategory(c.key)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                selectedCategory === c.key
                  ? 'bg-we-orange border-we-orange text-white'
                  : 'border-we-carbon-3 text-we-gray-mid hover:border-we-orange/50 hover:text-we-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) askAI() }}
            placeholder="Ej: Tiene dolor en la rodilla izquierda, ajustar ejercicios de pierna..."
            className="flex-1 h-10 bg-we-carbon-1 border border-we-carbon-3 rounded-lg px-3 text-sm text-we-white placeholder:text-we-gray-low focus:outline-none focus:border-we-orange transition-colors"
          />
          <button
            type="button"
            onClick={askAI}
            disabled={loadingAI || !inputMsg.trim()}
            className="h-10 px-4 bg-we-orange hover:bg-we-orange-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs tracking-widest uppercase rounded-lg transition-colors whitespace-nowrap"
          >
            {loadingAI ? '...' : 'IA ✦'}
          </button>
        </div>

        {aiError && <div className="text-we-danger text-xs">{aiError}</div>}

        {aiSuggestion && (
          <div className="space-y-2 pt-1">
            <div className="text-[9px] font-bold text-we-orange tracking-widest uppercase">
              Sugerencia — edita si necesitas:
            </div>
            <textarea
              value={editedSuggestion}
              onChange={(e) => setEditedSuggestion(e.target.value)}
              rows={3}
              className="w-full bg-we-carbon-1 border border-we-orange/40 rounded-btn px-3 py-2.5 text-we-white text-sm focus:outline-none focus:border-we-orange transition-colors resize-none"
            />
          </div>
        )}

        {(aiSuggestion || inputMsg.trim()) && (
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-we-orange hover:bg-we-orange-dark disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-btn transition-colors uppercase tracking-widest"
            >
              {saving ? 'GUARDANDO...' : 'GUARDAR NOTA'}
            </button>
            {aiSuggestion && (
              <button
                type="button"
                onClick={() => { setAiSuggestion(''); setEditedSuggestion('') }}
                className="text-[11px] text-we-gray-low hover:text-we-gray-mid transition-colors"
              >
                Descartar sugerencia
              </button>
            )}
          </div>
        )}
      </div>

      {initialNotes.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterCategory('')}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
              !filterCategory
                ? 'bg-we-orange border-we-orange text-white'
                : 'border-we-carbon-3 text-we-gray-mid hover:border-we-orange/50'
            }`}
          >
            Todas ({initialNotes.length})
          </button>
          {CATEGORIES.map(c => {
            const count = initialNotes.filter(n => n.category === c.key).length
            if (!count) return null
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setFilterCategory(c.key)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                  filterCategory === c.key
                    ? 'bg-we-orange border-we-orange text-white'
                    : 'border-we-carbon-3 text-we-gray-mid hover:border-we-orange/50'
                }`}
              >
                {c.label} ({count})
              </button>
            )
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-we-gray-mid text-sm">
          Sin notas{filterCategory ? ` de ${filterCategory}` : ''} aún.
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map(note => (
            <div key={note.id} className="bg-we-carbon border border-we-carbon-2 rounded-card p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {note.category && (
                    <span className="text-[9px] font-bold text-we-orange border border-we-orange/40 rounded px-1.5 py-0.5 uppercase tracking-widest">
                      {note.category}
                    </span>
                  )}
                  <span className="text-[9px] text-we-gray-low uppercase tracking-widest">
                    {formatDate(note.created_at)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={async () => { await deleteNote(clientId, note.id) }}
                  className="text-[13px] text-we-gray-low hover:text-we-danger transition-colors leading-none flex-shrink-0"
                  title="Eliminar nota"
                >
                  ×
                </button>
              </div>
              <div className="text-we-white text-sm whitespace-pre-wrap">{note.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
