import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  try {
    const { client_id, macros, cycle, meals } = await req.json()

    const supabase = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('nutrition_plans')
      .insert({
        client_id,
        kcal_target:    macros.kcal,
        protein_g:      macros.protein_g,
        carbs_high_g:   macros.carbs_high_g,
        carbs_mid_g:    macros.carbs_mid_g,
        carbs_low_g:    macros.carbs_low_g,
        fat_g:          macros.fat_g,
        cycle,
        meals,
        status:         'draft',
        public_slug:    nanoid(10),
      })
      .select('id, public_slug')
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('[save-nutrition-plan]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error guardando plan' },
      { status: 500 },
    )
  }
}
