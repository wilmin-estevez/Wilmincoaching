import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Payment } from '@/lib/supabase/types'

const PAYMENT_METHODS = ['Banreservas', 'Popular', 'Wise', 'Cash']

async function registerPayment(formData: FormData) {
  'use server'
  const clientId = formData.get('clientId') as string
  const amount   = Number(formData.get('amount'))
  const method   = formData.get('method') as string
  const notes    = (formData.get('notes') as string) || null

  if (!amount || amount <= 0) return

  const supabase = await createClient()
  await supabase.from('payments').insert({
    client_id: clientId,
    amount,
    method,
    status: 'paid',
    paid_at: new Date().toISOString(),
    notes,
  } as any)
  revalidatePath(`/clients/${clientId}/pagos`)
}

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  paid:    'Pagado',
  pending: 'Pendiente',
  overdue: 'Vencido',
}

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  paid:    'bg-we-success/10 text-we-success',
  pending: 'bg-we-warn/10 text-we-warn',
  overdue: 'bg-we-danger/10 text-we-danger',
}

export default async function PagosPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('payments')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  const payments = (data ?? []) as unknown as Payment[]
  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Register payment form */}
      <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-5">
        <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase mb-3">
          Registrar pago
        </div>
        <form action={registerPayment} className="grid grid-cols-3 gap-3 items-end">
          <input type="hidden" name="clientId" value={id} />
          <div>
            <label className="text-[9px] text-we-gray-mid uppercase tracking-widest block mb-1">
              Monto (USD)
            </label>
            <input
              type="number"
              name="amount"
              required
              min="1"
              step="1"
              placeholder="150"
              className="w-full bg-we-carbon-1 border border-we-carbon-2 rounded-btn px-3 py-2 text-we-white text-sm focus:outline-none focus:border-we-orange transition-colors"
            />
          </div>
          <div>
            <label className="text-[9px] text-we-gray-mid uppercase tracking-widest block mb-1">
              Método
            </label>
            <select
              name="method"
              className="w-full bg-we-carbon-1 border border-we-carbon-2 rounded-btn px-3 py-2 text-we-white text-sm focus:outline-none focus:border-we-orange transition-colors"
            >
              {PAYMENT_METHODS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[9px] text-we-gray-mid uppercase tracking-widest block mb-1">
              Notas (opcional)
            </label>
            <input
              type="text"
              name="notes"
              placeholder="Ej. Pago mensual mayo"
              className="w-full bg-we-carbon-1 border border-we-carbon-2 rounded-btn px-3 py-2 text-we-white text-sm focus:outline-none focus:border-we-orange transition-colors"
            />
          </div>
          <div className="col-span-3">
            <button
              type="submit"
              className="bg-we-orange hover:bg-we-orange-dark text-white text-xs font-bold px-4 py-2 rounded-btn transition-colors uppercase tracking-wide font-display"
            >
              Registrar pago
            </button>
          </div>
        </form>
      </div>

      {/* Total */}
      {payments.length > 0 && (
        <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-5 flex items-center justify-between">
          <div className="text-[9px] text-we-gray-mid uppercase tracking-widest">Total cobrado</div>
          <div className="font-display font-bold text-we-success text-3xl">
            {formatCurrency(totalPaid)}
          </div>
        </div>
      )}

      {/* Payment history */}
      <div className="bg-we-carbon border border-we-carbon-2 rounded-card overflow-hidden">
        <div className="px-5 py-3 border-b border-we-carbon-2 text-[11px] font-bold text-we-white tracking-[2px] uppercase">
          Historial
        </div>
        {payments.length === 0 ? (
          <div className="px-5 py-4 text-sm text-we-gray-mid">Sin pagos registrados.</div>
        ) : (
          <div className="divide-y divide-we-carbon-2">
            {payments.map(p => (
              <div key={p.id} className="px-5 py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-we-white font-bold">{formatCurrency(p.amount)}</div>
                  <div className="text-xs text-we-gray-mid">
                    {p.method}
                    {p.notes ? ` · ${p.notes}` : ''}
                  </div>
                </div>
                <div className="text-xs text-we-gray-low flex-shrink-0">
                  {p.paid_at ? formatDate(p.paid_at) : '—'}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-chip uppercase tracking-wide flex-shrink-0 ${
                  PAYMENT_STATUS_STYLES[p.status] ?? 'bg-we-carbon-2 text-we-gray-mid'
                }`}>
                  {PAYMENT_STATUS_LABELS[p.status] ?? p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
