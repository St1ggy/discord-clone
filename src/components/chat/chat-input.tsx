'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Plus, Smile } from 'lucide-react'
import { type FC, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ChatType } from '@/types'

interface ChatInputProps {
  apiUrl: string
  query: Record<string, unknown>
  name: string
  chatType: ChatType
}

const formScheme = z.object({
  content: z.string().min(1),
})

type FormType = z.infer<typeof formScheme>

export const ChatInput: FC<ChatInputProps> = ({ apiUrl, chatType, query, name }) => {
  const form = useForm<FormType>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      content: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: FormType) => {
    try {
      await axios.post(apiUrl, values, { params: query })
    } catch (error) {
      console.log(error)
    }
  }

  const placeholder = useMemo(() => {
    let res = 'Message '
    if (chatType === ChatType.CHANNEL) res += '#'
    res += name

    return res
  }, [chatType])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="absolute top-7 left-8 w-[24px] h-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={placeholder}
                    {...field}
                  />
                  <div className="absolute top-7 right-8">
                    <Smile />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
