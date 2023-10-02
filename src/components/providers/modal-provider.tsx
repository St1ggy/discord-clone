'use client'

import { type FC, useEffect } from 'react'

import {
  ChannelCreateModal,
  ChannelDeleteModal,
  ChannelEditModal,
  InviteModal,
  MembersModal,
  MessageDeleteModal,
  MessageFileModal,
  ServerCreateModal,
  ServerDeleteModal,
  ServerEditModal,
  ServerLeaveModal,
} from '@/components/modals'
import { useBoolean } from '@/hooks/use-boolean'

export const ModalProvider: FC = () => {
  const [isMounted, setIsMountedTrue] = useBoolean()

  useEffect(() => {
    setIsMountedTrue()
  }, [setIsMountedTrue])

  if (!isMounted) return null

  return (
    <>
      <ServerCreateModal />
      <ServerEditModal />
      <ServerLeaveModal />
      <ServerDeleteModal />

      <InviteModal />

      <MembersModal />

      <MessageFileModal />
      <MessageDeleteModal />

      <ChannelCreateModal />
      <ChannelDeleteModal />
      <ChannelEditModal />
    </>
  )
}
