import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Topbar } from '@/components/shell/Topbar'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import type { Client } from '@/lib/supabase/types'

export default async function ClientProfileLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>
  children: React.ReactNode
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (!data) notFound()
  const client = data as unknown as Client

  return (
    <>
      <Topbar title="PERFIL" accent={client.name} />
      <div className="flex-1 overflow-y-auto flex flex-col">
        <ProfileHeader client={client} />
        <ProfileTabs clientId={client.id} />
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </>
  )
}
