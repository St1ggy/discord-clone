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
  MESSAGE_FILE = 'MESSAGE_FILE',
  DELETE_MESSAGE = 'DELETE_MESSAGE',
}

type RequiredFields<K extends keyof PossibleModalData> = Pick<PossibleModalData, K>
type OptionalFields<K extends keyof PossibleModalData | never> = PickOptional<PossibleModalData, K>
type DataFields<
  K extends keyof PossibleModalData,
  OK extends keyof PossibleModalData | never = never,
> = RequiredFields<K> & OptionalFields<OK>

interface PossibleModalData {
  server: ServerWithMembersWithProfilesWithChannels
  channel: Channel
  channelType: ChannelType
  apiUrl: string
  query: Record<string, unknown>
}

type TypedData = Exclude<ModalType, ModalType.CREATE_SERVER>

type ModalDataMapper = {
  [ModalType.CREATE_SERVER]: EmptyRecord
  [ModalType.INVITE]: DataFields<'server'>
  [ModalType.EDIT_SERVER]: DataFields<'server'>
  [ModalType.MEMBERS]: DataFields<'server'>
  [ModalType.CREATE_CHANNEL]: DataFields<'server', 'channelType'>
  [ModalType.LEAVE_SERVER]: DataFields<'server'>
  [ModalType.DELETE_SERVER]: DataFields<'server'>
  [ModalType.DELETE_CHANNEL]: DataFields<'server' | 'channel'>
  [ModalType.EDIT_CHANNEL]: DataFields<'server' | 'channel'>
  [ModalType.MESSAGE_FILE]: DataFields<'apiUrl' | 'query'>
  [ModalType.DELETE_MESSAGE]: DataFields<'apiUrl' | 'query'>
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
    <CT extends ModalType>(type: CT, data: CT extends TypedData ? ModalDataMapper[CT] : void) =>
      events.onOpenModal({ modalType: type, modalData: data || {} }),
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
