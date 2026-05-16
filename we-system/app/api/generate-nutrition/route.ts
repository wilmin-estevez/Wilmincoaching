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

const MEASUREMENT_RULES = `
REGLAS DE MEDIDAS (el campo "unit" debe ser la medida legible completa):
- Huevos enteros: "1 huevo", "2 huevos" (NUNCA en gramos)
- Claras de huevo: "2 claras", "4 claras" (NUNCA en gramos)
- Leche y líquidos: "240ml (1 vaso)", "480ml (2 vasos)", "120ml (½ vaso)"
- Avena: "½ taza", "1 taza"
- Arroz, habichuelas: "½ taza cocida", "1 taza cocida"
- Plátano maduro: "1 plátano maduro pequeño", "1 plátano maduro mediano", "1 plátano maduro grande"
- Plátano verde: "½ plátano verde", "1 plátano verde"
- Pan de molde: "1 rebanada", "2 rebanadas"
- Frutas medianas (manzana, naranja, guayaba): "1 unidad pequeña", "1 unidad mediana"
- Aceite: "1 cdta", "1 cda"
- Para todo lo demás que sí se mide en gramos, pon: "150g", "200g", etc.`

const FOOD_RULES = `
VOCABULARIO Y RESTRICCIONES DE ALIMENTOS:
- SIEMPRE arroz blanco (NUNCA arroz integral o arroz moreno)
- Batata (NUNCA camote o boniato)
- Almendras (en vez de nueces, maní o mantequilla de maní)
- Usa mantequilla de almendras si aplica, NUNCA mantequilla de maní
- Plátano maduro o plátano verde (no banana)
- Yuca, ñame, batata, auyama — son los carbohidratos locales dominicanos
- Longaniza dominicana (no salchicha italiana)
- Pollo, res, cerdo — términos dominicanos estándar
- Habichuelas (no frijoles ni judías)
- No uses quinoa — usa arroz blanco o yuca
- No uses nueces — usa almendras tostadas
- Usa alimentos que se consiguen fácilmente en supermercados dominicanos`

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
${MEASUREMENT_RULES}
${FOOD_RULES}

Genera un plan nutricional de 7 días con:
- 4 comidas: Desayuno (7:00am) · Merienda (10:30am) · Almuerzo (1:00pm) · Cena (7:00pm)
- Exactamente 2 opciones por comida
- Máx 4 ingredientes por opción
- Ajusta carbos según nivel del día (ALTO/MEDIO/BAJO)`

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8192,
      tools: [{
        name: 'submit_plan',
        description: 'Submit the 7-day nutrition plan',
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

    const toolUse = message.content.find(b => b.type === 'tool_use')
    if (!toolUse || toolUse.type !== 'tool_use') throw new Error('No se generó el plan')

    return NextResponse.json({ meals: toolUse.input })
  } catch (err) {
    console.error('[generate-nutrition]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error generando plan' },
      { status: 500 },
    )
  }
}
