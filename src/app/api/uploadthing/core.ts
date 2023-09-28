import { auth } from '@clerk/nextjs'
import { type FileRouter as FileRouterLib, createUploadthing } from 'uploadthing/next'

import { FileUploadType } from '@/types'

const f = createUploadthing()

const handleAuth = () => {
  const { userId } = auth()

  if (!userId) throw new Error('Unauthorized!')

  return { userId }
}

export const fileRouter = {
  [FileUploadType.SERVER_IMAGE]: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(() => {}),

  [FileUploadType.MESSAGE_FILE]: f(['image', 'pdf'])
    .middleware(handleAuth)
    .onUploadComplete(() => {}),
} satisfies FileRouterLib

export type FileRouter = typeof fileRouter
