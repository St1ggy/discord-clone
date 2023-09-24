import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

import { tryWithProfile } from '@/app/api/try-with-profile'
import { db } from '@/lib/db'

export const DELETE = async (req: Request, { params: { channelId } }: { params: { channelId?: string } }) => {
  const { serverId } = await req.json()

  return tryWithProfile(
    async (profile) => {
      if (!serverId) return new NextResponse('Server ID Missing', { status: 400 })
      if (!channelId) return new NextResponse('Server ID Missing', { status: 400 })

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
            deleteMany: { id: channelId, name: { not: 'general' } },
          },
        },
      })
    },
    'channels/[channelId] [DELETE]',
    { channelId },
  )
}

export const PATCH = async (req: Request, { params: { channelId } }: { params: { channelId?: string } }) => {
  const { name, channelType, serverId } = await req.json()

  return tryWithProfile(
    async (profile) => {
      if (!serverId) return new NextResponse('Server ID Missing', { status: 400 })
      if (!channelId) return new NextResponse('Server ID Missing', { status: 400 })

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
                name: { not: 'general' },
              },
              data: { name, type: channelType },
            },
          },
        },
      })
    },
    'channels/[channelId] [PATCH]',
    { channelId },
  )
}
