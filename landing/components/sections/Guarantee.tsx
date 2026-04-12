import { BlurFade } from '@/components/magicui/blur-fade'

export function Guarantee() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.04] py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_0%_50%,rgba(255,69,0,0.07),transparent)]" />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[auto_1fr] lg:items-center">
          <BlurFade delay={0} inView>
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border-[1.5px] border-[rgba(255,69,0,0.4)] bg-[rgba(255,69,0,0.04)] shadow-[0_0_40px_rgba(255,69,0,0.1)]">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="#FF4500">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            </div>
          </BlurFade>
          <BlurFade delay={0.1} inView>
            <div>
              <p className="section-label">Garantía de resultado</p>
              <h2 className="font-condensed mb-4 text-[clamp(32px,5vw,52px)] font-black leading-[0.9]">
                TU RIESGO <span className="outline-orange">ES CERO</span>
              </h2>
              <p className="mb-3 text-[13px] leading-[1.8] text-brand-muted">
                Si sigues el plan al{' '}
                <strong className="text-brand-text">100% durante las primeras 4 semanas</strong> y no
                ves ningún cambio real en tu cuerpo, te devuelvo el dinero completo.
              </p>
              <p className="mb-5 text-[13px] leading-[1.8] text-brand-muted">
                Sin preguntas. Sin burocracia. Porque confío en mi sistema y en los resultados que
                entrego.{' '}
                <strong className="text-brand-text">El único riesgo es no intentarlo.</strong>
              </p>
              <div className="inline-block rounded-lg border border-orange bg-[rgba(255,69,0,0.07)] px-6 py-3 font-condensed text-[12px] font-bold tracking-[2px] uppercase text-orange">
                Garantía total de 4 semanas
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
