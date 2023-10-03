import { type QueryClient, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { useSocket } from '@/components/providers'
import { type MessageWithMemberWithProfile } from '@/types'

export interface UseChatSocketProps {
  addKey: string
  updateKey: string
  queryKey: string
}

const onUpdate = (queryClient: QueryClient, queryKey: string) => (message: MessageWithMemberWithProfile) => {
  queryClient.setQueryData([queryKey], (oldData: any) => {
    if (!(oldData?.pages?.length !== 0)) return oldData

    const newData = oldData.pages.map((page: any) => ({
      ...page,
      items: page.items.map((item: MessageWithMemberWithProfile) => {
        if (item.id === message.id) {
          return message
        }

        return item
      }),
    }))

    return { ...oldData, pages: newData }
  })
}

const onAdd = (queryClient: QueryClient, queryKey: string) => (message: MessageWithMemberWithProfile) => {
  queryClient.setQueryData([queryKey], (oldData: any) => {
    if (!(oldData?.pages?.length !== 0)) return { pages: [{ items: [message] }] }

    const newData = [...oldData.pages]
    newData[0].items.unshift(message)

    return { ...oldData, pages: newData }
  })
}

export const useChatSocket = ({ addKey, updateKey, queryKey }: UseChatSocketProps) => {
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) return

    socket.on(updateKey, onUpdate(queryClient, queryKey))
    socket.on(addKey, onAdd(queryClient, queryKey))

    return () => {
      socket.off(updateKey)
      socket.off(addKey)
    }
  }, [addKey, queryClient, queryKey, socket, updateKey])
}
