import { NextResponse } from 'next/server'

import { tryWithProfile } from '@/app/api/try-with-profile'
import { db } from '@/lib/db'

export const PATCH = async (req: Request, { params: { serverId } }: { params: { serverId?: string } }) =>
  tryWithProfile(
    async (profile) => {
      if (!serverId) return new NextResponse('Server ID Missing', { status: 400 })

      const { name, imageUrl } = await req.json()

      return db.server.update({
        where: { id: serverId, profileId: profile.id },
        data: { name, imageUrl },
      })
    },
    'servers/[serverId] [PATCH]',
    { serverId },
  )

export const DELETE = async (req: Request, { params: { serverId } }: { params: { serverId?: string } }) =>
  tryWithProfile(
    async (profile) => {
      if (!serverId) return new NextResponse('Server ID Missing', { status: 400 })

      return db.server.deleteMany({
        where: { id: serverId, profileId: profile.id },
      })
    },
    'servers/[serverId] [DELETE]',
    { serverId },
  )
