'use client'

import { PlusIcon } from '@radix-ui/react-icons'
import { type FC } from 'react'

import { ActionTooltip } from '@/components/action-tooltip'
import { ModalType, useModalStore } from '@/hooks'

export const NavigationAction: FC = () => {
  const { onOpenModal } = useModalStore()

  const handleClick = () => {
    onOpenModal({ modalType: ModalType.CREATE_SERVER })
  }

  return (
    <div>
      <ActionTooltip label="Add a server" side="right" align="center">
        <button onClick={handleClick} className="group flex items-center">
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <PlusIcon className="group-hover:text-white transition-all text-emerald-500 w-[24px] h-[24px]" />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}
