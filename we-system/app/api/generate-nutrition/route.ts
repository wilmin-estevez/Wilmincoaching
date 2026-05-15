import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@/lib/claude'

export const maxDuration = 60

const MODEL = 'claude-haiku-4-5-20251001'

const JSON_SCHEMA = `{
  "lunes": {
    "cycle_level": 0,
    "desayuno": { "time": "7:00am", "options": [
      { "name": "Avena con claras", "ingredients": [{ "food": "Avena", "amount_g": 80, "unit": "1 taza" }], "protein_g": 38, "carbs_g": 72, "fat_g": 4, "kcal": 468 },
      { "name": "...", "ingredients": [...], "protein_g": 0, "carbs_g": 0, "fat_g": 0, "kcal": 0 }
    ]},
    "merienda": { "time": "10:30am", "options": [{...},{...}] },
    "almuerzo":  { "time": "1:00pm",  "options": [{...},{...}] },
    "cena":      { "time": "7:00pm",  "options": [{...},{...}] }
  },
  "martes":    { "cycle_level": 1, "desayuno": {...}, "merienda": {...}, "almuerzo": {...}, "cena": {...} },
  "miercoles": { "cycle_level": 0, "desayuno": {...}, "merienda": {...}, "almuerzo": {...}, "cena": {...} },
  "jueves":    { "cycle_level": 1, "desayuno": {...}, "merienda": {...}, "almuerzo": {...}, "cena": {...} },
  "viernes":   { "cycle_level": 2, "desayuno": {...}, "merienda": {...}, "almuerzo": {...}, "cena": {...} },
  "sabado":    { "cycle_level": 2, "desayuno": {...}, "merienda": {...}, "almuerzo": {...}, "cena": {...} },
  "domingo":   { "cycle_level": 2, "desayuno": {...}, "merienda": {...}, "almuerzo": {...}, "cena": {...} }
}`

export async function POST(req: NextRequest) {
  try {
    const { client, macros, cycle } = await req.json()

    const cycleLabels = ['ALTO', 'MEDIO', 'BAJO']
    const daysEs = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    const cycleSummary = daysEs.map((d, i) => `${d}: ${cycleLabels[cycle[i] ?? 2]}`).join(', ')

    const prompt = `Eres el asistente nutricional de Wilmin Estévez, fitness coach en RD.
Cliente: ${client.name}, ${client.age ?? '?'} años, ${client.weight_kg ?? '?'}kg / ${client.height_m ?? '?'}m.
Objetivo: ${client.goal ?? 'habits'}. Restricciones dietéticas: ${client.dietary_restrictions ?? 'ninguna'}.
Días de entrenamiento: ${client.training_days ?? 4}/semana.
Macros objetivo (día ALTO): ${macros.kcal}kcal · ${macros.protein_g}g proteína · ${macros.fat_g}g grasa.
Carbohidratos por nivel: ALTO=${macros.carbs_high_g}g · MEDIO=${macros.carbs_mid_g}g · BAJO=${macros.carbs_low_g}g.
Ciclo de carbos: ${cycleSummary}.

Genera un plan nutricional de carb cycling para 7 días con:
- 4 comidas: Desayuno (7:00am) · Merienda (10:30am) · Almuerzo (1:00pm) · Cena (7:00pm)
- Exactamente 2 opciones por comida
- Cada opción: name, ingredients (máx 4 ingredientes con food/amount_g/unit), protein_g, carbs_g, fat_g, kcal
- Ajusta carbos según nivel del día (ALTO/MEDIO/BAJO)
- Alimentos accesibles en República Dominicana
- cycle_level: ${daysEs.map((d, i) => `${d}=${cycle[i] ?? 2}`).join(', ')}
- Responde SOLO con JSON válido, sin texto antes ni después:
${JSON_SCHEMA}`

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No se encontró JSON en la respuesta')

    const meals = JSON.parse(text.slice(start, end + 1))
    return NextResponse.json({ meals })
  } catch (err) {
    console.error('[generate-nutrition]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error generando plan' },
      { status: 500 },
    )
  }
}
