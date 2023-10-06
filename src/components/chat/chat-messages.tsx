'use client'

import { type Member } from '@prisma/client'
import { format } from 'date-fns'
import { Loader2, type LucideProps, ServerCrash } from 'lucide-react'
import { type FC, Fragment, useRef } from 'react'

import { useChatQuery } from '@/hooks/use-chat-query'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { useChatSocket } from '@/hooks/use-chat-socket'
import { cn } from '@/lib/utils'
import { type ChatType, type MessageParamKey, type MessageWithMemberWithProfile } from '@/types'

import { ChatItem } from './chat-item'
import { ChatWelcome } from './chat-welcome'

const DATE_FORMAT = 'd MMM yyyy HH:mm'

interface ChatMessagesStatusProps {
  animate?: boolean
  text: string
  Icon: FC<LucideProps>
}

const ChatMessagesStatus: FC<ChatMessagesStatusProps> = ({ animate, text, Icon }) => (
  <div className="flex flex-col flex-1 justify-center items-center">
    <Icon className={cn('h-7 w-7 text-zinc-500 my-4', { 'animate-spin': animate })} />
    <p className="text-xs text-zinc-500 dark:text-zinc-400">{text}</p>
  </div>
)

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
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery<{
    items: MessageWithMemberWithProfile[]
  }>({
    queryKey,
    paramKey,
    paramValue,
    apiUrl,
  })
  const chatRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useChatSocket({ queryKey, addKey, updateKey })
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages[0]?.items?.length ?? 0,
  })

  if (status === 'loading') return <ChatMessagesStatus Icon={Loader2} text="Loading messages..." animate />
  if (status === 'error') return <ChatMessagesStatus Icon={ServerCrash} text="Something went wrong..." />

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto" ref={chatRef}>
      {hasNextPage ? (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="flex-1" />
          <ChatWelcome chatType={chatType} name={name} />
        </>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, index) => (
          <Fragment key={index}>
            {group.items.map((message) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                content={message.content}
                member={message.member}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                isUpdated={message.createdAt !== message.updatedAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
