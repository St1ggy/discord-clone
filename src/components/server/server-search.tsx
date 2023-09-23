'use client'

import { Search } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { type FC, type ReactNode } from 'react'
import { useKey } from 'react-use'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useBoolean } from '@/hooks'
import { SearchItemType } from '@/types'

export interface SearchItemData {
  id: string
  icon: ReactNode
  name: string
}

export interface SearchItem {
  label: string
  itemType: SearchItemType
  data: SearchItemData[]
}

interface ServerSearchProps {
  data: SearchItem[] | undefined
}

export const ServerSearch: FC<ServerSearchProps> = ({ data }) => {
  const [isCommandOpen, setIsCommandOpenTrue, setIsCommandOpenFalse, setIsCommandOpen] = useBoolean()
  const params = useParams<{ serverId: string }>()
  const router = useRouter()

  useKey(
    (e) => e.metaKey && e.key === 'k',
    () => setIsCommandOpen((old) => !old),
  )

  const onSelect = ({ id, itemType }: Pick<SearchItemData, 'id'> & Pick<SearchItem, 'itemType'>) => {
    setIsCommandOpenFalse()

    switch (itemType) {
      case SearchItemType.CHANNEL:
        return router.push(`/servers/${params.serverId}/channels/${id}`)
      case SearchItemType.MEMBER:
        return router.push(`/servers/${params.serverId}/conversations/${id}`)
    }
  }

  return (
    <>
      <button
        onClick={setIsCommandOpenTrue}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Search all channels or members" />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {data?.map(({ data: groupData, label, itemType }) => {
            if (!groupData.length) return null

            return (
              <CommandGroup key={label} heading={label}>
                {groupData.map(({ id, icon, name }) => (
                  <CommandItem key={id} onSelect={() => onSelect({ itemType, id })}>
                    {icon}
                    <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}
