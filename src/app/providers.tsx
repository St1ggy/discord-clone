import { ClerkProvider } from '@clerk/nextjs'
import { type FC, type PropsWithChildren } from 'react'

import { ThemeProvider } from '@/components/providers'

export const Providers: FC<PropsWithChildren> = ({ children }) => (
  <ClerkProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="discord-theme">
      {children}
    </ThemeProvider>
  </ClerkProvider>
)