import { type Profile } from '@prisma/client'
import { NextResponse } from 'next/server'

import { getCurrentProfile } from '@/lib/get-current-profile'

export const tryWithProfile = async <R = unknown>(
  cb: (profile: Profile) => Promise<R>,
  routeInfo: string,
  meta?: Record<string, unknown>,
) => {
  try {
    const profile = await getCurrentProfile()

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })

    return NextResponse.json(await cb(profile))
  } catch (error) {
    // eslint-disable-next-line no-console
    meta ? console.log(routeInfo, meta, error) : console.log(routeInfo, error)

    return new NextResponse('Internal Error', { status: 500 })
  }
}
