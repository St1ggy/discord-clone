'use client'

import { type FC, type PropsWithChildren } from 'react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ActionTooltipProps extends PropsWithChildren {
  label: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
}

export const ActionTooltip: FC<ActionTooltipProps> = ({ label, align, side, children }) => (
  <TooltipProvider>
    <Tooltip delayDuration={50}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align}>
        <p className="font-semibold text-sm capitalize">{label.toLowerCase()}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)
