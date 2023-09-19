import { auth } from '@clerk/nextjs'
import { type FileRouter as FileRouterLib, createUploadthing } from 'uploadthing/next'

const f = createUploadthing()

const handleAuth = () => {
  const { userId } = auth()

  if (!userId) throw new Error('Unauthorized!')

  return { userId }
}

export const fileRouter = {
  serverImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(() => {}),

  messageFile: f(['image', 'pdf'])
    .middleware(handleAuth)
    .onUploadComplete(() => {}),
} satisfies FileRouterLib

export type FileRouter = typeof fileRouter
