import { type NextApiRequest } from 'next'

import { db } from '@/lib/db'
import { getCurrentProfile } from '@/lib/get-current-profile'
import { type NextApiResponseServerIo } from '@/types'

const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const profile = await getCurrentProfile(req)
    if (!profile) return res.status(401).json({ error: 'Unauthorized' })

    const { serverId, channelId } = req.query as { serverId: string; channelId: string }
    if (!serverId) return res.status(400).json({ error: 'Server ID Missing' })
    if (!channelId) return res.status(400).json({ error: 'Channel ID Missing' })

    const { content, fileUrl } = req.body
    if (!content) return res.status(400).json({ error: 'Content Missing' })

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: { some: { profileId: profile.id } },
      },
      include: { members: true },
    })
    if (!server) return res.status(404).json({ message: 'Server Not Found' })

    const channel = await db.channel.findFirst({
      where: { id: channelId, serverId },
    })
    if (!channel) return res.status(404).json({ message: 'Channel Not Found' })

    const member = server.members.find(({ profileId }) => profileId === profile.id)
    if (!member) return res.status(404).json({ message: 'Member Not Found' })

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId,
        memberId: member.id,
      },
      include: { member: { include: { profile: true } } },
    })

    const channelKey = `chat:${channelId}:messages`
    res.socket?.server?.io?.emit(channelKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log('socket/messages [POST]')

    return res.status(500).json({ message: 'Internal Error' })
  }
}

export default handler
