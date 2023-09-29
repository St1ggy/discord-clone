import { ClerkProvider } from '@clerk/nextjs'
import { type FC, type PropsWithChildren } from 'react'

import { ModalProvider, QueryProvider, SocketProvider, ThemeProvider } from '@/components/providers'

export const Providers: FC<PropsWithChildren> = ({ children }) => (
  <ClerkProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="discord-theme">
      <SocketProvider>
        <ModalProvider />
        <QueryProvider>{children}</QueryProvider>
      </SocketProvider>
    </ThemeProvider>
  </ClerkProvider>
)
