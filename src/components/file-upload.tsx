'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { type FC } from 'react'

import { type FileRouter } from '@/app/api/uploadthing/core'
import { UploadDropzone } from '@/lib/uploadthing'

interface FileUploadProps {
  onChange(url?: string): void
  value: string
  endpoint: keyof FileRouter
}

export const FileUpload: FC<FileUploadProps> = ({ onChange, value, endpoint }) => {
  if (value) {
    const fileType = value.split('.').pop()

    if (fileType !== 'pdf') {
      return (
        <div className="relative h-20 w-20">
          <Image fill src={value} alt="uploaded image" className="rounded-full" />
          <button
            onClick={() => onChange('')}
            className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )
    }
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(error) => {
        console.log(error)
      }}
      config={{
        mode: 'auto',
      }}
    />
  )
}
