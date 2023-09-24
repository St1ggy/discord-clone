'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChannelType } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { type FC, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ModalType, useModalStore } from '@/hooks'

const createFormScheme = (restrictedChannelNames = ['general']) =>
  z.object({
    name: z
      .string()
      .min(1, {
        message: 'Channel name is a required',
      })
      .refine(
        (name) => !restrictedChannelNames.includes(name),
        (name) => ({
          message: `Channel name cannot be "${name}"`,
        }),
      ),
    channelType: z.nativeEnum(ChannelType),
  })

export const ChannelEditModal: FC = () => {
  const router = useRouter()
  const {
    isModalOpen,
    onCloseModal,
    modalData: { server, channel },
  } = useModalStore(ModalType.EDIT_CHANNEL)

  const formScheme = useMemo(
    () =>
      createFormScheme(
        server?.channels?.reduce<string[]>((acc, { name }) => {
          if (name !== channel?.name) {
            acc.push(name)
          }

          return acc
        }, []),
      ) ?? [],
    [channel?.name, server?.channels],
  )

  type FormType = z.infer<typeof formScheme>
  const form = useForm<FormType>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      name: '',
      channelType: ChannelType.TEXT,
    },
  })

  useEffect(() => {
    if (channel?.type) {
      form.setValue('channelType', channel.type)
      form.setValue('name', channel.name)
    }
  }, [channel, form])

  const isLoading = form.formState.isSubmitting

  const handleClose = () => {
    onCloseModal()
    setTimeout(form.reset, 500)
  }

  const onSubmit = async (values: FormType) => {
    try {
      await axios.patch(`/api/channels/${channel?.id}`, { ...values, serverId: server?.id })

      router.refresh()
      handleClose()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Edit Channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Channel Name"
                        {...field}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/[\s|-]+/g, '-') ?? ''
                          field.onChange(e)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="channelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Channel Type
                    </FormLabel>
                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((channelType) => (
                          <SelectItem key={channelType} value={channelType} className="capitalize">
                            {channelType.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} isLoading={isLoading} variant="primary">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
