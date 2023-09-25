import { db } from '@/lib/db'

const findConversation = ({ member1Id, member2Id }: { member1Id: string; member2Id: string }) => {
  try {
    return db.conversation.findFirst({
      where: { AND: [{ member1Id }, { member2Id }] },
      include: {
        member1: { include: { profile: true } },
        member2: { include: { profile: true } },
      },
    })
  } catch {
    return null
  }
}

const createConversation = ({ member1Id, member2Id }: { member1Id: string; member2Id: string }) => {
  try {
    return db.conversation.create({
      data: { member1Id, member2Id },
      include: {
        member1: { include: { profile: true } },
        member2: { include: { profile: true } },
      },
    })
  } catch {
    return null
  }
}

export const getOrCreateConversation = async ({ member1Id, member2Id }: { member1Id: string; member2Id: string }) => {
  const existsConversation =
    (await findConversation({ member1Id, member2Id })) ||
    (await findConversation({ member1Id: member2Id, member2Id: member1Id }))

  if (existsConversation) return existsConversation

  return createConversation({ member1Id, member2Id })
}
