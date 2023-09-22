import { type Server } from '@prisma/client'
import { createEvent, createStore } from 'effector'
import { useStore } from 'effector-react'
import { useMemo } from 'react'

export enum ModalType {
  CREATE_SERVER,
  INVITE,
  EDIT_SERVER,
  // CREATE_CHANNEL,
}

interface ModalData {
  server?: Server
}

interface State {
  modalType: ModalType | null
  isOpen: boolean
  data: ModalData
}

type OnOpenModalData = {
  modalType: State['modalType']
  data?: ModalData
}

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
