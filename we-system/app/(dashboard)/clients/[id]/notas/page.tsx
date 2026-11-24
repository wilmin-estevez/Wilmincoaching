import { createClient } from '@/lib/supabase/server'
import type { Client, ClientNote } from '@/lib/supabase/types'
import NotesWithAI from '@/components/notes/NotesWithAI'

export default async function NotasPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: clientData }, { data: notesData }] = await Promise.all([
    supabase.from('clients').select('id, name, goal, injuries, dietary_restrictions').eq('id', id).single(),
    supabase.from('client_notes').select('*').eq('client_id', id).order('created_at', { ascending: false }),
  ])

  const client = clientData as unknown as Pick<Client, 'id' | 'name' | 'goal' | 'injuries' | 'dietary_restrictions'> | null
  const notes = (notesData ?? []) as unknown as ClientNote[]

  if (!client) return <p className="text-we-gray-mid text-sm">Cliente no encontrado.</p>

  const clientInfo = [
    client.goal       ? `Objetivo: ${client.goal}`                           : '',
    client.injuries   ? `Lesiones: ${client.injuries}`                       : '',
    (client as any).dietary_restrictions ? `Restricciones: ${(client as any).dietary_restrictions}` : '',
  ].filter(Boolean).join(' · ')

  return (
    <NotesWithAI
      clientId={client.id}
      clientName={client.name}
      clientInfo={clientInfo}
      initialNotes={notes}
    />
  )
}
