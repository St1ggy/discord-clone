'use client'

import { type MemberRole, type Server } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { type FC } from 'react'

import { ActionTooltip } from '@/components/action-tooltip'
import { UserAvatar } from '@/components/user-avatar'
import { iconMaps } from '@/lib/maps'
import { cn } from '@/lib/utils'
import { type MemberWithProfile } from '@/types'

interface ServerMemberProps {
  member: MemberWithProfile
  server: Server
}

export const ServerMember: FC<ServerMemberProps> = ({ member, server }) => {
  const params = useParams<{ channelId: string; memberId: string }>()
  const router = useRouter()

  const icon = iconMaps.roles[member.role]('flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400')

  const isCurrentMember = params.channelId === member.id

  const onClick = () => {
    router.push(`/servers/${server.id}/conversations/${member.id}`)
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        { 'bg-zinc-700/20 dark:bg-zinc-700': isCurrentMember },
      )}
    >
      <UserAvatar src={member.profile.imageUrl} className="w-8 h-8 md:h-8 md:w-8" />
      {icon}
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          { 'text-primary dark:text-zinc-200 dark:group-hover:text-white': isCurrentMember },
        )}
      >
        {member.profile.name}
      </p>
    </button>
  )
}
