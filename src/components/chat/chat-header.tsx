import { Hash } from 'lucide-react'
import { type FC, useMemo } from 'react'

import { MobileToggle } from '@/components/mobile-toggle'
import { SocketIndicator } from '@/components/socket-indicator'
import { UserAvatar } from '@/components/user-avatar'
import { ChatType } from '@/types'

type ChatHeaderProps = {
  serverId: string
  name: string
} & (
  | {
      chatType: ChatType.CONVERSATION
      imageUrl?: string
    }
  | {
      chatType: ChatType.CHANNEL
    }
)

export const ChatHeader: FC<ChatHeaderProps> = ({ serverId, name, ...rest }) => {
  const image = useMemo(() => {
    switch (rest.chatType) {
      case ChatType.CHANNEL:
        return <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      case ChatType.CONVERSATION:
        return <UserAvatar src={rest.imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
    }
  }, [rest])

  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />

      {image}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>

      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  )
}
