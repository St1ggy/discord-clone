import { type Channel, ChannelType, type MemberRole, type Profile } from '@prisma/client'

import { iconMaps, labelsMaps } from '@/lib/maps'
import { ListItemCategory, type MemberWithProfile, type ServerWithMembersWithProfilesWithChannels } from '@/types'

import { type SearchItem } from '../server-search'

export const buildSidebarData = (profile: Profile, server: ServerWithMembersWithProfilesWithChannels) => {
  const channelsByType = server.channels.reduce<Record<ChannelType, Channel[]>>(
    (acc, channel) => {
      acc[channel.type].push(channel)

      return acc
    },
    { [ChannelType.TEXT]: [], [ChannelType.AUDIO]: [], [ChannelType.VIDEO]: [] },
  )

  const { otherMembers, role } = server.members.reduce<{ otherMembers: MemberWithProfile[]; role?: MemberRole }>(
    (acc, member) => {
      if (member.profileId === profile.id) {
        acc.role = member.role
      } else {
        acc.otherMembers.push(member)
      }

      return acc
    },
    { otherMembers: [] },
  )

  const channelTypes: ChannelType[] = [ChannelType.TEXT]
  if (channelsByType[ChannelType.AUDIO]?.length) channelTypes.push(ChannelType.AUDIO)
  if (channelsByType[ChannelType.VIDEO]?.length) channelTypes.push(ChannelType.VIDEO)

  const data: SearchItem[] = channelTypes.map((channelType) => ({
    label: labelsMaps.channels[channelType],
    itemType: ListItemCategory.CHANNELS,
    data: channelsByType[channelType]?.map((channel) => ({
      id: channel.id,
      icon: iconMaps.channels[channel.type]('mr-2'),
      name: channel.name,
    })),
  }))

  if (otherMembers.length)
    data.push({
      label: 'Members',
      itemType: ListItemCategory.MEMBERS,
      data: otherMembers.map((member) => ({
        id: member.id,
        icon: iconMaps.roles[member.role](),
        name: member.profile.name,
      })),
    })

  return { data, channelsByType, otherMembers, role }
}
