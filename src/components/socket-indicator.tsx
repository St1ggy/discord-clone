'use client'

import { useSocket } from '@/components/providers'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export const SocketIndicator = () => {
  const { isConnected } = useSocket()

  return (
    <Badge
      variant="outline"
      className={cn('bg-yellow-600 text-white border-none', {
        'bg-emerald-600': isConnected,
      })}
    >
      {isConnected ? 'Live: Real-time updates' : 'Fallback: Polling every 1s'}
    </Badge>
  )
}
