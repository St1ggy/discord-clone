import { type ChannelType } from '@prisma/client'
import { createEvent, createStore } from 'effector'
import { useStore } from 'effector-react'
import { useMemo } from 'react'

import { type ServerWithMembersWithProfilesWithChannels } from '@/types'

export enum ModalType {
  CREATE_SERVER,
  INVITE,
  EDIT_SERVER,
  MEMBERS,
  CREATE_CHANNEL,
  LEAVE_SERVER,
  DELETE_SERVER,
}

interface ModalData {
  server?: ServerWithMembersWithProfilesWithChannels
  channelType?: ChannelType
}

interface State {
  modalType: ModalType | null
  isOpen: boolean
  data: ModalData
}

type ModalsWithoutData = Extract<ModalType, ModalType.CREATE_SERVER>
type ServerModalData =
  | {
      modalType: Exclude<ModalType, ModalsWithoutData>
      data: ModalData
    }
  | {
      modalType: Extract<ModalType, ModalsWithoutData>
    }

type OnOpenModalData = ServerModalData

interface Events {
  onOpenModal: (data: OnOpenModalData) => void
  onCloseModal: () => void
}

interface ModalStore extends State, Events {}

const store$ = createStore<State>({
  isOpen: false,
  modalType: null,
  data: {},
})

const events = {
  onOpenModal: createEvent<OnOpenModalData>(),
  onCloseModal: createEvent(),
}

store$ //
  .on(events.onOpenModal, (state, data) => ({
    ...state,
    ...data,
    isOpen: true,
  }))
  .reset(events.onCloseModal)

export const useModalStore = (): ModalStore => {
  const store = useStore(store$)

  return useMemo(() => ({ ...store, ...events }), [store])
}
