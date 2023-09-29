'use client'

import { type Member, type Message } from '@prisma/client'
import { Loader2, ServerCrash } from 'lucide-react'
import { type FC, Fragment } from 'react'

import { useChatQuery } from '@/hooks/use-chat-query'
import { type ChatType, type MessageParamKey, type MessageWithMemberWithProfile } from '@/types'

import { ChatWelcome } from './chat-welcome'

interface ChatMessagesProps {
  name: string
  member: Member
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: MessageParamKey
  paramValue: string
  chatType: ChatType
}

export const ChatMessages: FC<ChatMessagesProps> = ({
  name,
  chatId,
  chatType,
  paramKey,
  paramValue,
  socketUrl,
  socketQuery,
  apiUrl,
  member,
}) => {
  const queryKey = `chat:${chatId}`

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery<{
    items: MessageWithMemberWithProfile[]
  }>({
    queryKey,
    paramKey,
    paramValue,
    apiUrl,
  })

  if (status === 'loading')
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading messages...</p>
      </div>
    )

  if (status === 'error')
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Something went wrong...</p>
      </div>
    )

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome chatType={chatType} name={name} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, index) => (
          <Fragment key={index}>
            {group.items.map((message) => (
              <div key={message.id}>{message.content}</div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
