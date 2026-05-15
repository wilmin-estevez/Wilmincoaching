import { createClient } from '@/lib/supabase/server'
import TrainingGenerator from '@/components/training/TrainingGenerator'
import type { Client } from '@/lib/supabase/types'

export default async function EntrenamientoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('clients').select('*').eq('id', id).single()
  const client = data as unknown as Client | null

  if (!client) {
    return <p className="text-we-gray-mid text-sm">Cliente no encontrado.</p>
  }

  return <TrainingGenerator client={client} />
}
