import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const GH_TOKEN     = process.env.GH_TOKEN!

if (!SUPABASE_URL || !SUPABASE_KEY || !GH_TOKEN) {
  console.error('Missing required env vars. Copy .env.local.example to .env.local and fill in values.')
  process.exit(1)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = createClient<any>(SUPABASE_URL, SUPABASE_KEY)

async function fetchSyncJson(): Promise<{ clientes: ClientV3[] }> {
  const res = await fetch(
    'https://api.github.com/repos/wilmin-estevez/Wilmincoaching/contents/data/sync.json',
    { headers: { Authorization: `token ${GH_TOKEN}`, Accept: 'application/vnd.github.v3.raw' } }
  )
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`)
  return res.json() as Promise<{ clientes: ClientV3[] }>
}

interface ClientV3 {
  id: string | number
  name: string
  phone?: string | number
  goal?: string
  altura?: number
  edad?: number
  sexo?: string
  startDate?: string
  paymentDate?: string
  activo?: boolean
  notes?: string
  quickNotes?: string
  weights?: Array<{ kg: number; date: string; note?: string }>
  checkins?: Array<{ date: string; nota?: string; score?: string | number }>
}

function mapGoal(goal: string): string {
  const g = goal.toLowerCase()
  if (g.includes('grasa') || g.includes('perder') || g.includes('bajar')) return 'lose_fat'
  if (g.includes('músculo') || g.includes('musculo') || g.includes('ganar')) return 'gain_muscle'
  if (g.includes('rendimiento') || g.includes('atlét')) return 'performance'
  return 'habits'
}

function mapStatus(c: ClientV3): string {
  if (!c.activo) return 'expired'
  if (!c.paymentDate) return 'active'
  const exp = new Date(c.paymentDate)
  const daysLeft = Math.ceil((exp.getTime() - Date.now()) / 86400000)
  if (daysLeft < 0) return 'expired'
  if (daysLeft <= 7) return 'renew'
  return 'active'
}

async function migrate() {
  console.log('Fetching sync.json from GitHub...')
  const data = await fetchSyncJson()
  const clientes: ClientV3[] = data.clientes || []
  console.log(`Found ${clientes.length} clients\n`)

  let clientsOk = 0
  let weightsOk = 0
  let checkinsOk = 0
  let errors = 0

  for (const c of clientes) {
    try {
      const latestWeight = c.weights?.length
        ? c.weights[c.weights.length - 1].kg
        : null

      const { data: inserted, error: clientErr } = await supabase
        .from('clients')
        .upsert({
          name:            c.name,
          whatsapp:        c.phone ? String(c.phone) : null,
          age:             c.edad ?? null,
          weight_kg:       latestWeight,
          height_m:        c.altura ? c.altura / 100 : null,
          goal:            mapGoal(c.goal ?? ''),
          status:          mapStatus(c),
          monthly_fee:     0,
          joined_at:       c.startDate ? new Date(c.startDate).toISOString() : new Date().toISOString(),
          plan_expires_at: c.paymentDate ? new Date(c.paymentDate).toISOString() : null,
          notes:           c.notes ?? null,
          quick_notes:     c.quickNotes ?? null,
          sex:             c.sexo ?? null,
          v3_id:           String(c.id),
        }, { onConflict: 'v3_id' })
        .select('id')
        .single()

      if (clientErr || !inserted) {
        console.error(`  x ${c.name}: ${clientErr?.message}`)
        errors++
        continue
      }

      clientsOk++
      const clientId = inserted.id
      console.log(`  ok ${c.name} (${mapStatus(c)})`)

      if (c.weights?.length) {
        const weightRows = c.weights.map(w => ({
          client_id:   clientId,
          weight_kg:   w.kg,
          recorded_at: w.date,
          note:        w.note ?? null,
        }))
        const { error: wErr } = await supabase.from('weight_entries').insert(weightRows)
        if (!wErr) weightsOk += weightRows.length
      }

      if (c.checkins?.length) {
        const checkinRows = c.checkins.map(ci => ({
          client_id:    clientId,
          checkin_date: ci.date,
          note:         ci.nota ?? null,
          score:        ci.score != null ? Number(ci.score) : null,
        }))
        const { error: ciErr } = await supabase.from('checkins').insert(checkinRows)
        if (!ciErr) checkinsOk += checkinRows.length
      }

    } catch (err) {
      console.error(`  x ${c.name}: ${err}`)
      errors++
    }
  }

  console.log(`
Migration complete
   Clients:   ${clientsOk}/${clientes.length}
   Weights:   ${weightsOk}
   Check-ins: ${checkinsOk}
   Errors:    ${errors}`)

  if (errors > 0) process.exit(1)
}

migrate().catch(err => { console.error(err); process.exit(1) })
