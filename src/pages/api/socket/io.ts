import { type Server as NetServer } from 'http'
import { type NextApiRequest } from 'next'
import { Server as SocketIOServer } from 'socket.io'

import { type NextApiResponseServerIo } from '@/types'

export const config = {
  api: {
    bodyparser: false,
  },
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io'
    const httpServer: NetServer = res.socket.server as any
    res.socket.server.io = new SocketIOServer(httpServer, {
      path,
      // eslint-disable-line @typescript-eslint/ban-ts-comment
      // @ts-ignore no correct type for config field
      addTrailingSlash: false,
    })
  }
}

export default ioHandler
