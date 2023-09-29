'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { ModalType, useModalStore } from '@/hooks/use-modal-store'
import { FileUploadType } from '@/types'

import { FileUpload } from '../file-upload'

const formScheme = z.object({
  fileUrl: z.string().min(1, {
    message: 'Attachment is a required',
  }),
})

type FormType = z.infer<typeof formScheme>

export const MessageFileModal: FC = () => {
  const router = useRouter()
  const {
    isModalOpen,
    onCloseModal,
    modalData: { apiUrl, query },
  } = useModalStore(ModalType.MESSAGE_FILE)

  const form = useForm<FormType>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      fileUrl: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const handleClose = () => {
    onCloseModal()
    setTimeout(form.reset, 500)
  }

  const onSubmit = async (values: FormType) => {
    try {
      await axios.post(apiUrl, { ...values, content: values.fileUrl }, { params: query })

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
          <DialogTitle className="text-2xl text-center font-bold">Add an attachment</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">Send a file as a message</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint={FileUploadType.MESSAGE_FILE}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} isLoading={isLoading} variant="primary">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
