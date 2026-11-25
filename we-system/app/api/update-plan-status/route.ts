import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { PlanStatus } from '@/lib/supabase/types'

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json() as { id: string; status: PlanStatus }
    const supabase = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('training_plans')
      .update({ status })
      .eq('id', id)
      .select('public_slug')
      .single()
    if (error) throw error
    return NextResponse.json({ ok: true, public_slug: data.public_slug })
  } catch (err) {
    console.error('[update-plan-status]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error' },
      { status: 500 },
    )
  }
}
