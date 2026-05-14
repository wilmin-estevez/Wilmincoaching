import { Topbar } from '@/components/shell/Topbar'

export default function DashboardPage() {
  return (
    <>
      <Topbar title="DASHBOARD" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="text-we-gray-mid text-sm">Cargando datos...</div>
      </main>
    </>
  )
}
