import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  try {
    const { client_id, days } = await req.json()

    const supabase = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('training_plans')
      .insert({
        client_id,
        days,
        status:      'draft',
        public_slug: nanoid(10),
      })
      .select('id, public_slug')
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('[save-training-plan]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error guardando rutina' },
      { status: 500 },
    )
  }
}
