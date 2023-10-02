import { MemberRole } from '@prisma/client'
import { type NextApiRequest } from 'next'

import { db } from '@/lib/db'
import { getCurrentProfile } from '@/lib/get-current-profile'
import { type MessageWithMemberWithProfile, type NextApiResponseServerIo } from '@/types'

const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!req.method || !['PATCH', 'DELETE'].includes(req.method))
    return res.status(405).json({ error: 'Method not allowed' })

  try {
    const profile = await getCurrentProfile(req)
    if (!profile) return res.status(401).json({ error: 'Unauthorized' })

    const { content } = req.body
    const { serverId, channelId, messageId } = req.query as {
      serverId: string
      channelId: string
      messageId: string
    }
    if (!serverId) return res.status(400).json({ error: 'Server ID Missing' })
    if (!channelId) return res.status(400).json({ error: 'Channel ID Missing' })
    if (!messageId) return res.status(400).json({ error: 'Message ID Missing' })

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: { some: { profileId: profile.id } },
      },
      include: { members: true },
    })
    if (!server) return res.status(404).json({ message: 'Server not found' })

    const channel = await db.channel.findFirst({
      where: { id: channelId, serverId },
    })
    if (!channel) return res.status(404).json({ message: 'Channel not found' })

    const member = server.members.find(({ profileId }) => profileId === profile.id)
    if (!member) return res.status(404).json({ message: 'Member not found' })

    let message = await db.message.findFirst({
      where: { id: messageId },
      include: { member: { include: { profile: true } } },
    })
    if (!message || message.deleted) return res.status(404).json({ message: 'Message not found' })

    const isMessageOwner = message.memberId === member.id
    const isAdmin = member.role === MemberRole.ADMIN
    const isModerator = member.role === MemberRole.MODERATOR
    const canModify = isMessageOwner || isAdmin || isModerator

    if (!canModify) return res.status(401).json({ error: 'Unauthorized' })

    if (req.method === 'DELETE') {
      message = await db.message.update({
        where: { id: messageId },
        data: { deleted: true, fileUrl: null, content: 'This message has been deleted' },
        include: { member: { include: { profile: true } } },
      })
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) return res.status(401).json({ error: 'Unauthorized' })

      message = await db.message.update({
        where: { id: messageId },
        data: { content },
        include: { member: { include: { profile: true } } },
      })
    }

    const updateKey = `chat:${channelId}:messages:update`
    res.socket?.server?.io?.emit(updateKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log(`socket/messages [${req.method}]`)

    return res.status(500).json({ message: 'Internal Error' })
  }
}

export default handler
