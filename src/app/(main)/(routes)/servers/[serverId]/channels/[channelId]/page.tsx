import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { ChatHeader } from '@/components/chat'
import { db } from '@/lib/db'
import { getCurrentProfile } from '@/lib/get-current-profile'
import { ChatCategory } from '@/types'

const ChannelIdPage: NextPage<{ serverId: string; channelId: string }> = async ({
  params: { serverId, channelId },
}) => {
  const profile = await getCurrentProfile()

  if (!profile) return redirectToSignIn()

  const channel = await db.channel.findUnique({
    where: { serverId, id: channelId },
  })
  const member = await db.member.findFirst({
    where: { serverId, profileId: profile.id },
  })

  if (!channel || !member) redirect('/')

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader chatType={ChatCategory.CHANNELS} name={channel.name} serverId={serverId} />
    </div>
  )
}

export default ChannelIdPage
