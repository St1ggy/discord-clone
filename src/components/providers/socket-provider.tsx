'use client'

import { type FC, type PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { type Socket, io } from 'socket.io-client'

import { useBoolean } from '@/hooks'

interface SocketContextType {
  socket: any | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnectedTrue, setIsConnectedFalse] = useBoolean()

  useEffect(() => {
    const instance = io(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: '/api/socket/io',
      addTrailingSlash: false,
    })

    instance.on('connect', setIsConnectedTrue)
    instance.on('disconnect', setIsConnectedFalse)

    setSocket(instance)

    return () => {
      instance.disconnect()
    }
  }, [setIsConnectedFalse, setIsConnectedTrue])

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
}
