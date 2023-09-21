import { currentUser, redirectToSignIn } from '@clerk/nextjs'
import { type Profile } from '@prisma/client'

import { db } from './db'

export const profileInit = async () => {
  const user = await currentUser()

  if (!user) {
    redirectToSignIn()

    return null
  }

  const profile: Profile | null = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (profile) return profile

  const newProfile: Profile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  })

  return newProfile
}
