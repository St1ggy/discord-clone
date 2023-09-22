'use client'

import { type FC, useEffect } from 'react'

import { CreateServerModal, EditServerModal, InviteModal } from '@/components/modals'
import { useBoolean } from '@/hooks'

export const ModalProvider: FC = () => {
  const [isMounted, setIsMountedTrue] = useBoolean()

  useEffect(() => {
    setIsMountedTrue()
  }, [setIsMountedTrue])

  if (!isMounted) return null

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
    </>
  )
}
