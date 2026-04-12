import { Marquee } from '@/components/magicui/marquee'

const BannerItem = () => (
  <span className="flex items-center gap-6 px-4 font-condensed text-[13px] font-bold tracking-[3px] uppercase">
    <span className="text-orange">⚡ CUPOS LIMITADOS</span>
    <span className="text-orange">—</span>
    <span className="text-brand-text">QUEDAN 7 ESPACIOS DISPONIBLES ESTE MES</span>
    <span className="text-orange">—</span>
  </span>
)

export function CuposBanner() {
  return (
    <div className="border-b border-t border-[rgba(255,69,0,0.18)] bg-[rgba(255,69,0,0.07)] py-3">
      <Marquee repeat={4} pauseOnHover className="[--gap:0rem] [--duration:30s]">
        <BannerItem />
      </Marquee>
    </div>
  )
}
