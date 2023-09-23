import { type Prisma } from '@prisma/client'

export interface MemberWithProfile
  extends Prisma.MemberGetPayload<{
    include: {
      profile: true
    }
  }> {}

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

export enum ListItemCategory {
  CHANNELS,
  MEMBERS,
}
