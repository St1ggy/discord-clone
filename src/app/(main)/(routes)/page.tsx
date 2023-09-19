import { UserButton } from '@clerk/nextjs'
import { type FC } from 'react'

import { ModeToggle } from '@/components/mode-toggle'

const Page: FC = () => (
  <div>
    <UserButton afterSignOutUrl="/" />
    <ModeToggle />
  </div>
)

export default Page
