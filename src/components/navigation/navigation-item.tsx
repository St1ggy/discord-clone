'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { type ComponentProps, type FC } from 'react'

import { ActionTooltip } from '@/components/action-tooltip'
import { cn } from '@/lib/utils'

interface NavigationItemProps {
  id: string
  imageUrl: string
  name: string
  className: ComponentProps<'div'>['className']
}

export const NavigationItem: FC<NavigationItemProps> = ({ id, className, name, imageUrl }) => {
  const params = useParams<{ serverId: string }>()
  const router = useRouter()

  const isActiveServer = params.serverId === id

  const onClick = () => router.push(`/servers/${id}`)

  return (
    <ActionTooltip label={name} side="right" align="center">
      <button onClick={onClick} className={cn('group relative flex items-center', className)}>
        <div
          className={cn('absolute left-0 bg-primary rounded-r-full transition-all w-[4px] h-[8px] ', {
            'group-hover:h-[20px]': !isActiveServer,
            'h-[36px]': isActiveServer,
          })}
        />
        <div
          className={cn(
            'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
            {
              'bg-primary/10 text-primary rounded-[16px]': isActiveServer,
            },
          )}
        >
          <Image fill src={imageUrl} alt="server image" />
        </div>
      </button>
    </ActionTooltip>
  )
}
