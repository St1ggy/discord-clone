import { Menu } from 'lucide-react'
import { type FC } from 'react'

import { NavigationSidebar } from '@/components/navigation'
import { ServerSidebar } from '@/components/server'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface MobileToggleProps {
  serverId: string
}

export const MobileToggle: FC<MobileToggleProps> = ({ serverId }) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="p-0 flex gap-0">
      <div className="w-[72px]">
        <NavigationSidebar />
      </div>
      <ServerSidebar serverId={serverId} />
    </SheetContent>
  </Sheet>
)
