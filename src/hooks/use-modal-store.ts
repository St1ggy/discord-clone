import { createEvent, createStore } from 'effector'
import { useStore } from 'effector-react'

export enum ModalType {
  CREATE_SERVER,
  // EDIT_SERVER,
  // CREATE_CHANNEL,
}

interface ModalStore {
  modalType: ModalType | null
  isOpen: boolean
  onOpenModal: (type: ModalType) => void
  onCloseModal: () => void
}

const isOpen$ = createStore(false)
const modalType$ = createStore<ModalType | null>(null)

const onOpenModal = createEvent<ModalType | null>()
const onCloseModal = createEvent()

isOpen$ //
  .on(onOpenModal, () => true)
  .reset(onCloseModal)

modalType$ //
  .on(onOpenModal, (_, newValue) => newValue)
  .reset(onCloseModal)

export const useModalStore = (): ModalStore => {
  const isOpen = useStore(isOpen$)
  const modalType = useStore(modalType$)

  return { isOpen, modalType, onOpenModal, onCloseModal }
}
