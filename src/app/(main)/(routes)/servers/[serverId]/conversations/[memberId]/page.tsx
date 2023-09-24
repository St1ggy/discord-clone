'use client'

const MemberIdPage: NextPage<{ serverId: string; channelId: string }> = ({ params: { serverId, channelId } }) => (
  <div>
    Member page {serverId} channel {channelId}
  </div>
)

export default MemberIdPage
