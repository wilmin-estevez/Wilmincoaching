import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@/lib/claude'

export const maxDuration = 30

const MODEL = 'claude-haiku-4-5-20251001'

export async function POST(req: NextRequest) {
  try {
    const { clientName, clientInfo, existingNotes, message } = await req.json()

    const hasExisting = existingNotes && existingNotes.trim().length > 0

    const prompt = `Eres el asistente del coach Wilmin Estévez. Te ayudo a redactar notas claras y útiles sobre sus asesorados.

Cliente: ${clientName}
${clientInfo ? `Contexto del cliente: ${clientInfo}` : ''}
${hasExisting ? `\nNotas anteriores sobre este cliente:\n---\n${existingNotes}\n---\n` : ''}
El coach quiere agregar esta información:
"${message}"

${hasExisting ? 'IMPORTANTE: No repitas información que ya está en las notas anteriores. Solo captura la información nueva y relevante.' : ''}

Escribe una nota breve, clara y profesional (máximo 2-3 oraciones). Sin emojis excesivos. Directo al punto. Si implica ajuste a entrenamiento o nutrición, menciona la implicación práctica.

Responde ÚNICAMENTE con el texto de la nota, sin introducción, comillas ni explicación.`

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 300,
      messages: [{ role: 'user' as const, content: prompt }],
    })

    const note = response.content.find(b => b.type === 'text')?.text?.trim() ?? ''
    return NextResponse.json({ note })
  } catch (err) {
    console.error('[notes-ai]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error generando nota' },
      { status: 500 },
    )
  }
}
