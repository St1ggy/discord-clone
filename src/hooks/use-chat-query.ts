import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'

import { useSocket } from '@/components/providers'
import { type MessageParamKey } from '@/types'

interface ChatQueryProps {
  queryKey: string
  apiUrl: string
  paramKey: MessageParamKey
  paramValue: string
}

export const useChatQuery = <DataType extends Record<string, unknown>>({
  queryKey,
  paramKey,
  paramValue,
  apiUrl,
}: ChatQueryProps) => {
  const { isConnected } = useSocket()

  const fetchMessages = async ({ pageParam }: { pageParam?: string } = { pageParam: void 0 }) => {
    const { data } = await axios.get<{ nextCursor: string } & DataType>(apiUrl, {
      params: { cursor: pageParam, [paramKey]: paramValue },
    })

    return data
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
  })

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  }
}
