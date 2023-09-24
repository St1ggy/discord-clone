import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

import { tryWithProfile } from '@/app/api/try-with-profile'
import { db } from '@/lib/db'

export const POST = async (req: Request) =>
  tryWithProfile(async (profile) => {
    const { name, channelType, serverId } = await req.json()

    if (!serverId) return new NextResponse('Server ID Missing', { status: 400 })

    return await db.server.update({
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
          create: {
            profileId: profile.id,
            name,
            type: channelType,
          },
        },
      },
      include: {
        channels: {
          orderBy: { createdAt: 'asc' },
        },
        members: {
          include: { profile: true },
          orderBy: { role: 'asc' },
        },
      },
    })
  }, 'channels [POST]')
