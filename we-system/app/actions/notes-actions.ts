'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addNote(clientId: string, content: string, category: string = '') {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('client_notes').insert({ client_id: clientId, content, category })
  revalidatePath(`/clients/${clientId}/notas`)
}

export async function deleteNote(clientId: string, noteId: string) {
  const supabase = await createClient()
  await supabase.from('client_notes').delete().eq('id', noteId)
  revalidatePath(`/clients/${clientId}/notas`)
}
