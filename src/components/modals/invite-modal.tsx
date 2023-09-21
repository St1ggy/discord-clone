'use client'

import { CheckIcon, CopyIcon, UpdateIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { type FC } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ModalType, useBoolean, useCopy, useModalStore, useOrigin } from '@/hooks'
import { cn } from '@/lib/utils'

export const InviteModal: FC = () => {
  const {
    isOpen,
    onOpenModal,
    onCloseModal,
    modalType,
    data: { server },
  } = useModalStore()
  const [isLoading, setIsLoadingTrue, setIsLoadingFalse] = useBoolean()

  const isModalOpen = isOpen && modalType === ModalType.INVITE

  const origin = useOrigin()
  const inviteLink = `${origin}/invite/${server?.inviteCode}`
  const { isCopied, copy } = useCopy(inviteLink)

  const generateLink = async () => {
    try {
      setIsLoadingTrue()
      const { data: newServer } = await axios.patch(`/api/servers/${server?.id}/invite-code`)
      onOpenModal({ modalType: ModalType.INVITE, data: { server: newServer } })
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
          <DialogTitle className="text-2xl text-center font-bold">Invite Friends</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server invite link</Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 cursor-pointer"
              value={isCopied ? 'Copied!' : inviteLink}
              onClick={copy}
              onFocusCapture={(e) => e.target.blur()}
            />
            <Button disabled={isLoading} size="icon" onClick={copy}>
              {isCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            disabled={isLoading}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
            onClick={generateLink}
          >
            Generate a new link
            <UpdateIcon className={cn('w-4 h-4 ml-2', { 'animate-spin': isLoading })} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
