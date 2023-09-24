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
import { ModalType, useBoolean, useModalStore } from '@/hooks'

export const LeaveServerModal: FC = () => {
  const router = useRouter()
  const {
    isModalOpen,
    onCloseModal,
    modalData: { server },
  } = useModalStore(ModalType.LEAVE_SERVER)
  const [isLoading, setIsLoadingTrue, setIsLoadingFalse] = useBoolean()

  const confirm = async () => {
    try {
      setIsLoadingTrue()
      await axios.patch(`/api/servers/${server?.id}/leave`)

      onCloseModal()
      router.refresh()
      router.push('/')
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
          <DialogTitle className="text-2xl text-center font-bold">Leave Server</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave <span className="font-semibold text-indigo-500">{server?.name}</span>?
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
