import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { ChatHeader } from '@/components/chat'
import { getOrCreateConversation } from '@/lib/conversation-utils'
import { db } from '@/lib/db'
import { getCurrentProfile } from '@/lib/get-current-profile'
import { ChatType } from '@/types'

const MemberIdPage: NextPage<{ serverId: string; memberId: string }> = async ({ params: { serverId, memberId } }) => {
  const profile = await getCurrentProfile()

  if (!profile) return redirectToSignIn()

  const currentMember = await db.member.findFirst({
    where: { serverId, profileId: profile.id },
    include: { profile: true },
  })

  if (!currentMember) redirect('/')

  const conversation = await getOrCreateConversation({
    member1Id: currentMember.id,
    member2Id: memberId,
  })

  if (!conversation) redirect(`/servers/${serverId}`)

  const { member1, member2 } = conversation
  const otherMember = member1.profileId === profile.id ? member2 : member1

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        chatType={ChatType.CONVERSATION}
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.imageUrl}
        serverId={serverId}
      />
    </div>
  )
}

export default MemberIdPage
