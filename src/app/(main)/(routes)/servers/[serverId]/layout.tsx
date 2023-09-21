import { redirectToSignIn } from '@clerk/nextjs'
import { type Server } from '@prisma/client'
import { redirect } from 'next/navigation'

import { ServerSidebar } from '@/components/server'
import { db } from '@/lib/db'
import { getCurrentProfile } from '@/lib/get-current-profile'

interface ServerIdLayoutParams {
  serverId: string
}

const ServerIdLayout: NextLayout<ServerIdLayoutParams> = async ({ children, params }) => {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirectToSignIn()

    return null
  }

  const server: Server | null = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (!server) return redirect('/')

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={server.id} />
      </div>
      <main className="md:pl-60 h-full">{children}</main>
    </div>
  )
}

export default ServerIdLayout
