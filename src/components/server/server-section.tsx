'use client'

import { type ChannelType, MemberRole } from '@prisma/client'
import { Plus, Settings } from 'lucide-react'
import { type FC } from 'react'

import { ActionTooltip } from '@/components/action-tooltip'
import { ModalType, useModalStore } from '@/hooks'
import { ListItemCategory, type ServerWithMembersWithProfilesWithChannels } from '@/types'

type ServerSectionProps = {
  label: string
  role?: MemberRole
  server?: ServerWithMembersWithProfilesWithChannels
} & (
  | {
      sectionType: ListItemCategory.CHANNELS
      channelType?: ChannelType
    }
  | { sectionType: ListItemCategory.MEMBERS }
)

export const ServerSection: FC<ServerSectionProps> = ({ label, server, role, ...rest }) => {
  const { onOpenModal } = useModalStore()

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">{label}</p>
      {role !== MemberRole.GUEST && rest.sectionType === ListItemCategory.CHANNELS && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() =>
              onOpenModal({ modalType: ModalType.CREATE_CHANNEL, data: { server, channelType: rest.channelType } })
            }
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && rest.sectionType === ListItemCategory.MEMBERS && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpenModal({ modalType: ModalType.MEMBERS, data: { server } })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}
