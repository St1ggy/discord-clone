import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

import { tryWithProfile } from '@/app/api/try-with-profile'
import { GENERAL_CHANNEL } from '@/lib/constants'
import { db } from '@/lib/db'

export const DELETE = async (req: Request, { params: { channelId } }: { params: { channelId?: string } }) => {
  const { serverId } = await req.json()

  return tryWithProfile(
    async (profile) => {
      if (!serverId) return new NextResponse('Server ID Missing', { status: 400 })
      if (!channelId) return new NextResponse('Channel ID Missing', { status: 400 })

      return db.server.update({
        where: {
          id: serverId,
          members: {
            some: {
              profileId: profile.id,
              role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
            },
          },
        },
        data: {
          channels: {
            deleteMany: { id: channelId, name: { not: GENERAL_CHANNEL } },
          },
        },
      })
    },
    'channels/[memberId] [DELETE]',
    { channelId },
  )
}

export const PATCH = async (req: Request, { params: { channelId } }: { params: { channelId?: string } }) => {
  const { name, channelType, serverId } = await req.json()

  return tryWithProfile(
    async (profile) => {
      if (!serverId) return new NextResponse('Server ID Missing', { status: 400 })
      if (!channelId) return new NextResponse('Channel ID Missing', { status: 400 })

      return db.server.update({
        where: {
          id: serverId,
          members: {
            some: {
              profileId: profile.id,
              role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
            },
          },
        },
        data: {
          channels: {
            update: {
              where: {
                id: channelId,
                name: { not: GENERAL_CHANNEL },
              },
              data: { name, type: channelType },
            },
          },
        },
      })
    },
    'channels/[memberId] [PATCH]',
    { channelId },
  )
}
