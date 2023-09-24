import { type Channel, type ChannelType } from '@prisma/client'
import { createEvent, createStore } from 'effector'
import { useStore } from 'effector-react'
import { useCallback } from 'react'

import { type ServerWithMembersWithProfilesWithChannels } from '@/types'

export enum ModalType {
  CREATE_SERVER = 'CREATE_SERVER',
  INVITE = 'INVITE',
  EDIT_SERVER = 'EDIT_SERVER',
  MEMBERS = 'MEMBERS',
  CREATE_CHANNEL = 'CREATE_CHANNEL',
  LEAVE_SERVER = 'LEAVE_SERVER',
  DELETE_SERVER = 'DELETE_SERVER',
  DELETE_CHANNEL = 'DELETE_CHANNEL',
  EDIT_CHANNEL = 'EDIT_CHANNEL',
}

interface PossibleModalData {
  server: ServerWithMembersWithProfilesWithChannels
  channel: Channel
  channelType: ChannelType
}

type ModalDataMapper = {
  [ModalType.CREATE_SERVER]: EmptyRecord
  [ModalType.INVITE]: Pick<PossibleModalData, 'server'>
  [ModalType.EDIT_SERVER]: Pick<PossibleModalData, 'server'>
  [ModalType.MEMBERS]: Pick<PossibleModalData, 'server'>
  [ModalType.CREATE_CHANNEL]: Pick<PossibleModalData, 'server'> & PickOptional<PossibleModalData, 'channelType'>
  [ModalType.LEAVE_SERVER]: Pick<PossibleModalData, 'server'>
  [ModalType.DELETE_SERVER]: Pick<PossibleModalData, 'server'>
  [ModalType.DELETE_CHANNEL]: Pick<PossibleModalData, 'server' | 'channel'>
  [ModalType.EDIT_CHANNEL]: Pick<PossibleModalData, 'server' | 'channel'>
}

type OnOpenModalData<T extends ModalType = ModalType> = {
  modalType: T
  modalData: ModalDataMapper[T]
}

type State<T extends ModalType = ModalType> = {
  isModalOpen: boolean
  modalType: T | null
  modalData: ModalDataMapper[T]
}

const store$ = createStore<State>({
  isModalOpen: false,
  modalType: null,
  modalData: {},
})

const events = {
  onOpenModal: createEvent<OnOpenModalData>(),
  onCloseModal: createEvent(),
}

store$ //
  .on(events.onOpenModal, (state, data) => ({
    ...state,
    ...data,
    isModalOpen: true,
  }))
  .reset(events.onCloseModal)

export const useModalStore = <T extends ModalType = ModalType>(currentModalType?: T) => {
  const { modalType, modalData, isModalOpen } = useStore(store$)

  const onCloseModal = useCallback(() => events.onCloseModal(), [])
  const onOpenModal = useCallback(
    <CT extends ModalType>(type: CT, data: ModalDataMapper[CT] | EmptyRecord = {}) =>
      events.onOpenModal({ modalType: type, modalData: data }),
    [],
  )

  return {
    // store
    modalType,
    isModalOpen: isModalOpen && modalType === currentModalType,
    modalData: modalData as ModalDataMapper[T],

    // actions
    onCloseModal,
    onOpenModal,
  }
}
