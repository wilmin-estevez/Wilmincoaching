# WE System v4 — Plan 2: Client Management + Form Webhook

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete client management layer — searchable/filterable client list, full 5-tab client profile (with notes and payment CRUD), Google Forms webhook, and a new-forms section in the dashboard.

**Architecture:** Server components fetch Supabase data at request time using `await createClient()`. Client components handle interactive state (filter tabs, search, tab navigation). Server Actions mutate data (notes, payments). The form webhook is a Next.js API Route that validates a secret header then inserts into `form_submissions`. All route `params` and `searchParams` are `await`-ed — they are Promises in Next.js 16.

**Tech Stack:** Next.js 16 App Router · Supabase SSR · Server Actions · Tailwind v4 · TypeScript · Vitest

**Spec:** `docs/superpowers/specs/2026-05-14-we-system-v4-design.md` §5.2–5.4 and §4

---

## File Map

```
we-system/
├── app/(dashboard)/
│   ├── clients/
│   │   ├── page.tsx                         # Client list (server component)
│   │   └── [id]/
│   │       ├── layout.tsx                   # Profile shell: fetches client, renders header + tabs
│   │       ├── page.tsx                     # Redirect → ./resumen
│   │       ├── resumen/page.tsx             # Weight history + client stats
│   │       ├── nutricion/page.tsx           # Placeholder — implemented in Plan 3
│   │       ├── entrenamiento/page.tsx       # Placeholder — implemented in Plan 3
│   │       ├── notas/page.tsx               # Notes list + create (Server Action)
│   │       └── pagos/page.tsx              # Payments list + register (Server Action)
│   └── dashboard/page.tsx                   # MODIFY: add NewFormsSection
├── components/
│   ├── clients/
│   │   ├── StatusBadge.tsx                  # Reusable status chip (server)
│   │   ├── ClientFilters.tsx               # Filter tabs (client, URLSearchParams)
│   │   └── ClientTable.tsx                 # Table of client rows (server)
│   ├── profile/
│   │   ├── ProfileHeader.tsx               # Name, avatar, stats strip (server)
│   │   └── ProfileTabs.tsx                 # Tab navigation (client, usePathname)
│   └── dashboard/
│       └── NewFormsSection.tsx             # New form submissions card (server)
├── lib/
│   └── utils.ts                             # ADD: daysRemaining(), goalLabel()
└── app/api/
    └── form-submission/
        └── route.ts                         # POST webhook from Google Apps Script
```

---

## Task 1: StatusBadge + utility functions

**Files:**
- Modify: `we-system/lib/utils.ts`
- Modify: `we-system/lib/__tests__/utils.test.ts`
- Create: `we-system/components/clients/StatusBadge.tsx`

- [ ] **Step 1: Add tests for new utilities**

Append to `we-system/lib/__tests__/utils.test.ts`:

```typescript
import { daysRemaining, goalLabel } from '../utils'

describe('daysRemaining', () => {
  it('returns null for null input', () => {
    expect(daysRemaining(null)).toBeNull()
  })

  it('returns a negative number for past dates', () => {
    const past = new Date(Date.now() - 10 * 86400000).toISOString()
    expect(daysRemaining(past)).toBeLessThan(0)
  })

  it('returns a positive number for future dates', () => {
    const future = new Date(Date.now() + 10 * 86400000).toISOString()
    expect(daysRemaining(future)).toBeGreaterThan(0)
  })
})

describe('goalLabel', () => {
  it('maps lose_fat', () => {
    expect(goalLabel('lose_fat')).toBe('Pérdida de grasa')
  })

  it('returns raw string for unknown goals', () => {
    expect(goalLabel('unknown_goal')).toBe('unknown_goal')
  })

  it('returns dash for null', () => {
    expect(goalLabel(null)).toBe('—')
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
cd C:/Users/think/Wilmincoaching/we-system && npm test
```
Expected: FAIL — `daysRemaining` and `goalLabel` not defined.

- [ ] **Step 3: Add utility functions to `we-system/lib/utils.ts`**

Append after `formatDate`:

```typescript
export function daysRemaining(expiresAt: string | null): number | null {
  if (!expiresAt) return null
  return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000)
}

const GOAL_LABELS: Record<string, string> = {
  lose_fat:    'Pérdida de grasa',
  gain_muscle: 'Ganar músculo',
  habits:      'Hábitos',
  performance: 'Rendimiento',
}

export function goalLabel(goal: string | null): string {
  if (!goal) return '—'
  return GOAL_LABELS[goal] ?? goal
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
cd C:/Users/think/Wilmincoaching/we-system && npm test
```
Expected: All tests pass (6+).

- [ ] **Step 5: Create `we-system/components/clients/StatusBadge.tsx`**

```tsx
import { cn } from '@/lib/utils'
import type { ClientStatus } from '@/lib/supabase/types'

const STATUS_LABELS: Record<ClientStatus, string> = {
  active:  'Activo',
  renew:   'Por renovar',
  expired: 'Vencido',
  new:     'Nuevo',
}

const STATUS_STYLES: Record<ClientStatus, string> = {
  active:  'bg-we-success/10 text-we-success',
  renew:   'bg-we-warn/10 text-we-warn',
  expired: 'bg-we-danger/10 text-we-danger',
  new:     'bg-we-orange/10 text-we-orange',
}

export function StatusBadge({ status }: { status: ClientStatus }) {
  return (
    <span className={cn(
      'text-[10px] font-bold px-2 py-0.5 rounded-chip uppercase tracking-wide',
      STATUS_STYLES[status] ?? 'bg-we-carbon-2 text-we-gray-mid'
    )}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
```

- [ ] **Step 6: Commit**

```bash
cd C:/Users/think/Wilmincoaching
git add we-system/lib/utils.ts we-system/lib/__tests__/utils.test.ts we-system/components/clients/StatusBadge.tsx
git commit -m "feat: StatusBadge, daysRemaining, goalLabel utilities"
```

---

## Task 2: Client list page

**Files:**
- Create: `we-system/components/clients/ClientFilters.tsx`
- Create: `we-system/components/clients/ClientTable.tsx`
- Create: `we-system/app/(dashboard)/clients/page.tsx`

- [ ] **Step 1: Create `we-system/components/clients/ClientFilters.tsx`**

```tsx
'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const FILTERS = [
  { label: 'Todos',       value: 'all' },
  { label: 'Activo',      value: 'active' },
  { label: 'Por renovar', value: 'renew' },
  { label: 'Vencido',     value: 'expired' },
  { label: 'Nuevo',       value: 'new' },
]

export function ClientFilters({ activeStatus }: { activeStatus: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function buildHref(statusValue: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (statusValue === 'all') params.delete('status')
    else params.set('status', statusValue)
    const qs = params.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map(f => (
        <Link
          key={f.value}
          href={buildHref(f.value)}
          className={cn(
            'px-3 py-1.5 rounded-btn text-xs font-bold uppercase tracking-wide transition-colors',
            activeStatus === f.value
              ? 'bg-we-orange text-white'
              : 'bg-we-carbon-1 text-we-gray-mid hover:text-we-white border border-we-carbon-2'
          )}
        >
          {f.label}
        </Link>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create `we-system/components/clients/ClientTable.tsx`**

```tsx
import Link from 'next/link'
import type { Client } from '@/lib/supabase/types'
import { StatusBadge } from './StatusBadge'
import { goalLabel, daysRemaining } from '@/lib/utils'

interface ClientTableProps {
  clients: Client[]
}

export function ClientTable({ clients }: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-8 text-center">
        <p className="text-we-gray-mid text-sm">Sin asesorados en esta categoría.</p>
      </div>
    )
  }

  return (
    <div className="bg-we-carbon border border-we-carbon-2 rounded-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-we-carbon-2">
            {['Nombre', 'Objetivo', 'Peso actual → meta', 'Días restantes', 'Estado'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-[9px] font-bold text-we-gray-mid tracking-[2px] uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-we-carbon-2">
          {clients.map(client => {
            const days = daysRemaining(client.plan_expires_at)
            return (
              <tr key={client.id} className="hover:bg-we-carbon-1 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/clients/${client.id}/resumen`} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-we-carbon-2 rounded-avatar flex items-center justify-center text-xs font-bold text-we-orange font-display flex-shrink-0">
                      {client.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-we-white font-medium hover:text-we-orange transition-colors">
                        {client.name}
                      </div>
                      {client.whatsapp && (
                        <div className="text-[10px] text-we-gray-low">{client.whatsapp}</div>
                      )}
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-we-gray-mid">
                  {goalLabel(client.goal)}
                </td>
                <td className="px-4 py-3">
                  {client.weight_kg ? (
                    <span className="text-we-white">{client.weight_kg} kg</span>
                  ) : '—'}
                  {client.goal_weight_kg ? (
                    <span className="text-we-gray-low"> → {client.goal_weight_kg} kg</span>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  {days === null ? (
                    <span className="text-we-gray-low">—</span>
                  ) : days < 0 ? (
                    <span className="text-we-danger font-bold">Vencido</span>
                  ) : days <= 7 ? (
                    <span className="text-we-warn font-bold">{days}d</span>
                  ) : (
                    <span className="text-we-white">{days}d</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={client.status} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 3: Create `we-system/app/(dashboard)/clients/page.tsx`**

```tsx
import { createClient } from '@/lib/supabase/server'
import { Topbar } from '@/components/shell/Topbar'
import { ClientFilters } from '@/components/clients/ClientFilters'
import { ClientTable } from '@/components/clients/ClientTable'
import type { Client } from '@/lib/supabase/types'

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string }>
}

export default async function ClientsPage({ searchParams }: PageProps) {
  const { status, q } = await searchParams
  const supabase = await createClient()

  let query = supabase.from('clients').select('*').order('name')

  if (status && status !== 'all') {
    query = query.eq('status', status) as typeof query
  }

  const { data } = await query
  const clients = (data ?? []) as Client[]

  const filtered = q
    ? clients.filter(c => c.name.toLowerCase().includes(q.toLowerCase()))
    : clients

  return (
    <>
      <Topbar title="ASESORADOS" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <ClientFilters activeStatus={status ?? 'all'} />
          <div className="text-xs text-we-gray-mid">
            {filtered.length} asesorado{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
        <ClientTable clients={filtered} />
      </main>
    </>
  )
}
```

- [ ] **Step 4: TypeScript check**

```bash
cd C:/Users/think/Wilmincoaching/we-system && npx tsc --noEmit 2>&1 | head -30
```
Fix any errors in files created above.

- [ ] **Step 5: Commit**

```bash
cd C:/Users/think/Wilmincoaching
git add we-system/components/clients/ we-system/app/
git commit -m "feat: client list — filters, search, table with days remaining"
```

---

## Task 3: Client profile layout + header + tabs

**Files:**
- Create: `we-system/components/profile/ProfileHeader.tsx`
- Create: `we-system/components/profile/ProfileTabs.tsx`
- Create: `we-system/app/(dashboard)/clients/[id]/layout.tsx`
- Create: `we-system/app/(dashboard)/clients/[id]/page.tsx`

- [ ] **Step 1: Create `we-system/components/profile/ProfileHeader.tsx`**

```tsx
import type { Client } from '@/lib/supabase/types'
import { StatusBadge } from '@/components/clients/StatusBadge'
import { formatDate, goalLabel } from '@/lib/utils'

export function ProfileHeader({ client }: { client: Client }) {
  const bmi = client.weight_kg && client.height_m
    ? (client.weight_kg / (client.height_m * client.height_m)).toFixed(1)
    : null

  return (
    <div className="brand-bar bg-we-carbon border-b border-we-carbon-2 px-6 py-5 flex items-start gap-6 flex-shrink-0">
      {/* Avatar */}
      <div className="w-14 h-14 bg-we-carbon-2 rounded-avatar flex items-center justify-center text-xl font-bold text-we-orange font-display flex-shrink-0">
        {client.name.slice(0, 2).toUpperCase()}
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <h1 className="font-display font-bold text-we-white text-2xl uppercase tracking-wide truncate">
            {client.name}
          </h1>
          <StatusBadge status={client.status} />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-we-gray-mid">
          {client.age && <span>{client.age} años</span>}
          {client.whatsapp && <span>📱 {client.whatsapp}</span>}
          {client.goal && <span>{goalLabel(client.goal)}</span>}
          {client.joined_at && <span>Desde {formatDate(client.joined_at)}</span>}
          {client.experience && <span>{client.experience}</span>}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-6 text-center flex-shrink-0">
        {client.weight_kg != null && (
          <div>
            <div className="font-display font-bold text-we-white text-2xl leading-none">{client.weight_kg}</div>
            <div className="text-[9px] text-we-gray-mid uppercase tracking-wide mt-1">kg actual</div>
          </div>
        )}
        {client.goal_weight_kg != null && (
          <div>
            <div className="font-display font-bold text-we-orange text-2xl leading-none">{client.goal_weight_kg}</div>
            <div className="text-[9px] text-we-gray-mid uppercase tracking-wide mt-1">kg meta</div>
          </div>
        )}
        {bmi && (
          <div>
            <div className="font-display font-bold text-we-white text-2xl leading-none">{bmi}</div>
            <div className="text-[9px] text-we-gray-mid uppercase tracking-wide mt-1">IMC</div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `we-system/components/profile/ProfileTabs.tsx`**

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Resumen',        slug: 'resumen' },
  { label: 'Nutrición',      slug: 'nutricion' },
  { label: 'Entrenamiento',  slug: 'entrenamiento' },
  { label: 'Pagos',          slug: 'pagos' },
  { label: 'Notas',          slug: 'notas' },
]

export function ProfileTabs({ clientId }: { clientId: string }) {
  const pathname = usePathname()

  return (
    <div className="flex gap-0 px-6 border-b border-we-carbon-2 bg-we-carbon flex-shrink-0">
      {TABS.map(tab => {
        const href = `/clients/${clientId}/${tab.slug}`
        const active = pathname.endsWith(`/${tab.slug}`)
        return (
          <Link
            key={tab.slug}
            href={href}
            className={cn(
              'px-4 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap',
              active
                ? 'border-we-orange text-we-white'
                : 'border-transparent text-we-gray-mid hover:text-we-white'
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Create `we-system/app/(dashboard)/clients/[id]/layout.tsx`**

```tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Topbar } from '@/components/shell/Topbar'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import type { Client } from '@/lib/supabase/types'

export default async function ClientProfileLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>
  children: React.ReactNode
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (!data) notFound()
  const client = data as unknown as Client

  return (
    <>
      <Topbar title="PERFIL" accent={client.name} />
      <div className="flex-1 overflow-y-auto flex flex-col">
        <ProfileHeader client={client} />
        <ProfileTabs clientId={client.id} />
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 4: Create `we-system/app/(dashboard)/clients/[id]/page.tsx`**

```tsx
import { redirect } from 'next/navigation'

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/clients/${id}/resumen`)
}
```

- [ ] **Step 5: TypeScript check**

```bash
cd C:/Users/think/Wilmincoaching/we-system && npx tsc --noEmit 2>&1 | head -30
```
Fix errors in created files.

- [ ] **Step 6: Commit**

```bash
cd C:/Users/think/Wilmincoaching
git add we-system/components/profile/ we-system/app/
git commit -m "feat: client profile layout — header, tabs, routing"
```

---

## Task 4: Resumen tab + placeholder tabs

**Files:**
- Create: `we-system/app/(dashboard)/clients/[id]/resumen/page.tsx`
- Create: `we-system/app/(dashboard)/clients/[id]/nutricion/page.tsx`
- Create: `we-system/app/(dashboard)/clients/[id]/entrenamiento/page.tsx`

- [ ] **Step 1: Create `we-system/app/(dashboard)/clients/[id]/resumen/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `we-system/app/(dashboard)/clients/[id]/nutricion/page.tsx`**

```tsx
export default function NutricionPage() {
  return (
    <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-8 text-center">
      <div className="text-we-orange font-display font-bold text-xl uppercase tracking-wide mb-2">
        Plan Nutricional
      </div>
      <p className="text-we-gray-mid text-sm">
        El generador de planes nutricionales con IA se implementa en el Plan 3.
      </p>
    </div>
  )
}
```

- [ ] **Step 3: Create `we-system/app/(dashboard)/clients/[id]/entrenamiento/page.tsx`**

```tsx
export default function EntrenamientoPage() {
  return (
    <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-8 text-center">
      <div className="text-we-orange font-display font-bold text-xl uppercase tracking-wide mb-2">
        Plan de Entrenamiento
      </div>
      <p className="text-we-gray-mid text-sm">
        El generador de rutinas con IA se implementa en el Plan 3.
      </p>
    </div>
  )
}
```

- [ ] **Step 4: TypeScript check**

```bash
cd C:/Users/think/Wilmincoaching/we-system && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 5: Commit**

```bash
cd C:/Users/think/Wilmincoaching
git add we-system/app/
git commit -m "feat: profile tabs — resumen (weight history), nutricion/entrenamiento placeholders"
```

---

## Task 5: Notas tab

**Files:**
- Create: `we-system/app/(dashboard)/clients/[id]/notas/page.tsx`

- [ ] **Step 1: Create `we-system/app/(dashboard)/clients/[id]/notas/page.tsx`**

```tsx
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { formatDate } from '@/lib/utils'
import type { ClientNote } from '@/lib/supabase/types'

async function addNote(formData: FormData) {
  'use server'
  const clientId = formData.get('clientId') as string
  const content = (formData.get('content') as string)?.trim()
  if (!content) return

  const supabase = await createClient()
  await supabase.from('client_notes').insert({ client_id: clientId, content })
  revalidatePath(`/clients/${clientId}/notas`)
}

export default async function NotasPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('client_notes')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  const notes = (data ?? []) as unknown as ClientNote[]

  return (
    <div className="space-y-4 max-w-2xl">
      {/* New note form */}
      <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-5">
        <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase mb-3">
          Nueva nota
        </div>
        <form action={addNote}>
          <input type="hidden" name="clientId" value={id} />
          <textarea
            name="content"
            rows={3}
            required
            placeholder="Escribe una nota sobre este asesorado..."
            className="w-full bg-we-carbon-1 border border-we-carbon-2 rounded-btn px-3 py-2.5 text-we-white text-sm focus:outline-none focus:border-we-orange transition-colors resize-none placeholder:text-we-gray-low"
          />
          <button
            type="submit"
            className="mt-2 bg-we-orange hover:bg-we-orange-dark text-white text-xs font-bold px-4 py-2 rounded-btn transition-colors uppercase tracking-wide font-display"
          >
            Guardar
          </button>
        </form>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="text-we-gray-mid text-sm">Sin notas aún.</p>
      ) : (
        <div className="space-y-2">
          {notes.map(note => (
            <div key={note.id} className="bg-we-carbon border border-we-carbon-2 rounded-card p-4">
              <div className="text-[9px] text-we-gray-mid uppercase tracking-widest mb-2">
                {formatDate(note.created_at)}
              </div>
              <div className="text-we-white text-sm whitespace-pre-wrap">{note.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

**Note on `ClientNote` type:** It's defined in `lib/supabase/types.ts` as `client_notes` table row. That interface isn't exported yet — add it now.

- [ ] **Step 2: Add `ClientNote` to `we-system/lib/supabase/types.ts`**

After the `FormSubmission` interface, add:

```typescript
export interface ClientNote {
  id: string
  client_id: string
  content: string
  category: string
  created_at: string
}
```

And add to the `Database` interface's `Tables`:

```typescript
client_notes: { Row: ClientNote; Insert: Partial<ClientNote>; Update: Partial<ClientNote> }
```

- [ ] **Step 3: TypeScript check**

```bash
cd C:/Users/think/Wilmincoaching/we-system && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 4: Commit**

```bash
cd C:/Users/think/Wilmincoaching
git add we-system/app/ we-system/lib/supabase/types.ts
git commit -m "feat: notas tab — create and view client notes"
```

---

## Task 6: Pagos tab

**Files:**
- Create: `we-system/app/(dashboard)/clients/[id]/pagos/page.tsx`

- [ ] **Step 1: Create `we-system/app/(dashboard)/clients/[id]/pagos/page.tsx`**

```tsx
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
  })
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
```

- [ ] **Step 2: TypeScript check**

```bash
cd C:/Users/think/Wilmincoaching/we-system && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/think/Wilmincoaching
git add we-system/app/
git commit -m "feat: pagos tab — payment history and register payment"
```

---

## Task 7: Form submission webhook

**Files:**
- Create: `we-system/app/api/form-submission/route.ts`

- [ ] **Step 1: Create `we-system/app/api/form-submission/route.ts`**

```typescript
import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const secret = request.headers.get('x-we-secret')
  if (secret !== process.env.FORM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('form_submissions').insert({
    raw_data: body,
    status: 'new',
  })

  if (error) {
    console.error('form_submissions insert error:', error.message)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Verify middleware lets this route through**

Open `we-system/middleware.ts` and confirm line:
```typescript
if (path.startsWith('/plan/') || path.startsWith('/api/form-submission')) {
```
is present. The middleware already whitelists this route — no change needed.

- [ ] **Step 3: TypeScript check**

```bash
cd C:/Users/think/Wilmincoaching/we-system && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 4: Commit**

```bash
cd C:/Users/think/Wilmincoaching
git add we-system/app/api/form-submission/
git commit -m "feat: form-submission webhook — stores Google Forms data in Supabase"
```

---

## Task 8: Dashboard new-forms section

**Files:**
- Create: `we-system/components/dashboard/NewFormsSection.tsx`
- Modify: `we-system/app/(dashboard)/dashboard/page.tsx`

- [ ] **Step 1: Create `we-system/components/dashboard/NewFormsSection.tsx`**

```tsx
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
```

- [ ] **Step 2: Update `we-system/app/(dashboard)/dashboard/page.tsx`**

Add `NewFormsSection` import and its data fetch. The file currently fetches `newForms` count but not the actual submissions. Replace the file with:

```tsx
import { createClient } from '@/lib/supabase/server'
import { Topbar } from '@/components/shell/Topbar'
import { KPIGrid } from '@/components/dashboard/KPIGrid'
import { HeroStrip } from '@/components/dashboard/HeroStrip'
import { NewFormsSection } from '@/components/dashboard/NewFormsSection'
import type { Client, FormSubmission } from '@/lib/supabase/types'

type RecentClient = Pick<Client, 'id' | 'name' | 'status' | 'plan_expires_at'>

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: totalActive },
    { count: toRenew },
    { count: totalExpired },
    { data: recentClients },
    { data: newSubmissionsRaw },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'renew'),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'expired'),
    supabase.from('clients').select('id, name, status, plan_expires_at').order('created_at', { ascending: false }).limit(5) as unknown as Promise<{ data: RecentClient[] | null }>,
    supabase.from('form_submissions').select('*').eq('status', 'new').order('created_at', { ascending: false }).limit(10),
  ])

  const newSubmissions = (newSubmissionsRaw ?? []) as unknown as FormSubmission[]
  const newForms = newSubmissions.length

  const kpis = [
    {
      label: 'Asesorados activos',
      value: totalActive ?? 0,
      delta: 'Total en sistema',
      deltaType: 'good' as const,
    },
    {
      label: 'Por renovar',
      value: toRenew ?? 0,
      delta: toRenew && toRenew > 0 ? 'Esta semana' : 'Al día',
      deltaType: toRenew && toRenew > 0 ? 'warn' as const : 'good' as const,
    },
    {
      label: 'Formularios nuevos',
      value: newForms,
      delta: newForms > 0 ? 'Esperando plan' : 'Sin pendientes',
      deltaType: newForms > 0 ? 'good' as const : undefined,
    },
    {
      label: 'Expirados',
      value: totalExpired ?? 0,
      delta: totalExpired && totalExpired > 0 ? 'Requieren atención' : 'Sin vencidos',
      deltaType: totalExpired && totalExpired > 0 ? 'danger' as const : 'good' as const,
    },
  ]

  return (
    <>
      <Topbar title="DASHBOARD" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <HeroStrip newForms={newForms} />
        <KPIGrid kpis={kpis} />

        <div className="grid grid-cols-2 gap-6">
          {/* New forms */}
          <NewFormsSection submissions={newSubmissions} />

          {/* Recent clients */}
          <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-5">
            <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase mb-4">
              Asesorados recientes
            </div>
            <div className="space-y-2">
              {(recentClients ?? []).map(client => (
                <div key={client.id} className="flex items-center gap-3 py-2 border-b border-we-carbon-2 last:border-0">
                  <div className="w-8 h-8 bg-we-carbon-2 rounded-avatar flex items-center justify-center text-xs font-bold text-we-orange font-display">
                    {client.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 text-sm text-we-white">{client.name}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-chip uppercase tracking-wide ${
                    client.status === 'active' ? 'bg-we-success/10 text-we-success' :
                    client.status === 'renew'  ? 'bg-we-warn/10 text-we-warn' :
                    'bg-we-danger/10 text-we-danger'
                  }`}>
                    {client.status === 'active' ? 'Activo' : client.status === 'renew' ? 'Por renovar' : 'Expirado'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
```

- [ ] **Step 3: TypeScript check**

```bash
cd C:/Users/think/Wilmincoaching/we-system && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 4: Commit**

```bash
cd C:/Users/think/Wilmincoaching
git add we-system/components/dashboard/NewFormsSection.tsx we-system/app/
git commit -m "feat: dashboard new-forms section and real expired KPI count"
```

---

## Plan 2 Complete ✅

After this plan you have:
- `/clients` — searchable, filterable client list with days-remaining column
- `/clients/[id]` — profile with 5 tabs: Resumen, Nutrición (placeholder), Entrenamiento (placeholder), Pagos, Notas
- Notes and payments created via Server Actions (no client JS needed)
- Google Forms webhook at `/api/form-submission` (validates secret, stores to Supabase)
- Dashboard shows new form submissions + real expired count

**Next plan:** Plan 3 — AI plan generation (nutrition + training), PDF export, public client link.
