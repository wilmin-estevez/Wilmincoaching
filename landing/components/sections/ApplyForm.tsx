'use client'
import { useState } from 'react'
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

export function ApplyForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

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
              <p className="text-[13px] text-brand-muted">
                Te contacto en menos de 24 horas. Sin spam. Solo resultados.
              </p>
            </div>
          </BlurFade>
        ) : (
          <BlurFade delay={0.1} inView>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[9px] tracking-[2px] uppercase text-orange">Tu nombre</Label>
                  <Input
                    required
                    placeholder="Nombre completo"
                    className="border-white/[0.08] bg-white/[0.03] text-brand-text placeholder:text-brand-subtle focus:border-orange"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[9px] tracking-[2px] uppercase text-orange">WhatsApp / Teléfono</Label>
                  <Input
                    required
                    type="tel"
                    placeholder="+1 809 000 0000"
                    className="border-white/[0.08] bg-white/[0.03] text-brand-text placeholder:text-brand-subtle focus:border-orange"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[9px] tracking-[2px] uppercase text-orange">¿Cuál es tu objetivo principal?</Label>
                <Select required>
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
                <Select required>
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
                <Select required>
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
                  placeholder="Horario, condición física actual, lesiones, lo que quieras que sepa..."
                  className="min-h-[90px] resize-y border-white/[0.08] bg-white/[0.03] text-brand-text placeholder:text-brand-subtle focus:border-orange"
                />
              </div>

              <ShimmerButton type="submit" className="mt-2 w-full justify-center py-4 text-[14px]">
                Enviar mi aplicación →
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
