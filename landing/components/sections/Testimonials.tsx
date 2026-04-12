import Image from 'next/image'
import { BlurFade } from '@/components/magicui/blur-fade'
import { MagicCard } from '@/components/magicui/magic-card'

const testimonials = [
  {
    result: '−32 lbs',
    period: 'en 8 semanas · Plan Transformación',
    quote: '"Wilmin no te da un plan genérico. Me conoció, entendió mi horario de trabajo y construyó algo que yo podía realmente seguir. Resultados en las primeras 3 semanas."',
    name: 'Michael',
    plan: 'Plan Transformación',
    initial: 'M',
    image: '/images/michael.png',
  },
  {
    result: '+12 lbs',
    period: 'músculo ganado · 10 semanas',
    quote: '"Llevaba años tratando de ganar músculo sin lograrlo. Con Wilmin en 10 semanas logré más que en 2 años solo. El seguimiento semanal hace toda la diferencia."',
    name: 'Rey',
    plan: 'Plan Elite',
    initial: 'R',
    image: '/images/rey.png',
  },
  {
    result: '−22 lbs',
    period: 'grasa perdida · 12 semanas',
    quote: '"Lo que me cambió fue la nutrición. Nunca había comido bien de verdad. Wilmin me enseñó cómo comer real sin morirme de hambre. El cuerpo respondió solo."',
    name: 'Leandro',
    plan: 'Plan Transformación',
    initial: 'L',
    image: '/images/leandro.png',
  },
]

export function Testimonials() {
  return (
    <section className="border-t border-white/[0.04] py-20">
      <div className="mx-auto max-w-5xl px-6">
        <p className="section-label">Resultados reales</p>
        <h2 className="font-condensed mb-3 text-[clamp(32px,5vw,52px)] font-black leading-[0.9]">
          LO QUE DICEN <span className="text-orange">MIS CLIENTES</span>
        </h2>
        <p className="mb-12 text-[13px] text-brand-muted">
          Testimonios y transformaciones reales — sin filtros, sin excusas.
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <BlurFade key={t.name} delay={i * 0.08} inView>
              <MagicCard className="glass h-full flex flex-col overflow-hidden">
                {/* Foto del cliente */}
                <div className="relative h-52 bg-bg-3">
                  <Image
                    src={t.image}
                    alt={`${t.name} — transformación`}
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#18181b] to-transparent" />
                </div>
                {/* Contenido */}
                <div className="flex flex-grow flex-col p-5">
                  <div className="font-condensed mb-1 text-[34px] font-black leading-none text-orange">
                    {t.result}
                  </div>
                  <div className="mb-4 text-[10px] text-brand-subtle">{t.period}</div>
                  <p className="mb-5 flex-grow border-l-2 border-[rgba(255,69,0,0.2)] pl-3 text-[12px] italic leading-[1.7] text-brand-muted">
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange font-condensed text-[13px] font-black text-white">
                      {t.initial}
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-brand-text">{t.name}</div>
                      <div className="text-[10px] text-brand-subtle">{t.plan}</div>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
