'use client'

import { MemberRole } from '@prisma/client'
import { ChevronDown, LogOut, type LucideProps, PlusCircle, Settings, Trash, UserCog, UserPlus } from 'lucide-react'
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
  role?: MemberRole
}

type MenuItem =
  | {
      title: string
      IconComponent: FC<LucideProps>
      className?: string
      onClick: VoidFunction
    }
  | 'separator'

export const ServerHeader: FC<ServerHeaderProps> = ({ server, role }) => {
  const { onOpenModal } = useModalStore()

  const isAdmin = role === MemberRole.ADMIN
  const isModerator = isAdmin || role === MemberRole.MODERATOR

  const items = useMemo(() => {
    const result: MenuItem[] = []

    if (isModerator)
      result.push({
        title: 'Invite People',
        IconComponent: UserPlus,
        className: 'text-indigo-600 dark:text-indigo-400',
        onClick: () => onOpenModal(ModalType.INVITE, { server }),
      })

    if (isAdmin)
      result.push(
        {
          title: 'Server Settings',
          IconComponent: Settings,
          onClick: () => onOpenModal(ModalType.EDIT_SERVER, { server }),
        },
        {
          title: 'Manage Members',
          IconComponent: UserCog,
          onClick: () => onOpenModal(ModalType.MEMBERS, { server }),
        },
      )

    if (isModerator)
      result.push(
        {
          title: 'Create Channel',
          IconComponent: PlusCircle,
          onClick: () => onOpenModal(ModalType.CREATE_CHANNEL, { server }),
        },
        'separator',
      )

    result.push(
      isAdmin
        ? {
            title: 'Delete Server',
            IconComponent: Trash,
            className: 'text-rose-500',
            onClick: () => onOpenModal(ModalType.DELETE_SERVER, { server }),
          }
        : {
            title: 'Leave Server',
            IconComponent: LogOut,
            className: 'text-rose-500',
            onClick: () => onOpenModal(ModalType.LEAVE_SERVER, { server }),
          },
    )

    return result
  }, [isModerator, isAdmin, onOpenModal, server])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {items.map((item, index) => {
          if (item === 'separator') return <DropdownMenuSeparator key={`separator-${index}`} />
          const { title, className, onClick, IconComponent } = item

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
