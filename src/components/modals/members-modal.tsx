'use client'

import { MemberRole } from '@prisma/client'
import axios from 'axios'
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldOff, ShieldQuestion } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FC, useState } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserAvatar } from '@/components/user-avatar'
import { ModalType, useModalStore } from '@/hooks'
import { cn } from '@/lib/utils'

const roleMaps = {
  icons: {
    [MemberRole.GUEST]: (className?: string) => <ShieldOff className={cn('w-4 h-4', className)} />,
    [MemberRole.MODERATOR]: (className?: string) => <Shield className={cn('w-4 h-4 text-indigo-500', className)} />,
    [MemberRole.ADMIN]: (className?: string) => <ShieldAlert className={cn('w-4 h-4 text-rose-500', className)} />,
  },
  labels: {
    [MemberRole.GUEST]: 'Guest',
    [MemberRole.MODERATOR]: 'Moderator',
    [MemberRole.ADMIN]: 'Admin',
  },
}

export const MembersModal: FC = () => {
  const {
    isOpen,
    onOpenModal,
    onCloseModal,
    modalType,
    data: { server },
  } = useModalStore()
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const isModalOpen = isOpen && modalType === ModalType.MEMBERS

  const changeRole = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingIds((state) => ({ ...state, [memberId]: true }))
      const { data: newServer } = await axios.patch(`/api/members/${memberId}`, {
        serverId: server?.id,
        role,
      })

      router.refresh()
      onOpenModal({ modalType: ModalType.MEMBERS, data: { server: newServer } })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingIds((state) => ({ ...state, [memberId]: false }))
    }
  }

  const kickMember = async (memberId: string) => {
    try {
      setLoadingIds((state) => ({ ...state, [memberId]: true }))
      const { data: newServer } = await axios.delete(`/api/members/${memberId}`, {
        data: { serverId: server?.id },
      })

      router.refresh()
      onOpenModal({ modalType: ModalType.MEMBERS, data: { server: newServer } })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingIds((state) => ({ ...state, [memberId]: false }))
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onCloseModal}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Manage Members</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">{server?.members?.length} Members</DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px]">
          {server?.members.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {roleMaps.icons[member.role]()}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server?.profileId !== member.profileId && !loadingIds[member.id] && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="w-4 h-4  flex items-center mr-2" />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {Object.values(MemberRole).map((role) => (
                              <DropdownMenuItem key={role} onClick={() => changeRole(member.id, role)}>
                                {roleMaps.icons[role]('mr-2 text-primary')}
                                {roleMaps.labels[role]}
                                {member.role === role && <Check className="h-4 w-4 ml-auto" />}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => kickMember(member.id)}>
                        <Gavel className="h-4 w-4 mr-2" />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingIds[member.id] && <Loader2 className="animate-spin text-zinc-500 ml-auto" />}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
