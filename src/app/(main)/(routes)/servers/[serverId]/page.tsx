'use client'

import { useParams } from 'next/navigation'

const ServerIdPage: NextPage = () => {
  const params = useParams<{ serverId: string }>()

  return <div>Server page {params.serverId}</div>
}

export default ServerIdPage
