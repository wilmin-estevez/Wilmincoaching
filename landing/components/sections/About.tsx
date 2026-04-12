import { BlurFade } from '@/components/magicui/blur-fade'
import { BorderBeam } from '@/components/magicui/border-beam'

const values = [
  'Alimentación real, sin dietas imposibles',
  'Hábitos fuertes que duran para siempre',
  'Seguimiento directo — no bots, ni asistentes',
  'Con Dios y disciplina, no hay excusa que valga',
]

const stats = [
  { num: '+30', label: 'Clientes transformados', desc: 'Personas reales con resultados documentados alrededor del mundo.', featured: true },
  { num: '8', label: 'Semanas para transformar', desc: 'El tiempo promedio donde mis clientes ven cambios reales y medibles.', featured: false },
  { num: '0', label: 'Rutinas genéricas entregadas', desc: 'Cada plan es construido desde cero. No existe el copy-paste en mi coaching.', featured: false },
]

export function About() {
  return (
    <section className="border-t border-white/[0.04] bg-bg-2 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">

          {/* Bio */}
          <BlurFade delay={0} inView>
            <p className="section-label">Sobre Wilmin</p>
            <h2 className="font-condensed mb-5 text-5xl font-black leading-[0.9]">
              FE +<br />
              <span className="outline-orange">DISCIPLINA</span><br />
              <span className="text-orange">= RESULTADO</span>
            </h2>
            <blockquote className="mb-5 border-l-2 border-[rgba(255,69,0,0.35)] pl-4">
              <p className="text-[14px] italic text-[#d4d4d8]">"No es el gym. Es tu vida entera."</p>
            </blockquote>
            <p className="mb-3 text-[13px] leading-[1.8] text-brand-muted">
              Soy Wilmin Estévez, fitness coach online con clientes en múltiples países. No uso
              protocolos genéricos — cada cliente recibe un sistema construido específicamente para
              su cuerpo, su horario y sus metas.
            </p>
            <p className="text-[13px] leading-[1.8] text-brand-muted">
              Mi base es simple:{' '}
              <strong className="text-brand-text">fe + disciplina = transformación</strong>.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {values.map((v) => (
                <li key={v} className="flex items-center gap-3 text-[13px] text-[#d4d4d8]">
                  <span className="h-[6px] w-[6px] flex-shrink-0 rounded-[1px] bg-orange" />
                  {v}
                </li>
              ))}
            </ul>
          </BlurFade>

          {/* Stat cards */}
          <div className="flex flex-col gap-3">
            {stats.map((s, i) => (
              <BlurFade key={s.label} delay={i * 0.1} inView>
                <div className={`relative overflow-hidden p-6 ${s.featured ? 'glass-orange' : 'glass'}`}>
                  {s.featured && (
                    <>
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange to-transparent" />
                      <BorderBeam colorFrom="#FF4500" colorTo="transparent" duration={8} />
                    </>
                  )}
                  <div className="flex items-center gap-5">
                    <span className="font-condensed text-5xl font-black leading-none text-orange">
                      {s.num}
                    </span>
                    <div>
                      <strong className="block text-[14px] text-brand-text">{s.label}</strong>
                      <span className="text-[12px] text-brand-muted">{s.desc}</span>
                    </div>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
