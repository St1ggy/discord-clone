import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { tryWithProfile } from '@/app/api/try-with-profile'
import { db } from '@/lib/db'

export const PATCH = async (req: Request, { params: { serverId } }: { params: { serverId?: string } }) =>
  tryWithProfile(async (profile) => {
    if (!serverId) return new NextResponse('Server ID Missing', { status: 400 })

    return db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        inviteCode: uuidv4(),
      },
    })
  }, `servers/${serverId}/invite-code [POST]`)
