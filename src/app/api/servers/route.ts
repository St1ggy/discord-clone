import { MemberRole } from '@prisma/client'
import { type NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { db } from '@/lib/db'

import { tryWithProfile } from '../try-with-profile'

export const POST = async (req: NextRequest) =>
  tryWithProfile(async (profile) => {
    const { name, imageUrl } = await req.json()

    return db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: 'general',
              profileId: profile.id,
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    })
  }, 'servers [POST]')
