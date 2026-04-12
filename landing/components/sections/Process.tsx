import { BlurFade } from '@/components/magicui/blur-fade'

const steps = [
  { num: '01', title: 'Aplicas online', desc: 'Formulario en menos de 3 minutos. 3 preguntas clave para entender tus objetivos reales.', featured: false },
  { num: '02', title: 'Llamada 15 min', desc: 'WhatsApp o video. Confirmo que somos el match correcto y resuelvo todas tus dudas antes de comprometerte.', featured: false },
  { num: '03', title: 'Plan en 48h', desc: 'Entrenamiento + nutrición 100% personalizada, entregada en la app dentro de 48 horas.', featured: false },
  { num: '04', title: 'Empezamos', desc: 'Check-ins semanales, ajustes cada 2 semanas y seguimiento directo conmigo. No caminas solo.', featured: true },
]

export function Process() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.04] py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_100%,rgba(255,69,0,0.05),transparent)]" />
      <div className="relative mx-auto max-w-5xl px-6">
        <p className="section-label">Cómo funciona</p>
        <h2 className="font-condensed mb-12 text-[clamp(32px,5vw,52px)] font-black leading-[0.9]">
          EL PROCESO <span className="outline-orange">PASO A PASO</span>
        </h2>
        <div className="grid grid-cols-1 gap-px bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4 rounded-xl overflow-hidden">
          {steps.map((s, i) => (
            <BlurFade key={s.num} delay={i * 0.08} inView>
              <div className={`h-full p-7 ${s.featured ? 'bg-[rgba(255,69,0,0.06)]' : 'bg-bg-3/30'}`}>
                <div className="font-condensed mb-3 text-[52px] font-black leading-none text-[rgba(255,69,0,0.12)]">
                  {s.num}
                </div>
                <div className={`font-condensed mb-2 text-[15px] font-bold uppercase ${s.featured ? 'text-orange' : 'text-brand-text'}`}>
                  {s.title}
                </div>
                <p className="text-[12px] leading-[1.6] text-brand-muted">{s.desc}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
