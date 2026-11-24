import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { plan_id, client_id } = await req.json()
    const supabase = createServiceClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('training_plans')
      .update({ name: null, status: 'sent' })
      .eq('id', plan_id)
      .eq('client_id', client_id)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[approve-training-plan]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error aprobando rutina' },
      { status: 500 },
    )
  }
}
