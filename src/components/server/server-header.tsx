'use client'

import { MemberRole } from '@prisma/client'
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserCog, UserPlus } from 'lucide-react'
import { type FC, useMemo } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ModalType, useModalStore } from '@/hooks'
import { cn } from '@/lib/utils'
import { type ServerWithMembersWithProfilesWithChannels } from '@/types'

interface ServerHeaderProps {
  server: ServerWithMembersWithProfilesWithChannels
  role: MemberRole | null
}

export const ServerHeader: FC<ServerHeaderProps> = ({ server, role }) => {
  const { onOpenModal } = useModalStore()

  const isAdmin = role === MemberRole.ADMIN
  const isModerator = isAdmin || role === MemberRole.MODERATOR

  const items = useMemo(
    () => [
      {
        title: 'Invite People',
        IconComponent: UserPlus,
        visible: isModerator,
        className: 'text-indigo-600 dark:text-indigo-400',
        onClick: () => onOpenModal({ modalType: ModalType.INVITE, data: { server } }),
      },
      {
        title: 'Server Settings',
        IconComponent: Settings,
        visible: isAdmin,
        onClick: () => onOpenModal({ modalType: ModalType.EDIT_SERVER, data: { server } }),
      },
      {
        title: 'Manage Members',
        IconComponent: UserCog,
        visible: isAdmin,
        onClick: () => onOpenModal({ modalType: ModalType.MEMBERS, data: { server } }),
      },
      {
        title: 'Create Channel',
        IconComponent: PlusCircle,
        visible: isModerator,
        onClick: () => onOpenModal({ modalType: ModalType.CREATE_CHANNEL, data: { server } }),
      },
      {
        title: '',
        visible: isModerator,
      },
      {
        title: 'Delete Server',
        IconComponent: Trash,
        visible: isAdmin,
        className: 'text-rose-500',
        onClick: () => {},
      },
      {
        title: 'Leave Server',
        IconComponent: LogOut,
        visible: !isAdmin,
        className: 'text-rose-500',
        onClick: () => {},
      },
    ],
    [isModerator, isAdmin, onOpenModal, server],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {items.map(({ visible, title, className, onClick, IconComponent }, index) => {
          if (!visible) return null

          if (!title.length) return <DropdownMenuSeparator key={`separator-${index}`} />

          return (
            <DropdownMenuItem
              key={title}
              className={cn(className, 'px-3 py-2 text-sm cursor-pointer')}
              onClick={onClick}
            >
              {title}
              {IconComponent && <IconComponent className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
