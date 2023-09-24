import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { GENERAL_CHANNEL } from '@/lib/constants'
import { db } from '@/lib/db'
import { getCurrentProfile } from '@/lib/get-current-profile'

const ServerIdPage: NextPage<{ serverId: string }> = async ({ params: { serverId } }) => {
  const profile = await getCurrentProfile()

  if (!profile) return redirectToSignIn()

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: { some: { profileId: profile.id } },
    },
    include: {
      channels: {
        where: { name: GENERAL_CHANNEL },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  const initialChannel = server?.channels[0]

  if (initialChannel?.name !== GENERAL_CHANNEL) return null

  redirect(`/servers/${serverId}/channels/${initialChannel.id}`)
}

export default ServerIdPage
