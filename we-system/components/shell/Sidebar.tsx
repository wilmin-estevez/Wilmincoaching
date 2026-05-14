'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, Apple, Dumbbell,
  DollarSign, Link as LinkIcon, LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV = [
  {
    group: 'PRINCIPAL',
    items: [
      { href: '/dashboard', label: 'Dashboard',     icon: LayoutDashboard },
      { href: '/clients',   label: 'Asesorados',    icon: Users },
    ],
  },
  {
    group: 'PLANES',
    items: [
      { href: '/nutrition', label: 'Nutrición',     icon: Apple },
      { href: '/training',  label: 'Entrenamiento', icon: Dumbbell },
    ],
  },
  {
    group: 'NEGOCIO',
    items: [
      { href: '/cobros',    label: 'Cobros',        icon: DollarSign },
    ],
  },
  {
    group: 'COMPARTIR',
    items: [
      { href: '/links',     label: 'Links',         icon: LinkIcon },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-52 bg-we-carbon border-r border-we-carbon-2 flex flex-col flex-shrink-0 h-screen sticky top-0">
      {/* Brand */}
      <div className="p-4 border-b border-we-carbon-2 flex items-center gap-3">
        <div className="w-9 h-9 bg-we-orange rounded-[6px] flex items-center justify-center flex-shrink-0">
          <span className="font-display font-bold text-white text-xs">WE</span>
        </div>
        <div className="min-w-0">
          <div className="font-display font-bold text-we-white text-xs tracking-widest uppercase truncate">
            WILMIN <span className="text-we-orange">ESTÉVEZ</span>
          </div>
          <div className="text-we-gray-mid text-[10px]">Fitness Coach · RD</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV.map(group => (
          <div key={group.group} className="mb-1">
            <div className="px-4 py-2 text-[9px] font-bold text-we-gray-low tracking-[2px] uppercase">
              {group.group}
            </div>
            {group.items.map(item => {
              const active = pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 mx-2 px-3 py-2 rounded-btn text-sm transition-colors',
                    active
                      ? 'bg-we-carbon-1 text-we-white border-l-2 border-we-orange'
                      : 'text-we-gray-mid hover:text-we-white hover:bg-we-carbon-1'
                  )}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-we-carbon-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-btn text-sm text-we-gray-mid hover:text-we-danger hover:bg-we-carbon-1 transition-colors"
        >
          <LogOut size={15} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
