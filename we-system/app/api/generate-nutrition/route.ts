import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@/lib/claude'

export const maxDuration = 60

const MODEL = 'claude-haiku-4-5-20251001'

const mealSchema = {
  type: 'object' as const,
  properties: {
    time: { type: 'string' as const },
    options: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          name: { type: 'string' as const },
          ingredients: {
            type: 'array' as const,
            items: {
              type: 'object' as const,
              properties: {
                food: { type: 'string' as const },
                amount_g: { type: 'number' as const },
                unit: { type: 'string' as const },
              },
              required: ['food', 'amount_g', 'unit'],
            },
          },
          protein_g: { type: 'number' as const },
          carbs_g: { type: 'number' as const },
          fat_g: { type: 'number' as const },
          kcal: { type: 'number' as const },
        },
        required: ['name', 'ingredients', 'protein_g', 'carbs_g', 'fat_g', 'kcal'],
      },
    },
  },
  required: ['time', 'options'],
}

const daySchema = {
  type: 'object' as const,
  properties: {
    cycle_level: { type: 'number' as const },
    desayuno: mealSchema,
    merienda: mealSchema,
    almuerzo: mealSchema,
    cena: mealSchema,
  },
  required: ['cycle_level', 'desayuno', 'merienda', 'almuerzo', 'cena'],
}

export async function POST(req: NextRequest) {
  try {
    const { client, macros, cycle } = await req.json()

    const cycleLabels = ['ALTO', 'MEDIO', 'BAJO']
    const daysEs = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    const cycleSummary = daysEs.map((d, i) => `${d}: ${cycleLabels[cycle[i] ?? 2]}`).join(', ')

    const prompt = `Eres el asistente nutricional de Wilmin Estévez, fitness coach en RD.
Cliente: ${client.name}, ${client.age ?? '?'} años, ${client.weight_kg ?? '?'}kg / ${client.height_m ?? '?'}m.
Objetivo: ${client.goal ?? 'habits'}. Restricciones: ${client.dietary_restrictions ?? 'ninguna'}.
Macros (día ALTO): ${macros.kcal}kcal · ${macros.protein_g}g prot · ${macros.fat_g}g grasa.
Carbohidratos: ALTO=${macros.carbs_high_g}g · MEDIO=${macros.carbs_mid_g}g · BAJO=${macros.carbs_low_g}g.
Ciclo de carbos: ${cycleSummary}.
cycle_level: ALTO=0, MEDIO=1, BAJO=2.

Genera un plan nutricional de 7 días con:
- 4 comidas: Desayuno (7:00am) · Merienda (10:30am) · Almuerzo (1:00pm) · Cena (7:00pm)
- Exactamente 2 opciones por comida
- Máx 4 ingredientes por opción
- Alimentos accesibles en República Dominicana
- Ajusta los carbos según el nivel de cada día`

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8192,
      tools: [{
        name: 'submit_plan',
        description: 'Submit the 7-day nutrition plan',
        input_schema: {
          type: 'object' as const,
          properties: {
            lunes: daySchema,
            martes: daySchema,
            miercoles: daySchema,
            jueves: daySchema,
            viernes: daySchema,
            sabado: daySchema,
            domingo: daySchema,
          },
          required: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
        },
      }],
      tool_choice: { type: 'tool' as const, name: 'submit_plan' },
      messages: [{ role: 'user' as const, content: prompt }],
    })

    const toolUse = message.content.find(b => b.type === 'tool_use')
    if (!toolUse || toolUse.type !== 'tool_use') throw new Error('No se generó el plan')

    const meals = toolUse.input
    return NextResponse.json({ meals })
  } catch (err) {
    console.error('[generate-nutrition]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error generando plan' },
      { status: 500 },
    )
  }
}
