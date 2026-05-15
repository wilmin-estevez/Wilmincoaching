import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@/lib/claude'

export const maxDuration = 60

const MODEL = 'claude-haiku-4-5-20251001'

const exerciseSchema = {
  type: 'object' as const,
  properties: {
    name: { type: 'string' as const },
    muscle: { type: 'string' as const },
    equipment: { type: 'string' as const },
    sets: { type: 'number' as const },
    reps: { type: 'string' as const },
    rest_s: { type: 'number' as const },
    weight: { type: 'string' as const },
    gif_url: { type: 'string' as const },
    notes: { type: 'string' as const },
  },
  required: ['name', 'muscle', 'equipment', 'sets', 'reps', 'rest_s', 'weight'],
}

const daySchema = {
  type: 'object' as const,
  properties: {
    name: { type: 'string' as const },
    exercises: { type: 'array' as const, items: exerciseSchema },
  },
  required: ['name', 'exercises'],
}

export async function POST(req: NextRequest) {
  try {
    const { client } = await req.json()

    const daysCount = client.training_days ?? 4
    const ALL_DAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    const trainingDays = ALL_DAYS.slice(0, daysCount)

    const dayProperties: Record<string, typeof daySchema> = {}
    for (const d of trainingDays) dayProperties[d] = daySchema

    const prompt = `Eres el asistente de entrenamiento de Wilmin Estévez, fitness coach en RD.
Cliente: ${client.name}, ${client.age ?? '?'} años, ${client.weight_kg ?? '?'}kg.
Objetivo: ${client.goal ?? 'habits'}. Experiencia: ${client.experience ?? 'intermedio'}.
Días: ${trainingDays.join(', ')}. Acceso: ${client.gym_access ?? 'gimnasio completo'}.
Lesiones: ${client.injuries ?? 'ninguna'}.

Genera una rutina de ${daysCount} días con nombre de día y 5–6 ejercicios por día.`

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      tools: [{
        name: 'submit_routine',
        description: 'Submit the training routine',
        input_schema: {
          type: 'object' as const,
          properties: dayProperties,
          required: trainingDays,
        },
      }],
      tool_choice: { type: 'tool' as const, name: 'submit_routine' },
      messages: [{ role: 'user' as const, content: prompt }],
    })

    const toolUse = message.content.find(b => b.type === 'tool_use')
    if (!toolUse || toolUse.type !== 'tool_use') throw new Error('No se generó la rutina')

    const days = toolUse.input
    return NextResponse.json({ days })
  } catch (err) {
    console.error('[generate-training]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error generando rutina' },
      { status: 500 },
    )
  }
}
