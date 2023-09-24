import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { ChatHeader } from '@/components/chat'
import { db } from '@/lib/db'
import { getCurrentProfile } from '@/lib/get-current-profile'
import { ChatCategory } from '@/types'

const MemberIdPage: NextPage<{ serverId: string; memberId: string }> = async ({ params: { serverId, memberId } }) => {
  const profile = await getCurrentProfile()

  if (!profile) return redirectToSignIn()

  const member = await db.member.findFirst({
    where: { serverId, id: memberId },
    include: { profile: true },
  })

  if (!member) redirect('/')

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        chatType={ChatCategory.CONVERSATIONS}
        name={member.profile.name}
        imageUrl={member.profile.imageUrl}
        serverId={serverId}
      />
    </div>
  )
}

export default MemberIdPage
