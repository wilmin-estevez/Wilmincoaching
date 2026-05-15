'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const FILTERS = [
  { label: 'Todos',       value: 'all' },
  { label: 'Activo',      value: 'active' },
  { label: 'Por renovar', value: 'renew' },
  { label: 'Vencido',     value: 'expired' },
  { label: 'Nuevo',       value: 'new' },
]

export function ClientFilters({ activeStatus }: { activeStatus: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function buildHref(statusValue: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (statusValue === 'all') params.delete('status')
    else params.set('status', statusValue)
    const qs = params.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map(f => (
        <Link
          key={f.value}
          href={buildHref(f.value)}
          className={cn(
            'px-3 py-1.5 rounded-btn text-xs font-bold uppercase tracking-wide transition-colors',
            activeStatus === f.value
              ? 'bg-we-orange text-white'
              : 'bg-we-carbon-1 text-we-gray-mid hover:text-we-white border border-we-carbon-2'
          )}
        >
          {f.label}
        </Link>
      ))}
    </div>
  )
}
