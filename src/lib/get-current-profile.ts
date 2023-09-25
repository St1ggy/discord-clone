import { auth } from '@clerk/nextjs'
import { getAuth } from '@clerk/nextjs/server'
import { type NextApiRequest } from 'next'

import { db } from '@/lib/db'

export const getCurrentProfile = async (req?: NextApiRequest) => {
  const { userId } = req ? getAuth(req) : auth()

  if (!userId) return null

  return db.profile.findUnique({
    where: { userId },
  })
}
