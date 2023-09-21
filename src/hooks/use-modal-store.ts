import { createEvent, createStore } from 'effector'
import { useStore } from 'effector-react'
import { useMemo } from 'react'

export enum ModalType {
  CREATE_SERVER,
  // EDIT_SERVER,
  // CREATE_CHANNEL,
}

interface State {
  modalType: ModalType | null
  isOpen: boolean
}

interface Events {
  onOpenModal: (modalType: ModalType | null) => void
  onCloseModal: () => void
}

interface ModalStore extends State, Events {}

const store$ = createStore<State>({
  isOpen: false,
  modalType: null,
})

const events = {
  onOpenModal: createEvent<ModalType | null>(),
  onCloseModal: createEvent(),
}

store$ //
  .on(events.onOpenModal, (state, modalType) => ({
    ...state,
    modalType,
    isOpen: true,
  }))
  .reset(events.onCloseModal)

export const useModalStore = (): ModalStore => {
  const store = useStore(store$)

  return useMemo(() => ({ ...store, ...events }), [store])
}
