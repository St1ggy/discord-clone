import { type Prisma } from '@prisma/client'

export interface ServerWithMembersWithProfilesWithChannels
  extends Prisma.ServerGetPayload<{
    include: {
      channels: true
      members: {
        include: {
          profile: true
        }
      }
    }
  }> {}
