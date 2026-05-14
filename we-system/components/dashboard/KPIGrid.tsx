import { cn } from '@/lib/utils'

interface KPI {
  label: string
  value: string | number
  delta?: string
  deltaType?: 'good' | 'warn' | 'danger'
}

interface KPIGridProps {
  kpis: KPI[]
}

export function KPIGrid({ kpis }: KPIGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-we-carbon border border-we-carbon-2 rounded-card p-5"
        >
          <div className="text-[9px] font-bold text-we-gray-mid tracking-[2px] uppercase mb-2">
            {kpi.label}
          </div>
          <div className="font-display font-bold text-we-white text-4xl leading-none">
            {kpi.value}
          </div>
          {kpi.delta && (
            <div className={cn(
              'text-xs mt-2',
              kpi.deltaType === 'good'   && 'text-we-success',
              kpi.deltaType === 'warn'   && 'text-we-warn',
              kpi.deltaType === 'danger' && 'text-we-danger',
              !kpi.deltaType             && 'text-we-gray-mid',
            )}>
              {kpi.delta}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
