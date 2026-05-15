'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Resumen',        slug: 'resumen' },
  { label: 'Nutrición',      slug: 'nutricion' },
  { label: 'Entrenamiento',  slug: 'entrenamiento' },
  { label: 'Pagos',          slug: 'pagos' },
  { label: 'Notas',          slug: 'notas' },
]

export function ProfileTabs({ clientId }: { clientId: string }) {
  const pathname = usePathname()

  return (
    <div className="flex gap-0 px-6 border-b border-we-carbon-2 bg-we-carbon flex-shrink-0">
      {TABS.map(tab => {
        const href = `/clients/${clientId}/${tab.slug}`
        const active = pathname.endsWith(`/${tab.slug}`)
        return (
          <Link
            key={tab.slug}
            href={href}
            className={cn(
              'px-4 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap',
              active
                ? 'border-we-orange text-we-white'
                : 'border-transparent text-we-gray-mid hover:text-we-white'
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
