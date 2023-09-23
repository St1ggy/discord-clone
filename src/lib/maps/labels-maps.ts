import { ChannelType, MemberRole } from '@prisma/client'

export const labelsMaps = {
  channels: {
    [ChannelType.TEXT]: 'Text Channels',
    [ChannelType.AUDIO]: 'Voice Channels',
    [ChannelType.VIDEO]: 'Video Channels',
  },
  roles: {
    [MemberRole.GUEST]: 'Guest',
    [MemberRole.MODERATOR]: 'Moderator',
    [MemberRole.ADMIN]: 'Admin',
  },
} as const
