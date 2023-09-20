import { type FC, type PropsWithChildren } from 'react'

import { NavigationSidebar } from '@/components/navigation'

const MainLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className="h-full ">
    <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed in">
      <NavigationSidebar />
    </div>
    <main className="md:pl-[72px] h-full">{children}</main>
  </div>
)

export default MainLayout
