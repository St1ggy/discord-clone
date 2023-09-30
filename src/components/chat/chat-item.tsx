'use client'

import { type Member, MemberRole } from '@prisma/client'
import { Edit, File, Trash } from 'lucide-react'
import Image from 'next/image'
import { type FC } from 'react'

import { ActionTooltip } from '@/components/action-tooltip'
import { UserAvatar } from '@/components/user-avatar'
import { useBoolean } from '@/hooks/use-boolean'
import { iconMaps } from '@/lib/maps'
import { cn } from '@/lib/utils'
import { type MemberWithProfile } from '@/types'

interface AttachmentProps {
  fileUrl: string | null
  content: string
}

const Attachment: FC<AttachmentProps> = ({ fileUrl, content }) => {
  const fileType = fileUrl?.split('.').pop()
  const isPdf = fileUrl && fileType === 'pdf'
  const isImage = fileUrl && !isPdf

  if (isImage) {
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener norferrer"
        className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
      >
        <Image src={fileUrl} fill alt={content} className="object-cover" />
      </a>
    )
  }

  if (isPdf) {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <File className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener norferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          PDF File
        </a>
      </div>
    )
  }

  return null
}

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
  const [isDeleting, setIsDeletingTrue, setIsDeletingFalse] = useBoolean()

  const roleIcon = iconMaps.roles[member.role]

  const isAdmin = currentMember.role === MemberRole.ADMIN
  const isModerator = currentMember.role === MemberRole.MODERATOR
  const isOwner = currentMember.id === member.id

  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
  const canEditMessage = !deleted && isOwner && !fileUrl

  const isLoading = false

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
          <Attachment fileUrl={fileUrl} content={content} />
          {!fileUrl && !isEditing && (
            <p
              className={cn('text-sm text-zinc-600 dark:text-zinc-300', {
                'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1': deleted,
              })}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">(edited)</span>
              )}
            </p>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}
