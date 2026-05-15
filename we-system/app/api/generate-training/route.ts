import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODEL } from '@/lib/claude'

export async function POST(req: NextRequest) {
  try {
    const { client } = await req.json()

    const daysCount = client.training_days ?? 4
    const ALL_DAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    const trainingDays = ALL_DAYS.slice(0, daysCount)

    const schemaExample = trainingDays.map((d) =>
      `  "${d}": { "name": "Nombre del día", "exercises": [{ "name": "Sentadilla", "muscle": "Pierna · Glúteo", "equipment": "Barra olímpica", "sets": 4, "reps": "12", "rest_s": 90, "weight": "60kg", "gif_url": "", "notes": "" }] }`
    ).join(',\n')

    const prompt = `Eres el asistente de entrenamiento de Wilmin Estévez, fitness coach en RD.
Cliente: ${client.name}, ${client.age ?? '?'} años, ${client.weight_kg ?? '?'}kg.
Objetivo: ${client.goal ?? 'habits'}. Experiencia: ${client.experience ?? 'intermedio'}.
Días disponibles: ${daysCount} (${trainingDays.join(', ')}).
Acceso: ${client.gym_access ?? 'gimnasio completo'}.
Lesiones/limitaciones: ${client.injuries ?? 'ninguna'}.

Genera una rutina de ${daysCount} días (${trainingDays.join(', ')}) con:
- Nombre del día (ej: "Pierna y Glúteo", "Pecho y Tríceps", "Espalda y Bíceps", "Hombro y Core")
- 5 a 7 ejercicios por día
- Cada ejercicio: name, muscle (músculos trabajados), equipment, sets (número), reps (string, ej: "12" o "8-12"), rest_s (segundos), weight (peso sugerido como string, ej: "60kg" o "Peso corporal"), gif_url (string vacío ""), notes (string vacío "")
- Nivel adecuado para experiencia: ${client.experience ?? 'intermedio'}
- Solo incluye los días de entrenamiento; omite los días de descanso del JSON
- Responde ÚNICAMENTE en JSON válido con esta estructura exacta:
{
${schemaExample}
}`

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No se encontró JSON válido en la respuesta')

    const days = JSON.parse(match[0])
    return NextResponse.json({ days })
  } catch (err) {
    console.error('[generate-training]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error generando rutina' },
      { status: 500 },
    )
  }
}
