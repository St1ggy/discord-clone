import { type Channel, ChannelType, type Member, type MemberRole } from '@prisma/client'
import { redirect } from 'next/navigation'
import { type FC } from 'react'

import { db } from '@/lib/db'
import { getCurrentProfile } from '@/lib/get-current-profile'

import { ServerHeader } from './server-header'

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

  const channelsByType = server.channels.reduce<Record<ChannelType, Channel[]>>(
    (acc, channel) => {
      acc[channel.type].push(channel)

      return acc
    },
    { [ChannelType.TEXT]: [], [ChannelType.AUDIO]: [], [ChannelType.VIDEO]: [] },
  )

  const { otherMembers, role } = server.members.reduce<{ otherMembers: Member[]; role: MemberRole | null }>(
    (acc, member) => {
      if (member.profileId === profile.id) {
        acc.role = member.role
      } else {
        acc.otherMembers.push(member)
      }

      return acc
    },
    { otherMembers: [], role: null },
  )

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <pre>{JSON.stringify(channelsByType, null, 2)}</pre>
      <pre>{JSON.stringify(otherMembers, null, 2)}</pre>
    </div>
  )
}
