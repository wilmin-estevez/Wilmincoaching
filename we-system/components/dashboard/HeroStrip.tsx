import Link from 'next/link'

interface HeroStripProps {
  newForms: number
}

export function HeroStrip({ newForms }: HeroStripProps) {
  const today = new Date().toLocaleDateString('es-DO', {
    weekday: 'long', day: 'numeric', month: 'long'
  }).toUpperCase()

  return (
    <div className="brand-bar bg-we-carbon border border-we-carbon-2 rounded-r-card px-6 py-4 flex items-center justify-between">
      <div>
        <div className="text-[9px] font-bold text-we-orange tracking-[2px] uppercase">{today}</div>
        <div className="font-display font-bold text-we-white text-2xl uppercase tracking-wide mt-1">
          BUEN DÍA, <span className="text-we-orange">WILMIN.</span>
        </div>
        {newForms > 0 && (
          <div className="text-xs text-we-gray-mid mt-1">
            Tienes <span className="text-we-success font-bold">{newForms} formulario{newForms > 1 ? 's' : ''} nuevo{newForms > 1 ? 's' : ''}</span> esperando
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Link
          href="/clients"
          className="bg-we-carbon-2 hover:bg-we-carbon-3 text-we-white text-xs font-bold px-4 py-2 rounded-btn transition-colors uppercase tracking-wide font-display"
        >
          Ver asesorados
        </Link>
      </div>
    </div>
  )
}
