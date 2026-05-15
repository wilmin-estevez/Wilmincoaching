import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import type { Client, WeightEntry } from '@/lib/supabase/types'

export default async function ResumenPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: weightsRaw }, { data: clientRaw }] = await Promise.all([
    supabase
      .from('weight_entries')
      .select('*')
      .eq('client_id', id)
      .order('recorded_at', { ascending: false })
      .limit(12),
    supabase.from('clients').select('*').eq('id', id).single(),
  ])

  const weights = (weightsRaw ?? []) as unknown as WeightEntry[]
  const client = clientRaw as unknown as Client | null

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Weight history */}
      <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-5">
        <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase mb-4">
          Historial de peso
        </div>
        {weights.length === 0 ? (
          <p className="text-we-gray-mid text-sm">Sin registros de peso aún.</p>
        ) : (
          <div className="space-y-0 divide-y divide-we-carbon-2">
            {weights.map((w, i) => (
              <div key={w.id} className="flex items-center gap-4 py-3">
                <div className="w-12 text-[10px] text-we-gray-low">{formatDate(w.recorded_at)}</div>
                <div className="font-display font-bold text-we-white text-xl w-20">
                  {w.weight_kg} <span className="text-xs font-normal text-we-gray-mid">kg</span>
                </div>
                {i > 0 && weights[i - 1] && (
                  <div className={`text-xs font-bold ${
                    w.weight_kg < weights[i - 1].weight_kg ? 'text-we-success' :
                    w.weight_kg > weights[i - 1].weight_kg ? 'text-we-danger' : 'text-we-gray-mid'
                  }`}>
                    {w.weight_kg < weights[i - 1].weight_kg
                      ? `↓ ${(weights[i - 1].weight_kg - w.weight_kg).toFixed(1)} kg`
                      : w.weight_kg > weights[i - 1].weight_kg
                      ? `↑ ${(w.weight_kg - weights[i - 1].weight_kg).toFixed(1)} kg`
                      : '→ igual'}
                  </div>
                )}
                {w.note && <div className="text-xs text-we-gray-low truncate flex-1">{w.note}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Client stats */}
      {client && (
        <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-5">
          <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase mb-4">
            Datos del asesorado
          </div>
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            {[
              { label: 'Días de entreno',   value: client.training_days ? `${client.training_days} días/semana` : null },
              { label: 'Acceso gym',        value: client.gym_access },
              { label: 'Experiencia',       value: client.experience },
              { label: 'Restricciones',     value: client.dietary_restrictions },
              { label: 'Lesiones',          value: client.injuries },
              { label: 'Timeline',          value: client.timeline },
            ].filter(item => item.value).map(({ label, value }) => (
              <div key={label}>
                <div className="text-[9px] text-we-gray-mid uppercase tracking-widest mb-0.5">{label}</div>
                <div className="text-we-white text-sm">{value}</div>
              </div>
            ))}
          </div>
          {client.notes && (
            <div className="mt-4 pt-4 border-t border-we-carbon-2">
              <div className="text-[9px] text-we-gray-mid uppercase tracking-widest mb-1">Notas generales</div>
              <div className="text-we-white text-sm whitespace-pre-wrap">{client.notes}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
