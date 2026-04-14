'use client'
import { useState, useRef } from 'react'
import { BlurFade } from '@/components/magicui/blur-fade'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ── Configuración ──────────────────────────────────────────────────────────────
// 1. Crea una cuenta gratis en formspree.io
// 2. Crea un nuevo form y copia el ID (ej: "xpwzqkbl")
// 3. Reemplaza el placeholder de abajo con tu ID real
const FORMSPREE_ID = 'YOUR_FORM_ID' // ← reemplazar con tu ID de Formspree

// ── Google Form de intake (se muestra DESPUÉS del pago en planes Transformación/Elite)
// Pega aquí el enlace de tu Google Form cuando lo tengas listo
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfSU56OB0fuEQ5h3srsgiI3_OfF6aKxVBU5DekbYT0YifogFg/viewform?usp=header'

// Planes que requieren el Google Form de intake (después del pago)
const PLANES_CON_FORM = ['transformacion', 'elite']

// ── Tipos ──────────────────────────────────────────────────────────────────────
interface FormData {
  nombre: string
  telefono: string
  objetivo: string
  tiempo: string
  plan: string
  notas: string
}

export function ApplyForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [planSeleccionado, setPlanSeleccionado] = useState<string | null>(null)

  const formRef = useRef<HTMLFormElement>(null)

  // Valores controlados para los Selects
  const [objetivo, setObjetivo] = useState<string | null>(null)
  const [tiempo, setTiempo] = useState<string | null>(null)
  const [plan, setPlan] = useState<string | null>(null)

  const handlePlanChange = (value: string | null) => {
    setPlan(value)
    setPlanSeleccionado(value)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const data: FormData = {
      nombre:   (fd.get('nombre')   as string) || '',
      telefono: (fd.get('telefono') as string) || '',
      objetivo: objetivo ?? '',
      tiempo: tiempo ?? '',
      plan: plan ?? '',
      notas:    (fd.get('notas')    as string) || '',
    }

    try {
      // ── 1. Enviar a Formspree (notificación por email a Wilmin) ────────────
      if (FORMSPREE_ID && FORMSPREE_ID !== 'YOUR_FORM_ID') {
        await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data),
        })
      }

      // ── 2. Guardar prospecto en GitHub (llega directo al coaching app) ─────
      const ghToken = typeof window !== 'undefined'
        ? localStorage.getItem('we_gh_token')
        : null

      if (ghToken) {
        const OWNER = 'wilmin-estevez'
        const REPO  = 'Wilmincoaching'
        const PATH  = 'data/sync.json'

        const res = await fetch(
          `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
          { headers: { Authorization: `token ${ghToken}`, Accept: 'application/vnd.github.v3+json' } }
        )
        if (res.ok) {
          const file = await res.json()
          const current = JSON.parse(atob(file.content.replace(/\n/g, '')))
          const prospecto = {
            id:       new Date().toISOString(),
            fecha:    new Date().toISOString().split('T')[0],
            nombre:   data.nombre,
            telefono: data.telefono,
            objetivo: data.objetivo,
            plan:     data.plan,
            tiempo:   data.tiempo,
            notas:    data.notas,
            estado:   'pendiente',
            origen:   'landing',
          }
          current.prospectos = [...(current.prospectos || []), prospecto]
          current._t = new Date().toISOString()

          await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
            {
              method: 'PUT',
              headers: { Authorization: `token ${ghToken}`, 'Content-Type': 'application/json', Accept: 'application/vnd.github.v3+json' },
              body: JSON.stringify({
                message: 'prospecto: ' + data.nombre,
                content: btoa(unescape(encodeURIComponent(JSON.stringify(current)))),
                sha: file.sha,
              }),
            }
          )
        }
      }

      setSubmitted(true)
    } catch {
      setError('Hubo un problema. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const needsGoogleForm = planSeleccionado && PLANES_CON_FORM.includes(planSeleccionado) && GOOGLE_FORM_URL !== 'YOUR_GOOGLE_FORM_URL'

  return (
    <section id="aplicar" className="border-t border-white/[0.04] py-20">
      <div className="mx-auto max-w-2xl px-6">
        <BlurFade inView>
          <div className="mb-12 text-center">
            <p className="section-label justify-center">Aplica ahora</p>
            <h2 className="font-condensed mb-3 text-[clamp(36px,6vw,64px)] font-black leading-[0.9]">
              SIN EXCUSAS.<br />
              <span className="text-orange">SOLO SOLUCIONES.</span>
            </h2>
            <p className="text-[14px] leading-[1.7] text-brand-muted">
              3 preguntas. 2 minutos. El primer paso hacia tu transformación real. Los cupos son
              limitados — si estás leyendo esto, todavía hay espacio.
            </p>
          </div>
        </BlurFade>

        {submitted ? (
          <BlurFade inView>
            <div className="glass-orange rounded-xl p-10 text-center">
              <div className="mb-4 text-5xl">✅</div>
              <h3 className="font-condensed mb-2 text-2xl font-black text-brand-text">
                ¡Aplicación recibida!
              </h3>
              <p className="text-[13px] text-brand-muted mb-4">
                Te contacto en menos de 24 horas. Sin spam. Solo resultados.
              </p>

              {needsGoogleForm && (
                <div className="mt-6 rounded-lg border border-orange/30 bg-orange/5 p-5">
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-widest text-orange">
                    Siguiente paso
                  </p>
                  <p className="mb-4 text-[13px] text-brand-muted">
                    Para tu plan <strong className="text-brand-text">{planSeleccionado === 'transformacion' ? 'Transformación 8 Semanas' : 'Elite Mensual'}</strong>, necesito
                    conocerte mejor. Completa este formulario de intake — toma menos de 5 minutos
                    y me permite personalizar tu plan al 100%.
                  </p>
                  <a
                    href={GOOGLE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-lg bg-orange px-6 py-3 text-[13px] font-bold text-white transition hover:bg-orange/90"
                  >
                    Completar formulario de intake →
                  </a>
                  <p className="mt-3 text-[11px] text-brand-subtle">
                    Este formulario se comparte una vez hayas realizado el pago.
                  </p>
                </div>
              )}
            </div>
          </BlurFade>
        ) : (
          <BlurFade delay={0.1} inView>
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[9px] tracking-[2px] uppercase text-orange">Tu nombre</Label>
                  <Input
                    name="nombre"
                    required
                    placeholder="Nombre completo"
                    className="border-white/[0.08] bg-white/[0.03] text-brand-text placeholder:text-brand-subtle focus:border-orange"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[9px] tracking-[2px] uppercase text-orange">WhatsApp / Teléfono</Label>
                  <Input
                    name="telefono"
                    required
                    type="tel"
                    placeholder="+1 809 000 0000"
                    className="border-white/[0.08] bg-white/[0.03] text-brand-text placeholder:text-brand-subtle focus:border-orange"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[9px] tracking-[2px] uppercase text-orange">¿Cuál es tu objetivo principal?</Label>
                <Select required onValueChange={setObjetivo}>
                  <SelectTrigger className="border-white/[0.08] bg-white/[0.03] text-brand-muted focus:border-orange">
                    <SelectValue placeholder="Selecciona tu meta" />
                  </SelectTrigger>
                  <SelectContent className="border-white/[0.08] bg-bg-3 text-brand-text">
                    <SelectItem value="grasa">Perder grasa y bajar de peso</SelectItem>
                    <SelectItem value="musculo">Ganar músculo y definición</SelectItem>
                    <SelectItem value="ambos">Los dos — transformación completa</SelectItem>
                    <SelectItem value="habitos">Mejorar hábitos y estilo de vida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[9px] tracking-[2px] uppercase text-orange">¿Cuánto tiempo llevas intentando lograr esto?</Label>
                <Select required onValueChange={setTiempo}>
                  <SelectTrigger className="border-white/[0.08] bg-white/[0.03] text-brand-muted focus:border-orange">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent className="border-white/[0.08] bg-bg-3 text-brand-text">
                    <SelectItem value="menos6">Menos de 6 meses</SelectItem>
                    <SelectItem value="6-12">Entre 6 meses y 1 año</SelectItem>
                    <SelectItem value="mas1">Más de 1 año</SelectItem>
                    <SelectItem value="nunca">Nunca lo he intentado en serio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[9px] tracking-[2px] uppercase text-orange">¿Qué plan te interesa?</Label>
                <Select required onValueChange={handlePlanChange}>
                  <SelectTrigger className="border-white/[0.08] bg-white/[0.03] text-brand-muted focus:border-orange">
                    <SelectValue placeholder="Selecciona un plan" />
                  </SelectTrigger>
                  <SelectContent className="border-white/[0.08] bg-bg-3 text-brand-text">
                    <SelectItem value="arranque">Arranque — $37 (producto digital)</SelectItem>
                    <SelectItem value="transformacion">Transformación 8 Semanas — $197</SelectItem>
                    <SelectItem value="elite">Elite Mensual — $247</SelectItem>
                    <SelectItem value="no-se">No estoy seguro aún — quiero hablar primero</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[9px] tracking-[2px] uppercase text-orange">Cuéntame algo más (opcional)</Label>
                <Textarea
                  name="notas"
                  placeholder="Horario, condición física actual, lesiones, lo que quieras que sepa..."
                  className="min-h-[90px] resize-y border-white/[0.08] bg-white/[0.03] text-brand-text placeholder:text-brand-subtle focus:border-orange"
                />
              </div>

              {error && <p className="text-center text-[12px] text-red-400">{error}</p>}

              <ShimmerButton type="submit" disabled={loading} className="mt-2 w-full justify-center py-4 text-[14px]">
                {loading ? 'Enviando...' : 'Enviar mi aplicación →'}
              </ShimmerButton>
              <p className="text-center text-[11px] text-brand-subtle">
                Te contacto en menos de 24 horas. Sin spam. Solo resultados.
              </p>
            </form>
          </BlurFade>
        )}
      </div>
    </section>
  )
}
