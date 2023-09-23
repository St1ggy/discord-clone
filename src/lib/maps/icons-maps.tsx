import { ChannelType, MemberRole } from '@prisma/client'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'

import { cn } from '../utils'

export const iconMaps = {
  channels: {
    [ChannelType.TEXT]: (className?: string) => <Hash className={cn('w-4 h-4', className)} />,
    [ChannelType.AUDIO]: (className?: string) => <Mic className={cn('w-4 h-4', className)} />,
    [ChannelType.VIDEO]: (className?: string) => <Video className={cn('w-4 h-4', className)} />,
  },
  roles: {
    [MemberRole.GUEST]: () => null,
    [MemberRole.MODERATOR]: (className?: string) => (
      <ShieldCheck className={cn('w-4 h-4 text-indigo-500', className)} />
    ),
    [MemberRole.ADMIN]: (className?: string) => <ShieldAlert className={cn('w-4 h-4 text-rose-500', className)} />,
  },
} as const
