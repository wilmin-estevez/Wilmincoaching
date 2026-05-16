import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@/lib/claude'

export const maxDuration = 60

const MODEL = 'claude-haiku-4-5-20251001'

const exerciseSchema = {
  type: 'object' as const,
  properties: {
    name:      { type: 'string' as const },
    muscle:    { type: 'string' as const },
    equipment: { type: 'string' as const },
    sets:      { type: 'number' as const },
    reps:      { type: 'string' as const },
    rest_s:    { type: 'number' as const },
    weight:    { type: 'string' as const },
    gif_url:   { type: 'string' as const },
    notes:     { type: 'string' as const },
  },
  required: ['name', 'muscle', 'equipment', 'sets', 'reps', 'rest_s', 'weight'],
}

const daySchema = {
  type: 'object' as const,
  properties: {
    name:      { type: 'string' as const },
    exercises: { type: 'array' as const, items: exerciseSchema },
  },
  required: ['name', 'exercises'],
}

export async function POST(req: NextRequest) {
  try {
    const { plan, message: userMessage, trainingDays } = await req.json()

    const days: string[] = trainingDays ?? Object.keys(plan)
    const dayProperties: Record<string, typeof daySchema> = {}
    for (const d of days) dayProperties[d] = daySchema

    const prompt = `Eres el asistente de entrenamiento de Wilmin Estévez, fitness coach en RD.

Esta es la rutina actual del cliente (JSON):
${JSON.stringify(plan)}

El coach quiere hacer el siguiente cambio:
"${userMessage}"

Instrucciones:
- Aplica SOLO el cambio solicitado
- Mantén todos los días y ejercicios que no se mencionan EXACTAMENTE igual
- Si el cambio aplica a todos los días, aplícalo en cada día
- Devuelve la rutina completa`

    const apiResponse = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      tools: [{
        name: 'submit_routine',
        description: 'Submit the updated training routine',
        input_schema: {
          type: 'object' as const,
          properties: dayProperties,
          required: days,
        },
      }],
      tool_choice: { type: 'tool' as const, name: 'submit_routine' },
      messages: [{ role: 'user' as const, content: prompt }],
    })

    const toolUse = apiResponse.content.find(b => b.type === 'tool_use')
    if (!toolUse || toolUse.type !== 'tool_use') throw new Error('No se pudo modificar la rutina')

    return NextResponse.json({ days: toolUse.input })
  } catch (err) {
    console.error('[edit-training-plan]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error modificando rutina' },
      { status: 500 },
    )
  }
}
