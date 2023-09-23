import { type Channel, ChannelType, MemberRole, type Profile } from '@prisma/client'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'

import { type MemberWithProfile, SearchItemType, type ServerWithMembersWithProfilesWithChannels } from '@/types'

import { type SearchItem } from '../server-search'

const labelsMaps = {
  [ChannelType.TEXT]: 'Text Channels',
  [ChannelType.AUDIO]: 'Voice Channels',
  [ChannelType.VIDEO]: 'Video Channels',
}

const iconMaps = {
  channels: {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
  },
  roles: {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
  },
} as const

export const buildSidebarData = (profile: Profile, server: ServerWithMembersWithProfilesWithChannels) => {
  const channelsByType = server.channels.reduce<Record<ChannelType, Channel[]>>(
    (acc, channel) => {
      acc[channel.type].push(channel)

      return acc
    },
    { [ChannelType.TEXT]: [], [ChannelType.AUDIO]: [], [ChannelType.VIDEO]: [] },
  )

  const { otherMembers, role } = server.members.reduce<{ otherMembers: MemberWithProfile[]; role: MemberRole | null }>(
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

  const channelTypes: ChannelType[] = [ChannelType.TEXT]
  if (channelsByType[ChannelType.AUDIO]?.length) channelTypes.push(ChannelType.AUDIO)
  if (channelsByType[ChannelType.VIDEO]?.length) channelTypes.push(ChannelType.VIDEO)

  const data: SearchItem[] = channelTypes.map((channelType) => ({
    label: labelsMaps[channelType],
    itemType: SearchItemType.CHANNEL,
    data: channelsByType[channelType]?.map((channel) => ({
      id: channel.id,
      icon: iconMaps.channels[channel.type],
      name: channel.name,
    })),
  }))

  if (otherMembers.length)
    data.push({
      label: 'Members',
      itemType: SearchItemType.MEMBER,
      data: otherMembers.map((member) => ({
        id: member.id,
        icon: iconMaps.roles[member.role],
        name: member.profile.name,
      })),
    })

  return { data, role }
}
