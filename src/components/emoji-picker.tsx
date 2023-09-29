// 'use client'

import emojiData from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { type Emoji as EmojiType } from 'emoji-mart'
import { Smile } from 'lucide-react'
import { useTheme } from 'next-themes'
import { type FC } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface EmojiPickerProps {
  onChange: (value: string) => void
}

export const EmojiPicker: FC<EmojiPickerProps> = ({ onChange }) => {
  const { resolvedTheme } = useTheme()

  const handleChange = (emoji: typeof EmojiType.Props) => {
    console.log(emoji)
    onChange(emoji.native)
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        <Picker data={emojiData} onEmojiSelect={handleChange} theme={resolvedTheme} />
      </PopoverContent>
    </Popover>
  )
}
