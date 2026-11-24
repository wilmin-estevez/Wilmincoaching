import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'
import type { TrainingPlanDays } from '@/lib/supabase/types'

export async function POST(req: NextRequest) {
  try {
    const { days, source_client_id, source_client_name, target_client_id } = await req.json() as {
      days: TrainingPlanDays
      source_client_id: string
      source_client_name: string
      target_client_id: string
    }

    const supabase = createServiceClient()
    const encodedName = `__copy_pending__:${source_client_id}:${encodeURIComponent(source_client_name)}`

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('training_plans')
      .insert({
        client_id:   target_client_id,
        days,
        status:      'draft',
        public_slug: nanoid(10),
        name:        encodedName,
      })
      .select('id, public_slug')
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('[copy-training-plan]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error copiando rutina' },
      { status: 500 },
    )
  }
}
