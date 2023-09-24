import { MemberRole } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

import { GENERAL_CHANNEL } from '@/lib/constants'
import { db } from '@/lib/db'

import { tryWithProfile } from '../try-with-profile'

export const POST = async (req: Request) =>
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
              name: GENERAL_CHANNEL,
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
