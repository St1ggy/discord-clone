import { NextResponse } from 'next/server'

import { tryWithProfile } from '@/app/api/try-with-profile'
import { db } from '@/lib/db'

const MESSAGES_BATCH = 100

export const GET = async (req: Request) =>
  tryWithProfile(async () => {
    const { searchParams } = new URL(req.url)

    const cursor = searchParams.get('cursor')
    const channelId = searchParams.get('channelId')

    if (!channelId) return new NextResponse('Channel ID Missing', { status: 400 })

    const messages = await db.message.findMany({
      take: MESSAGES_BATCH,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      where: { channelId },
      include: { member: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' },
    })

    const nextCursor = messages.length === MESSAGES_BATCH ? messages.at(-1)!.id : null

    return NextResponse.json({ items: messages, nextCursor })
  }, '/messages [GET]')
