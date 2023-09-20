'use client'

import { type FC, useEffect, useState } from 'react'

import { CreateServerModal } from '@/components/modals'

export const ModalProvider: FC = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <CreateServerModal />
    </>
  )
}
