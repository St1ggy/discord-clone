'use client'

import { useParams } from 'next/navigation'
import { type FC } from 'react'

const ServerIdPage: FC = () => {
  const params = useParams<{ serverId: string }>()

  return <div>Server page {params.serverId}</div>
}

export default ServerIdPage
