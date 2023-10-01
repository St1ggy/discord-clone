'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { type FC } from 'react'
import { useForm } from 'react-hook-form'
import { useKey } from 'react-use'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface ChatContentEditingProps {
  id: string
  content: string
  onCloseEditing: VoidFunction
  socketUrl: string
  socketQuery: Record<string, string>
}

const formSchema = z.object({
  content: z.string().min(1),
})

type FormType = z.infer<typeof formSchema>

export const ChatContentEditing: FC<ChatContentEditingProps> = ({
  id,
  content,
  onCloseEditing,
  socketUrl,
  socketQuery,
}) => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: { content },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: FormType) => {
    try {
      await axios.patch(`${socketUrl}/${id}`, values, { params: socketQuery })

      form.reset()
      onCloseEditing()
    } catch (error) {
      console.log(error)
    }
  }

  useKey((e) => e.key.toLowerCase() === 'escape', onCloseEditing)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center w-full gap-x-2 pt-2">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative w-full">
                  <Input
                    disabled={isLoading}
                    {...field}
                    className="pt-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder="Edited message"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button disabled={isLoading} isLoading={isLoading} size="sm" variant="primary">
          Save
        </Button>
      </form>
      <span className="text-[10px] mt-1 text-zinc-400">Press Esc to cancel, Enter to save</span>
    </Form>
  )
}
