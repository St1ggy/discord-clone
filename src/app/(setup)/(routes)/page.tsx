import { redirect } from 'next/navigation'
import { type FC } from 'react'

import { InitialModal } from '@/components/modals'
import { db } from '@/lib/db'
import { profileInit } from '@/lib/profile-init'

const SetupPage: FC = async () => {
  const profile = await profileInit()
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (server) {
    return redirect(`/servers/${server.id}`)
  }

  return <InitialModal />
}

export default SetupPage
