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
