import { ClerkProvider } from '@clerk/nextjs'
import { type FC, type PropsWithChildren } from 'react'

import { ModalProvider, SocketProvider, ThemeProvider } from '@/components/providers'

export const Providers: FC<PropsWithChildren> = ({ children }) => (
  <ClerkProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="discord-theme">
      <SocketProvider>
        <ModalProvider />
        {children}
      </SocketProvider>
    </ThemeProvider>
  </ClerkProvider>
)
