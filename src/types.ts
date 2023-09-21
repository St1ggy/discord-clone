import { type Channel, type Member, type Profile, type Server } from '@prisma/client'

export interface ProfileRecord {
  profile: Profile
}

export interface MemberWithProfile extends Member, ProfileRecord {}

export interface MembersWithProfiles {
  members: MemberWithProfile[]
}

export interface Channels {
  channels: Channel[]
}

export interface ServerWithMembersWithProfilesWithChannels extends Server, MembersWithProfiles, Channels {}
