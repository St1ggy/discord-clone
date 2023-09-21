import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { InitialModal } from '@/components/modals'
import { db } from '@/lib/db'
import { profileInit } from '@/lib/profile-init'

const SetupPage: NextPage = async () => {
  const profile = await profileInit()

  if (!profile) {
    return redirectToSignIn()
  }

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
