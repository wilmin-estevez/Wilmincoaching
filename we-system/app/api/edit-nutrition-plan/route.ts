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
                food:     { type: 'string' as const },
                amount_g: { type: 'number' as const },
                unit:     { type: 'string' as const },
              },
              required: ['food', 'amount_g', 'unit'],
            },
          },
          protein_g: { type: 'number' as const },
          carbs_g:   { type: 'number' as const },
          fat_g:     { type: 'number' as const },
          kcal:      { type: 'number' as const },
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
    cena:     mealSchema,
  },
  required: ['cycle_level', 'desayuno', 'merienda', 'almuerzo', 'cena'],
}

export async function POST(req: NextRequest) {
  try {
    const { plan, message: userMessage } = await req.json()

    const prompt = `Eres el asistente nutricional de Wilmin Estévez, fitness coach en RD.

Este es el plan nutricional actual del cliente (JSON):
${JSON.stringify(plan)}

El coach quiere hacer el siguiente cambio:
"${userMessage}"

Instrucciones:
- Aplica SOLO el cambio solicitado
- Mantén todos los días, comidas y opciones que no se mencionan EXACTAMENTE igual
- Si el cambio aplica a todos los días, aplícalo en cada día
- Usa unidades legibles en el campo "unit": huevos → "1 huevo"/"2 huevos", líquidos → "240ml (1 vaso)", pan → "1 rebanada", plátano → "1 plátano maduro mediano"
- Devuelve el plan completo con los 7 días`

    const apiResponse = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8192,
      tools: [{
        name: 'submit_plan',
        description: 'Submit the updated nutrition plan',
        input_schema: {
          type: 'object' as const,
          properties: {
            lunes: daySchema, martes: daySchema, miercoles: daySchema,
            jueves: daySchema, viernes: daySchema, sabado: daySchema, domingo: daySchema,
          },
          required: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
        },
      }],
      tool_choice: { type: 'tool' as const, name: 'submit_plan' },
      messages: [{ role: 'user' as const, content: prompt }],
    })

    const toolUse = apiResponse.content.find(b => b.type === 'tool_use')
    if (!toolUse || toolUse.type !== 'tool_use') throw new Error('No se pudo modificar el plan')

    return NextResponse.json({ meals: toolUse.input })
  } catch (err) {
    console.error('[edit-nutrition-plan]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error modificando plan' },
      { status: 500 },
    )
  }
}
