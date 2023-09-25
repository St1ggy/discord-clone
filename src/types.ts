import { type Prisma } from '@prisma/client'
import { type Server as NetServer, type Socket } from 'net'
import { type NextApiResponse } from 'next'
import { type Server as SocketIOServer } from 'socket.io'

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
  CHANNELS = 'CHANNELS',
  MEMBERS = 'MEMBERS',
}

export enum ChatCategory {
  CHANNELS = 'CHANNELS',
  CONVERSATIONS = 'CONVERSATIONS',
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}
