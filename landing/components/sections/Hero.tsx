'use client'
import Image from 'next/image'
import { BlurFade } from '@/components/magicui/blur-fade'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { GridPattern } from '@/components/magicui/grid-pattern'

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden py-16">
      {/* Mesh gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_10%_90%,rgba(255,69,0,0.18),transparent_55%),radial-gradient(ellipse_35%_40%_at_85%_15%,rgba(255,100,0,0.08),transparent_55%)]" />
        <GridPattern
          width={30}
          height={30}
          className="stroke-white/[0.04] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">

          {/* LEFT: Texto */}
          <div>
            <BlurFade delay={0} inView>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(255,69,0,0.3)] bg-[rgba(255,69,0,0.08)] px-4 py-[5px]">
                <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-orange shadow-[0_0_8px_#FF4500]" />
                <span className="text-[9px] font-semibold tracking-[3px] uppercase text-orange">
                  Coaching Online · Donde Estés en el Mundo
                </span>
              </div>
            </BlurFade>

            <BlurFade delay={0.1} inView>
              <h1 className="font-condensed mb-6 text-[clamp(52px,7vw,88px)] font-black leading-[0.86] tracking-[-2px]">
                PIERDE<br />
                <span className="outline-orange">GRASA.</span><br />
                GANA<br />
                <span className="text-orange">MÚSCULO.</span>
              </h1>
            </BlurFade>

            <BlurFade delay={0.2} inView>
              <p className="mb-8 max-w-[420px] text-[15px] leading-[1.75] text-brand-muted">
                Coaching <strong className="text-brand-text">100% personalizado</strong> — plan de
                entrenamiento, nutrición real y seguimiento directo conmigo. Sin rutinas
                genéricas. <strong className="text-brand-text">Sin excusas.</strong>
              </p>
            </BlurFade>

            <BlurFade delay={0.3} inView>
              <div className="mb-10 flex flex-wrap gap-3">
                <ShimmerButton
                  onClick={() => document.getElementById('aplicar')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Aplicar al coaching →
                </ShimmerButton>
                <button
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded border border-white/15 px-7 py-3 font-condensed text-[13px] font-bold tracking-[2px] uppercase text-brand-text transition-colors hover:border-orange hover:text-orange"
                >
                  Ver planes
                </button>
              </div>
            </BlurFade>

            <BlurFade delay={0.4} inView>
              <div className="flex flex-wrap gap-8 border-t border-white/[0.06] pt-7">
                <div>
                  <div className="font-condensed text-4xl font-black leading-none text-orange">100%</div>
                  <div className="mt-1 text-[9px] tracking-[1px] text-brand-subtle">Personalizado</div>
                </div>
                <div>
                  <div className="font-condensed text-4xl font-black leading-none text-orange">3–4</div>
                  <div className="mt-1 text-[9px] tracking-[1px] text-brand-subtle">Semanas p/ver cambios</div>
                </div>
                <div>
                  <div className="font-condensed text-4xl font-black leading-none text-orange">24h</div>
                  <div className="mt-1 text-[9px] tracking-[1px] text-brand-subtle">Respuesta garantizada</div>
                </div>
                <div>
                  <div className="font-condensed text-4xl font-black leading-none text-orange">🌎</div>
                  <div className="mt-1 text-[9px] tracking-[1px] text-brand-subtle">Sin fronteras</div>
                </div>
              </div>
            </BlurFade>
          </div>

          {/* RIGHT: Fotos */}
          <BlurFade delay={0.2} inView className="hidden lg:block">
            <div className="grid grid-cols-2 gap-3" style={{ gridTemplateRows: '280px 150px' }}>
              {/* Foto principal — ocupa toda la altura */}
              <div className="relative row-span-2 overflow-hidden rounded-xl border border-white/[0.06]">
                <Image
                  src="/images/wilmin-principal.jpeg"
                  alt="Wilmin Estévez — Fitness Coach"
                  fill
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
              </div>
              {/* Foto entrenando */}
              <div className="relative overflow-hidden rounded-xl border border-white/[0.06]">
                <Image
                  src="/images/wilmin-entrenando.jpeg"
                  alt="Wilmin entrenando"
                  fill
                  className="object-cover object-center"
                />
              </div>
              {/* Foto posando + badge flotante */}
              <div className="relative overflow-hidden rounded-xl border border-white/[0.06]">
                <Image
                  src="/images/wilmin-posando.jpeg"
                  alt="Wilmin posando"
                  fill
                  className="object-cover object-center"
                />
                {/* Badge flotante */}
                <div className="absolute bottom-3 right-3 rounded-lg border border-[rgba(255,69,0,0.3)] bg-[rgba(24,24,27,0.9)] px-3 py-2 backdrop-blur-sm">
                  <div className="font-condensed text-lg font-black leading-none text-orange">+30</div>
                  <div className="text-[9px] text-brand-muted">Clientes</div>
                </div>
              </div>
            </div>
          </BlurFade>

        </div>
      </div>
    </section>
  )
}
