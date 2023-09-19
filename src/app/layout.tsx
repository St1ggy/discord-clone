import './globals.css'
import { type Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { type FC, type PropsWithChildren } from 'react'

import { Providers } from './providers'

const font = Open_Sans({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Team Chat App',
  description: 'Generated by create next app',
}

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="en" suppressHydrationWarning>
    <body className={font.className} suppressHydrationWarning>
      <Providers>{children}</Providers>
    </body>
  </html>
)

export default RootLayout
