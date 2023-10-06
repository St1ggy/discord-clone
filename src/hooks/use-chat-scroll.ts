import { type RefObject, useEffect } from 'react'

import { useBoolean } from '@/hooks/use-boolean'

interface UseChatScrollProps {
  chatRef: RefObject<HTMLDivElement>
  bottomRef: RefObject<HTMLDivElement>
  shouldLoadMore: boolean
  loadMore: VoidFunction
  count: number
}

export const useChatScroll = ({ chatRef, bottomRef, count, loadMore, shouldLoadMore }: UseChatScrollProps) => {
  const [initialized, setInitializedTrue, setInitializedFalse] = useBoolean()

  useEffect(() => {
    const topDiv = chatRef.current

    if (!topDiv) return

    const handleScroll = () => {
      const scrollTop = topDiv.scrollTop

      if (scrollTop === 0 && shouldLoadMore) loadMore()
    }

    topDiv.addEventListener('scroll', handleScroll)

    return () => {
      topDiv.removeEventListener('scroll', handleScroll)
    }
  }, [chatRef, loadMore, shouldLoadMore])

  useEffect(() => {
    const bottomDiv = chatRef.current
    const topDiv = chatRef.current

    const shouldAutoScroll = () => {
      if (!initialized && bottomDiv) {
        setInitializedTrue()

        return true
      }

      if (!topDiv) return false

      const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight

      return distanceFromBottom <= 100
    }

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [bottomRef, chatRef, initialized, setInitializedTrue])
}
