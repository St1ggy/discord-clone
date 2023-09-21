'use client'

const ServerIdPage: NextPage<{ serverId: string }> = ({ params: { serverId } }) => <div>Server page {serverId}</div>

export default ServerIdPage
