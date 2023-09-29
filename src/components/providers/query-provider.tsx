'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type FC, type PropsWithChildren, useRef } from 'react'

export const QueryProvider: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = useRef(new QueryClient())

  return <QueryClientProvider client={queryClient.current}>{children}</QueryClientProvider>
}
