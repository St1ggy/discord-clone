'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type Member, MemberRole } from '@prisma/client'
import axios from 'axios'
import { Edit, Trash } from 'lucide-react'
import { type FC, useMemo } from 'react'
import * as z from 'zod'

import { ActionTooltip } from '@/components/action-tooltip'
import { ChatContentEditing } from '@/components/chat/chat-content-editing'
import { Form } from '@/components/ui/form'
import { UserAvatar } from '@/components/user-avatar'
import { useBoolean } from '@/hooks/use-boolean'
import { ModalType, useModalStore } from '@/hooks/use-modal-store'
import { iconMaps } from '@/lib/maps'
import { cn } from '@/lib/utils'
import { type MemberWithProfile } from '@/types'

import { ChatAttachment } from './chat-attachment'

interface ChatItemProps {
  id: string
  content: string
  member: MemberWithProfile
  timestamp: string
  fileUrl: string | null
  deleted: boolean
  isUpdated: boolean
  currentMember: Member
  socketUrl: string
  socketQuery: Record<string, string>
}

export const ChatItem: FC<ChatItemProps> = ({
  id,
  deleted,
  currentMember,
  member,
  fileUrl,
  socketUrl,
  socketQuery,
  isUpdated,
  timestamp,
  content,
}) => {
  const [isEditing, setIsEditingTrue, setIsEditingFalse] = useBoolean()
  const { onOpenModal } = useModalStore()

  const roleIcon = iconMaps.roles[member.role]

  const isAdmin = currentMember.role === MemberRole.ADMIN
  const isModerator = currentMember.role === MemberRole.MODERATOR
  const isOwner = currentMember.id === member.id

  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
  const canEditMessage = !deleted && isOwner && !fileUrl

  const handleDelete = () => {
    onOpenModal(ModalType.DELETE_MESSAGE, {
      apiUrl: `${socketUrl}/${id}`,
      query: socketQuery,
    })
  }

  const itemContent = useMemo(() => {
    if (fileUrl) return null

    if (isEditing) {
      return (
        <ChatContentEditing
          id={id}
          content={content}
          onCloseEditing={setIsEditingFalse}
          socketUrl={socketUrl}
          socketQuery={socketQuery}
        />
      )
    }

    return (
      <p
        className={cn('text-sm text-zinc-600 dark:text-zinc-300', {
          'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1': deleted,
        })}
      >
        {content}
        {isUpdated && !deleted && <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">(edited)</span>}
      </p>
    )
  }, [content, deleted, fileUrl, id, isEditing, isUpdated, setIsEditingFalse, socketQuery, socketUrl])

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">{member.profile.name}</p>
              <ActionTooltip label={member.role}>{roleIcon('h-4 w-4 ml-2')}</ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{timestamp}</span>
          </div>
          <ChatAttachment fileUrl={fileUrl} content={content} />
          {itemContent}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={setIsEditingTrue}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={handleDelete}
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}
