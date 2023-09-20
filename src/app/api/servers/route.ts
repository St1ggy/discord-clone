import { MemberRole, type Server } from '@prisma/client'
import { type NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { db } from '@/lib/db'
import { getCurrentProfile } from '@/lib/get-current-profile'

export const POST = async (req: NextRequest) => {
  try {
    const { name, imageUrl } = await req.json()
    const profile = await getCurrentProfile()

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })

    const server: Server = await db.server.create({
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
              role: MemberRole.ADMIM,
            },
          ],
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[SERVERS] [POST]', error)

    return new NextResponse('Internal Error', { status: 500 })
  }
}
