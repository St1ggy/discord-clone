import { redirect } from 'next/navigation'
import { type FC } from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { db } from '@/lib/db'
import { getCurrentProfile } from '@/lib/get-current-profile'

import { ServerHeader } from './server-header'
import { ServerSearch } from './server-search'
import { buildSidebarData } from './utils'

interface ServerSidebarProps {
  serverId: string
}

export const ServerSidebar: FC<ServerSidebarProps> = async ({ serverId }) => {
  const profile = await getCurrentProfile()

  if (!profile) return redirect('/')

  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      channels: {
        orderBy: { createdAt: 'asc' },
      },
      members: {
        include: { profile: true },
        orderBy: { role: 'asc' },
      },
    },
  })

  if (!server) return redirect('/')

  const { data, role } = buildSidebarData(profile, server)

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch data={data} />
        </div>
      </ScrollArea>
    </div>
  )
}
