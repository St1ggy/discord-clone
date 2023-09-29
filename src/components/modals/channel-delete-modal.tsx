'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useBoolean } from '@/hooks/use-boolean'
import { ModalType, useModalStore } from '@/hooks/use-modal-store'

export const ChannelDeleteModal: FC = () => {
  const router = useRouter()
  const {
    isModalOpen,
    onCloseModal,
    modalData: { server, channel },
  } = useModalStore(ModalType.DELETE_CHANNEL)
  const [isLoading, setIsLoadingTrue, setIsLoadingFalse] = useBoolean()

  const confirm = async () => {
    try {
      setIsLoadingTrue()
      await axios.delete(`/api/channels/${channel?.id}`, { data: { serverId: server.id } })

      onCloseModal()
      router.refresh()
      router.push(`/servers/${server.id}`)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingFalse()
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Delete Channel</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            <span className="font-semibold text-indigo-500">#{channel?.name}</span> will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onCloseModal} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              isLoading={isLoading}
              onClick={confirm}
              variant="primary"
              className="text-center"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
