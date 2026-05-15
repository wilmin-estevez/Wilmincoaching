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
  await supabase.from('client_notes').insert({ client_id: clientId, content, category: '' } as any)
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
