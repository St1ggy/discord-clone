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

export enum ListItemType {
  CHANNEL = 'CHANNEL',
  MEMBER = 'MEMBER',
}

export enum ChatType {
  CHANNEL = 'CHANNEL',
  CONVERSATION = 'CONVERSATION',
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export enum FileUploadType {
  SERVER_IMAGE = 'serverImage',
  MESSAGE_FILE = 'messageFile',
}
