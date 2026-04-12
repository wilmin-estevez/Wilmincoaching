export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,69,0,0.1)] bg-[#111113] py-8">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-3">
          <div className="h-7 w-[3px] rounded-sm bg-gradient-to-b from-[#FF4500] to-[rgba(255,69,0,0.15)]" />
          <div>
            <div className="font-condensed text-[15px] font-black tracking-widest text-brand-text uppercase">
              WILMIN <span className="text-orange">ESTÉVEZ</span>
            </div>
            <div className="text-[8px] tracking-[3px] text-brand-subtle uppercase">
              Fitness Coach
            </div>
          </div>
        </div>
        <div className="font-condensed text-[11px] font-bold tracking-[3px] uppercase text-brand-subtle">
          Fe + Disciplina = Transformación
        </div>
        <div className="text-[11px] text-brand-subtle">
          Instagram:{' '}
          <span className="text-orange">@wilminestevez</span>
        </div>
      </div>
    </footer>
  )
}
