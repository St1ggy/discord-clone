import { Hash } from 'lucide-react'
import { type FC, useMemo } from 'react'

import { ChatType } from '@/types'

interface ChatWelcomeProps {
  chatType: ChatType
  name: string
}

export const ChatWelcome: FC<ChatWelcomeProps> = ({ chatType, name }) => {
  const { avatar, welcomeMessage, startMessage } = useMemo(() => {
    const isChannel = chatType === ChatType.CHANNEL

    const _avatar = isChannel ? (
      <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
        <Hash className="h-12 w-12 text-white" />
      </div>
    ) : null

    const _welcomeMessage = isChannel ? 'Welcome to #' : ''

    const _startMessage = isChannel
      ? `This is the start of #${name} channel.`
      : `This is the start of your conversation with ${name}`

    return { avatar: _avatar, welcomeMessage: _welcomeMessage, startMessage: _startMessage }
  }, [chatType, name])

  return (
    <div className="space-y-2 px-4 mb-4">
      {avatar}
      <p className="text-xl md:text-3xl font-bold">
        {welcomeMessage}
        {name}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">{startMessage}</p>
    </div>
  )
}
