'use client'
import { BlurFade } from '@/components/magicui/blur-fade'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  { q: '¿Necesito ir al gym?', a: 'No necesariamente. Diseño planes tanto para gym como para casa o parque. Lo importante es tu compromiso, no el lugar donde entrenas.' },
  { q: '¿Funciona si trabajo todo el día?', a: 'Sí. El 80% de mis clientes trabajan tiempo completo. Adapto el plan a tu horario real, no a un horario ideal. Rutinas de 30–45 min que funcionan.' },
  { q: '¿Cuánto tiempo toma ver resultados?', a: 'La mayoría de mis clientes ven cambios visibles entre la semana 3 y 4. Por eso la garantía es de 4 semanas — si sigues el plan al 100% y no hay resultado, te devuelvo el dinero.' },
  { q: '¿Cómo es el seguimiento semanal?', a: 'Cada semana me envías tu reporte por WhatsApp: peso, fotos opcionales, cómo te sentiste. Yo reviso y te doy feedback dentro de 24 horas. Es seguimiento real, no automático.' },
  { q: '¿Cómo pago?', a: 'Acepto tarjeta de crédito/débito y transferencia bancaria. El pago es antes de comenzar y confirma tu cupo. Te explico el proceso exacto cuando hablemos.' },
  { q: '¿Qué pasa si no veo resultados?', a: 'Si sigues el plan al 100% durante 4 semanas y no hay ningún cambio, te devuelvo el dinero completo. Sin preguntas. Eso es la garantía que ofrezco.' },
  { q: '¿Estás disponible si soy de USA?', a: 'Sí. Tengo clientes activos en varios países. Todo el coaching es 100% online vía WhatsApp y la app de seguimiento. No importa dónde estés — si tienes WiFi, podemos trabajar juntos.' },
  { q: '¿Puedo empezar de cero sin experiencia?', a: 'Perfectamente. Muchos de mis mejores resultados son con personas que nunca habían hecho fitness antes. El plan se construye desde tu punto de partida real.' },
]

export function Faq() {
  return (
    <section id="faq" className="border-t border-white/[0.04] bg-bg-2 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <BlurFade inView>
          <p className="section-label">Preguntas frecuentes</p>
          <h2 className="font-condensed mb-12 text-[clamp(32px,5vw,52px)] font-black leading-[0.9]">
            RESUELVE <span className="outline-orange">TUS DUDAS</span>
          </h2>
        </BlurFade>
        <div className="grid grid-cols-1 gap-x-12 lg:grid-cols-2">
          {[faqs.slice(0, 4), faqs.slice(4)].map((col, ci) => (
            <BlurFade key={ci} delay={ci * 0.05} inView>
              <Accordion multiple={false} defaultValue={ci === 0 ? ['item-0'] : []}>
                {col.map((faq, i) => (
                  <AccordionItem
                    key={faq.q}
                    value={`item-${i}`}
                    className="border-b border-white/[0.06]"
                  >
                    <AccordionTrigger className="font-condensed py-4 text-left text-[15px] font-bold uppercase text-brand-text hover:text-orange hover:no-underline data-[panel-open]:text-orange">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-[13px] leading-[1.7] text-brand-muted">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
