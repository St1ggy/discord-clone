import { NextResponse } from 'next/server'

import { tryWithProfile } from '@/app/api/try-with-profile'
import { db } from '@/lib/db'

export const PATCH = async (req: Request, { params: { serverId } }: { params: { serverId?: string } }) =>
  tryWithProfile(
    async (profile) => {
      if (!serverId) return new NextResponse('Server ID Missing', { status: 400 })

      return db.server.update({
        where: {
          id: serverId,
          profileId: { not: profile.id },
          members: { some: { profileId: profile.id } },
        },
        data: { members: { deleteMany: { profileId: profile.id } } },
      })
    },
    'servers/[serverId]/leave [PATCH]',
    { serverId },
  )
