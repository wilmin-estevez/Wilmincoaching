import { Search, Bell } from 'lucide-react'

interface TopbarProps {
  title: string
  accent?: string
  action?: React.ReactNode
}

export function Topbar({ title, accent, action }: TopbarProps) {
  return (
    <header className="h-14 border-b border-we-carbon-2 bg-we-carbon flex items-center px-6 gap-4 flex-shrink-0">
      <div className="font-display font-bold text-we-white text-sm tracking-[2px] uppercase">
        {title}
        {accent && <span className="text-we-orange ml-1">{accent}</span>}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1 bg-we-carbon-1 border border-we-carbon-2 rounded-btn px-3 py-1.5 w-56">
        <Search size={12} className="text-we-gray-mid flex-shrink-0" />
        <input
          placeholder="Buscar asesorado..."
          className="bg-transparent text-xs text-we-white placeholder:text-we-gray-low flex-1 outline-none"
        />
      </div>

      <button className="w-8 h-8 flex items-center justify-center rounded-btn border border-we-carbon-2 text-we-gray-mid hover:text-we-white hover:border-we-carbon-3 transition-colors">
        <Bell size={14} />
      </button>

      {action}
    </header>
  )
}
