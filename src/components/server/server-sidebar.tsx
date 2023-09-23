import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'
import { type FC } from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/db'
import { getCurrentProfile } from '@/lib/get-current-profile'
import { ListItemCategory } from '@/types'

import { ServerChannel } from './server-channel'
import { ServerHeader } from './server-header'
import { ServerMember } from './server-member'
import { ServerSearch } from './server-search'
import { ServerSection } from './server-section'
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

  const { data, role, channelsByType, otherMembers } = buildSidebarData(profile, server)

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch data={data} />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!channelsByType[ChannelType.TEXT]?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType={ListItemCategory.CHANNELS}
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
              server={server}
            />
            <div className="space-y-[2px]">
              {channelsByType[ChannelType.TEXT].map((channel) => (
                <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
              ))}
            </div>
          </div>
        )}
        {!!channelsByType[ChannelType.AUDIO]?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType={ListItemCategory.CHANNELS}
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
              server={server}
            />
            <div className="space-y-[2px]">
              {channelsByType[ChannelType.AUDIO].map((channel) => (
                <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
              ))}
            </div>
          </div>
        )}
        {!!channelsByType[ChannelType.VIDEO]?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType={ListItemCategory.CHANNELS}
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
              server={server}
            />
            <div className="space-y-[2px]">
              {channelsByType[ChannelType.VIDEO].map((channel) => (
                <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
              ))}
            </div>
          </div>
        )}
        {!!otherMembers.length && (
          <div className="mb-2">
            <ServerSection sectionType={ListItemCategory.MEMBERS} role={role} label="Members" server={server} />
            <div className="space-y-[2px]">
              {otherMembers.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
