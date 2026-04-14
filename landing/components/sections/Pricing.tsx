'use client'
import { BlurFade } from '@/components/magicui/blur-fade'
import { BorderBeam } from '@/components/magicui/border-beam'
import { ShimmerButton } from '@/components/magicui/shimmer-button'

const plans = [
  {
    tier: 'Nivel 1 — Entrada',
    name: 'Arranque',
    hook: '"Empieza sin excusas"',
    price: '$47',
    period: 'Pago único · Producto digital',
    tag: 'Sin seguimiento directo',
    features: [
      { text: 'Plan de entrenamiento 4 semanas completo', active: true },
      { text: 'Lista de compras semanal en PDF', active: true },
      { text: 'Guía de hábitos básicos para empezar', active: true },
      { text: 'Sin WhatsApp ni check-ins directos', active: false },
      { text: 'Sin ajustes personalizados', active: false },
    ],
    cta: 'Quiero empezar →',
    featured: false,
    note: 'Ideal para probar antes de comprometerte',
  },
  {
    tier: 'Nivel 2 — Coaching Real',
    name: 'Transformación',
    hook: '"Resultados reales o te devuelvo el dinero"',
    price: '$197',
    period: 'Por ciclo de 8 semanas',
    tag: '≈ $99/mes · Con garantía',
    features: [
      { text: 'Plan de entrenamiento 100% personalizado', active: true },
      { text: 'Nutrición real adaptada a tu cuerpo', active: true },
      { text: 'Check-in semanal por WhatsApp conmigo', active: true },
      { text: 'Ajustes al plan cada 2 semanas', active: true },
      { text: 'Acceso al sistema de seguimiento en app', active: true },
      { text: 'Garantía de resultado 4 semanas', active: true },
    ],
    cta: 'Aplicar al programa →',
    featured: true,
    note: 'El plan más elegido por quienes van en serio',
  },
  {
    tier: 'Nivel 3 — Máxima Atención',
    name: 'Elite',
    hook: '"Acceso total, resultados máximos"',
    price: '$247',
    period: 'Por mes · Máximo 5 clientes',
    tag: 'Cupos exclusivos y limitados',
    features: [
      { text: 'Todo lo incluido en Transformación', active: true },
      { text: '1 videollamada 1:1 semanal (30 min)', active: true },
      { text: 'Respuesta WhatsApp en menos de 12h', active: true },
      { text: 'Ajustes ilimitados al plan', active: true },
      { text: 'Prioridad absoluta en comunicación', active: true },
    ],
    cta: 'Quiero el Elite →',
    featured: false,
    note: 'Para quienes quieren lo mejor de lo mejor',
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-white/[0.04] bg-bg-2 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <p className="section-label">Planes y precios</p>
        <h2 className="font-condensed mb-12 text-[clamp(32px,5vw,52px)] font-black leading-[0.9]">
          ELIGE TU <span className="text-orange">NIVEL</span>
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {plans.map((plan, i) => (
            <BlurFade key={plan.name} delay={i * 0.08} inView>
              <div
                className={`relative flex h-full flex-col overflow-hidden rounded-xl p-7 ${
                  plan.featured
                    ? 'border border-[rgba(255,69,0,0.35)] bg-[rgba(255,69,0,0.06)] shadow-[0_0_48px_rgba(255,69,0,0.1)]'
                    : 'glass'
                }`}
              >
                {plan.featured && (
                  <>
                    <div className="absolute -top-px left-1/2 -translate-x-1/2 rounded-b-lg bg-orange px-4 py-1 font-condensed text-[9px] font-bold tracking-[3px] text-white">
                      EL MÁS POPULAR
                    </div>
                    <BorderBeam colorFrom="#FF4500" duration={10} />
                  </>
                )}
                <div className="mt-3 text-[9px] tracking-[3px] uppercase text-orange">{plan.tier}</div>
                <div className="font-condensed text-[26px] font-black uppercase text-brand-text">{plan.name}</div>
                <div className="mb-5 text-[11px] italic text-brand-subtle">{plan.hook}</div>
                <div className="font-condensed text-[44px] font-black leading-none text-orange">{plan.price}</div>
                <div className="mb-1 text-[10px] text-brand-subtle">{plan.period}</div>
                <div className="mb-5 inline-block rounded border border-[rgba(255,69,0,0.2)] bg-[rgba(255,69,0,0.07)] px-2 py-[3px] text-[9px] text-orange">
                  {plan.tag}
                </div>
                <div className="mb-5 h-px bg-white/[0.06]" />
                <ul className="mb-6 flex flex-grow flex-col gap-2">
                  {plan.features.map((f) => (
                    <li key={f.text} className={`flex gap-2 text-[12px] ${f.active ? 'text-[#d4d4d8]' : 'text-brand-subtle'}`}>
                      <span className={f.active ? 'text-orange' : 'text-brand-subtle'}>▪</span>
                      {f.text}
                    </li>
                  ))}
                </ul>
                {plan.featured ? (
                  <ShimmerButton
                    onClick={() => document.getElementById('aplicar')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full justify-center py-3 text-[12px]"
                  >
                    {plan.cta}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={() => document.getElementById('aplicar')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full rounded border border-[rgba(255,69,0,0.3)] py-3 font-condensed text-[11px] font-bold tracking-[2px] uppercase text-orange transition-colors hover:bg-orange hover:text-white"
                  >
                    {plan.cta}
                  </button>
                )}
                <p className="mt-3 text-center text-[10px] text-brand-subtle">{plan.note}</p>
              </div>
            </BlurFade>
          ))}
        </div>
        <p className="mt-6 text-center text-[12px] text-brand-subtle">
          Métodos de pago: tarjeta de crédito/débito, transferencia bancaria · Precio en USD
        </p>
      </div>
    </section>
  )
}
