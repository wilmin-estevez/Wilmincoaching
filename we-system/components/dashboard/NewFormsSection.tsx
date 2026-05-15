import type { FormSubmission } from '@/lib/supabase/types'

interface NewFormsSectionProps {
  submissions: FormSubmission[]
}

function extractName(raw: Record<string, string>): string {
  return (
    raw['Nombre completo'] ??
    raw['nombre'] ??
    raw['Nombre'] ??
    raw['name'] ??
    'Sin nombre'
  )
}

function extractGoal(raw: Record<string, string>): string {
  return (
    raw['¿Cuál es tu objetivo principal?'] ??
    raw['objetivo'] ??
    raw['Objetivo'] ??
    '—'
  )
}

export function NewFormsSection({ submissions }: NewFormsSectionProps) {
  if (submissions.length === 0) return null

  return (
    <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-we-success rounded-full animate-pulse" />
        <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase">
          Formularios nuevos
        </div>
        <div className="ml-auto text-[10px] font-bold bg-we-orange/10 text-we-orange px-2 py-0.5 rounded-chip">
          {submissions.length} nuevo{submissions.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="space-y-2">
        {submissions.map(sub => {
          const raw = sub.raw_data as Record<string, string>
          return (
            <div key={sub.id} className="flex items-center gap-3 py-2 border-b border-we-carbon-2 last:border-0">
              <div className="w-8 h-8 bg-we-orange/10 rounded-avatar flex items-center justify-center text-xs font-bold text-we-orange font-display flex-shrink-0">
                {extractName(raw).slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-we-white font-medium">{extractName(raw)}</div>
                <div className="text-xs text-we-gray-mid truncate">{extractGoal(raw)}</div>
              </div>
              <div className="text-[9px] text-we-gray-low flex-shrink-0">
                {new Date(sub.created_at).toLocaleDateString('es-DO', { day: '2-digit', month: 'short' })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
