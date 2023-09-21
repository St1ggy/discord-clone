import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { getCurrentProfile } from '@/lib/get-current-profile'

const InviteCodePage: NextPage<{ inviteCode: string }> = async ({ params: { inviteCode } }) => {
  const profile = await getCurrentProfile()

  if (!profile) return redirectToSignIn()
  if (!inviteCode) return redirect('/')

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (existingServer) return redirect(`/servers/${existingServer.id}`)

  const server = await db.server.update({
    where: { inviteCode },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  })

  if (server) return redirect(`/servers/${server.id}`)

  return <div>123</div>
}

export default InviteCodePage
