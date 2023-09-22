import { NextResponse } from 'next/server'

import { tryWithProfile } from '@/app/api/try-with-profile'
import { db } from '@/lib/db'

export const PATCH = async (req: Request, { params: { memberId } }: { params: { memberId: string } }) => {
  const { serverId, role } = await req.json()

  return tryWithProfile(
    async (profile) => {
      if (!serverId) return new NextResponse('Server ID Missing', { status: 400 })
      if (!memberId) return new NextResponse('Member ID Missing', { status: 400 })

      return await db.server.update({
        where: { id: serverId, profileId: profile.id },
        data: {
          members: {
            update: {
              where: {
                id: memberId,
                profileId: { not: profile.id },
              },
              data: { role },
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
    },
    'members/[memberId] [PATCH]',
    { memberId, serverId, role },
  )
}

export const DELETE = async (req: Request, { params: { memberId } }: { params: { memberId: string } }) => {
  const { serverId } = await req.json()

  return tryWithProfile(
    async (profile) => {
      if (!serverId) return new NextResponse('Server ID Missing', { status: 400 })
      if (!memberId) return new NextResponse('Member ID Missing', { status: 400 })

      return await db.server.update({
        where: { id: serverId, profileId: profile.id },
        data: {
          members: {
            deleteMany: {
              id: memberId,
              profileId: { not: profile.id },
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
    },
    'members/[memberId] [DELETE]',
    { memberId, serverId },
  )
}
