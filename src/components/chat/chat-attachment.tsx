'use client'

import { File } from 'lucide-react'
import Image from 'next/image'
import { type FC } from 'react'

interface AttachmentProps {
  fileUrl: string | null
  content: string
}

const renderImage = (fileUrl: string, content: string) => (
  <a
    href={fileUrl}
    target="_blank"
    rel="noopener norferrer"
    className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
  >
    <Image src={fileUrl} fill alt={content} className="object-cover" />
  </a>
)

const renderPdf = (fileUrl: string) => (
  <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
    <File className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener norferrer"
      className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
    >
      PDF File
    </a>
  </div>
)

export const ChatAttachment: FC<AttachmentProps> = ({ fileUrl, content }) => {
  const fileType = fileUrl?.split('.').pop()
  const isPdf = fileUrl && fileType === 'pdf'
  const isImage = fileUrl && !isPdf

  if (isImage) {
    return renderImage(fileUrl, content)
  }

  if (isPdf) {
    return renderPdf(fileUrl)
  }

  return null
}
