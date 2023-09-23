'use client'

import { type FC, useEffect } from 'react'

import { CreateChannelModal, CreateServerModal, EditServerModal, InviteModal, MembersModal } from '@/components/modals'
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
      <MembersModal />
      <CreateChannelModal />
    </>
  )
}
