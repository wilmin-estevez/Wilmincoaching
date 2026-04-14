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
// Formspree: crea cuenta en formspree.io y pega tu Form ID
const FORMSPREE_ID: string = 'YOUR_FORM_ID'

// ── ENLACES DE PAGO ────────────────────────────────────────────────────────────
// Stripe Payment Links (recomendado): dashboard.stripe.com/payment-links
// Al crear el link → "Confirmation page" → "Redirect to URL" → pega el
// Google Form URL. Así el formulario de intake SOLO aparece después del pago.
const PAYMENT_LINKS: Record<string, { url: string; price: string; label: string }> = {
  arranque: {
    url: 'YOUR_STRIPE_LINK_ARRANQUE',
    price: '$37',
    label: 'Arranque',
  },
  transformacion: {
    url: 'YOUR_STRIPE_LINK_TRANSFORMACION',
    price: '$197',
    label: 'Transformación 8 Semanas',
  },
  elite: {
    url: 'YOUR_STRIPE_LINK_ELITE',
    price: '$247',
    label: 'Elite Mensual',
  },
}

// Planes que requieren pago (todos excepto "no estoy seguro")
const PLANES_CON_PAGO = ['arranque', 'transformacion', 'elite']

// ── Tipos ──────────────────────────────────────────────────────────────────────
interface FormValues {
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
  const [savedData, setSavedData] = useState<{ nombre: string; plan: string | null }>({
    nombre: '',
    plan: null,
  })

  const formRef = useRef<HTMLFormElement>(null)

  const [objetivo, setObjetivo] = useState<string | null>(null)
  const [tiempo, setTiempo] = useState<string | null>(null)
  const [plan, setPlan] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const nombre = (fd.get('nombre') as string) || ''
    const data: FormValues = {
      nombre,
      telefono: (fd.get('telefono') as string) || '',
      objetivo: objetivo ?? '',
      tiempo: tiempo ?? '',
      plan: plan ?? '',
      notas: (fd.get('notas') as string) || '',
    }

    try {
      // ── 1. Notificación por email a Wilmin (Formspree) ─────────────────────
      if (FORMSPREE_ID && FORMSPREE_ID !== 'YOUR_FORM_ID') {
        await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        })
      }

      // ── 2. Guardar prospecto en GitHub (coaching app) ──────────────────────
      const ghToken =
        typeof window !== 'undefined' ? localStorage.getItem('we_gh_token') : null

      if (ghToken) {
        const OWNER = 'wilmin-estevez'
        const REPO = 'Wilmincoaching'
        const PATH = 'data/sync.json'

        const res = await fetch(
          `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
          {
            headers: {
              Authorization: `token ${ghToken}`,
              Accept: 'application/vnd.github.v3+json',
            },
          }
        )
        if (res.ok) {
          const file = await res.json()
          const current = JSON.parse(atob(file.content.replace(/\n/g, '')))
          const prospecto = {
            id: new Date().toISOString(),
            fecha: new Date().toISOString().split('T')[0],
            nombre: data.nombre,
            telefono: data.telefono,
            objetivo: data.objetivo,
            plan: data.plan,
            tiempo: data.tiempo,
            notas: data.notas,
            estado: 'pendiente',
            origen: 'landing',
          }
          current.prospectos = [...(current.prospectos || []), prospecto]
          current._t = new Date().toISOString()

          await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
            {
              method: 'PUT',
              headers: {
                Authorization: `token ${ghToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/vnd.github.v3+json',
              },
              body: JSON.stringify({
                message: 'prospecto: ' + data.nombre,
                content: btoa(unescape(encodeURIComponent(JSON.stringify(current)))),
                sha: file.sha,
              }),
            }
          )
        }
      }

      setSavedData({ nombre, plan })
      setSubmitted(true)
    } catch {
      setError('Hubo un problema. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // ── Datos del plan seleccionado ─────────────────────────────────────────────
  const planInfo = savedData.plan ? PAYMENT_LINKS[savedData.plan] : null
  const needsPayment = savedData.plan ? PLANES_CON_PAGO.includes(savedData.plan) : false
  const paymentReady =
    planInfo &&
    !planInfo.url.startsWith('YOUR_STRIPE_LINK')

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
            {/* ── Sin plan de pago: "No estoy seguro" ── */}
            {!needsPayment ? (
              <div className="glass-orange rounded-xl p-10 text-center">
                <div className="mb-4 text-5xl">✅</div>
                <h3 className="font-condensed mb-2 text-2xl font-black text-brand-text">
                  ¡Mensaje recibido!
                </h3>
                <p className="text-[13px] text-brand-muted">
                  Te contacto en menos de 24 horas para hablar de tu caso y ver qué plan
                  se adapta mejor a ti. Sin spam. Sin presión.
                </p>
              </div>
            ) : (
              /* ── Plan con pago: mostrar botón de pago ── */
              <div className="glass-orange rounded-xl p-8">
                {/* Encabezado */}
                <div className="mb-6 text-center">
                  <div className="mb-3 text-4xl">🎯</div>
                  <h3 className="font-condensed mb-1 text-[26px] font-black text-brand-text">
                    ¡Solicitud recibida{savedData.nombre ? `, ${savedData.nombre.split(' ')[0]}` : ''}!
                  </h3>
                  <p className="text-[13px] text-brand-muted">
                    Tu lugar está reservado. Asegúralo completando el pago ahora.
                  </p>
                </div>

                {/* Caja del plan */}
                <div className="mb-5 rounded-xl border border-orange/40 bg-orange/5 p-5 text-center">
                  <div className="mb-1 text-[9px] tracking-[3px] uppercase text-orange">Plan seleccionado</div>
                  <div className="font-condensed text-[20px] font-black text-brand-text">
                    {planInfo?.label}
                  </div>
                  <div className="font-condensed text-[48px] font-black leading-none text-orange">
                    {planInfo?.price}
                  </div>
                </div>

                {/* Botón de pago */}
                {paymentReady ? (
                  <a
                    href={planInfo?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <ShimmerButton className="w-full justify-center py-4 text-[15px]">
                      Completar pago {planInfo?.price} →
                    </ShimmerButton>
                  </a>
                ) : (
                  <a
                    href="https://wa.me/18295551234"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <ShimmerButton className="w-full justify-center py-4 text-[15px]">
                      Hablar con Wilmin por WhatsApp →
                    </ShimmerButton>
                  </a>
                )}

                {/* Explicación del proceso */}
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-white/[0.03] p-3">
                    <div className="mb-1 text-[18px]">1️⃣</div>
                    <div className="text-[10px] font-semibold text-brand-text">Paga</div>
                    <div className="text-[9px] text-brand-subtle">Pago seguro</div>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-3">
                    <div className="mb-1 text-[18px]">2️⃣</div>
                    <div className="text-[10px] font-semibold text-brand-text">Formulario</div>
                    <div className="text-[9px] text-brand-subtle">Redireccionado auto</div>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-3">
                    <div className="mb-1 text-[18px]">3️⃣</div>
                    <div className="text-[10px] font-semibold text-brand-text">Tu plan</div>
                    <div className="text-[9px] text-brand-subtle">100% personalizado</div>
                  </div>
                </div>

                <p className="mt-5 text-center text-[11px] text-brand-subtle">
                  Pago seguro · Garantía de resultado · Te contacto en &lt;24h
                </p>
              </div>
            )}
          </BlurFade>
        ) : (
          /* ── Formulario de aplicación ── */
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
                <Select required onValueChange={setPlan}>
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

              <ShimmerButton
                type="submit"
                disabled={loading}
                className="mt-2 w-full justify-center py-4 text-[14px]"
              >
                {loading ? 'Enviando...' : 'Enviar mi aplicación →'}
              </ShimmerButton>
              <p className="text-center text-[11px] text-brand-subtle">
                Sin spam. Solo resultados.
              </p>
            </form>
          </BlurFade>
        )}
      </div>
    </section>
  )
}
