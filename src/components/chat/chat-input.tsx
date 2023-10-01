'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FC, useMemo } from 'react'
import { type ControllerRenderProps, useForm } from 'react-hook-form'
import * as z from 'zod'

import { EmojiPicker } from '@/components/emoji-picker'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ModalType, useModalStore } from '@/hooks/use-modal-store'
import { ChatType } from '@/types'

interface ChatInputProps {
  apiUrl: string
  query: Record<string, unknown>
  name: string
  chatType: ChatType
}

const formSchema = z.object({
  content: z.string().min(1),
})

type FormType = z.infer<typeof formSchema>

export const ChatInput: FC<ChatInputProps> = ({ apiUrl, chatType, query, name }) => {
  const { onOpenModal } = useModalStore()
  const router = useRouter()
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: FormType) => {
    try {
      await axios.post(apiUrl, values, { params: query })

      form.reset()
      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }

  const placeholder = useMemo(() => {
    let res = 'Message '
    if (chatType === ChatType.CHANNEL) res += '#'
    res += name

    return res
  }, [chatType, name])

  const onEmojiChange = (field: ControllerRenderProps<Pick<FormType, 'content'>, 'content'>) => (emoji: string) =>
    field.onChange(`${field.value}${emoji}`)

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
                    onClick={() => onOpenModal(ModalType.MESSAGE_FILE, { apiUrl, query })}
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
                    {isLoading ? (
                      <Loader2 className="text-zinc-500 dark:text-zinc-400 animate-spin" />
                    ) : (
                      <EmojiPicker onChange={onEmojiChange(field)} />
                    )}
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
