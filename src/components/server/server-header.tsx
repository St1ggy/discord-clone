'use client'

import { MemberRole } from '@prisma/client'
import {
  ChevronDownIcon,
  ExitIcon,
  GearIcon,
  PersonIcon,
  PlusCircledIcon,
  PlusIcon,
  TrashIcon,
} from '@radix-ui/react-icons'
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

  const isAdmin = role === MemberRole.ADMIM
  const isModerator = isAdmin || role === MemberRole.MODERATOR

  const items = useMemo(
    () => [
      {
        title: 'Invite People',
        icons: [
          <PersonIcon key="invite-people-icon-0" className="h-4 w-4 -translate-x-0.5" />,
          <PlusIcon
            key="invite-people-icon-1"
            className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1.5 w-3 h-3"
          />,
        ],
        visible: isModerator,
        className: 'text-indigo-600 dark:text-indigo-400',
        onClick: () => onOpenModal({ modalType: ModalType.INVITE, data: { server } }),
      },
      {
        title: 'Server Settings',
        icons: [<GearIcon key="server-settings-icon-0" className="h-4 w-4" />],
        visible: isAdmin,
        onClick: () => onOpenModal({ modalType: ModalType.EDIT_SERVER, data: { server } }),
      },
      {
        title: 'Manage Members',
        icons: [
          <PersonIcon key="manage-members-icon-0" className="h-4 w-4 -translate-x-0.5" />,
          <GearIcon
            key="manage-members-icon-1"
            className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1.5 w-2.5 h-2.5"
          />,
        ],
        visible: isAdmin,
        onClick: () => {},
      },
      {
        title: 'Create Channel',
        icons: [<PlusCircledIcon key="create-channel-icon-0" className="h-4 w-4 -translate-x-0.5" />],
        visible: isModerator,
        onClick: () => {},
      },
      {
        title: '',
        visible: isModerator,
      },
      {
        title: 'Delete Server',
        icons: [<TrashIcon key="delete-server-icon-0" className="h-4 w-4 -translate-x-0.5" />],
        visible: isAdmin,
        className: 'text-rose-500',
        onClick: () => {},
      },
      {
        title: 'Leave Server',
        icons: [<ExitIcon key="leave-server-icon-0" className="h-4 w-4 -translate-x-0.5" />],
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
          <ChevronDownIcon className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {items.map(({ visible, title, className, onClick, icons }, index) => {
          if (!visible) return null

          if (!title.length) return <DropdownMenuSeparator key={`separator-${index}`} />

          return (
            <DropdownMenuItem
              key={title}
              className={cn(className, 'px-3 py-2 text-sm cursor-pointer')}
              onClick={onClick}
            >
              {title}
              <div className="ml-auto">{icons}</div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
