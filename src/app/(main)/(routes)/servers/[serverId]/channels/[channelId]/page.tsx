'use client'

const ChannelIdPage: NextPage<{ serverId: string; channelId: string }> = ({ params: { serverId, channelId } }) => (
  <div>Channel page {channelId}</div>
)

export default ChannelIdPage
