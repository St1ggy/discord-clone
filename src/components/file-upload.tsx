'use client'

import { File, X } from 'lucide-react'
import Image from 'next/image'
import { type FC } from 'react'

import { UploadDropzone } from '@/lib/uploadthing'
import { type FileUploadType } from '@/types'

interface FileUploadProps {
  onChange(url?: string): void
  value: string
  endpoint: FileUploadType
}

interface ImageFileProps extends Pick<FileUploadProps, 'value' | 'onChange'> {}

const ImageFile: FC<ImageFileProps> = ({ value, onChange }) => (
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

interface PdfFileProps extends Pick<FileUploadProps, 'value' | 'onChange'> {}

const PdfFile: FC<PdfFileProps> = ({ value, onChange }) => (
  <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
    <File className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
    <a
      href={value}
      target="_blank"
      rel="noopener norferrer"
      className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
    >
      {value}
    </a>
    <button
      onClick={() => onChange('')}
      className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
      type="button"
    >
      <X className="h-4 w-4" />
    </button>
  </div>
)

export const FileUpload: FC<FileUploadProps> = ({ onChange, value, endpoint }) => {
  if (value) {
    const fileType = value.split('.').pop()
    const FileComponent = fileType === 'pdf' ? PdfFile : ImageFile

    return <FileComponent onChange={onChange} value={value} />
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={console.log}
      config={{
        mode: 'auto',
      }}
    />
  )
}
