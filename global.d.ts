import { type FC, type PropsWithChildren } from 'react'

declare global {
  type NextPage<Params = void> = FC<Params extends void ? void : { params: Params }>
  type NextLayout<Params = void> = FC<PropsWithChildren<Params extends void ? void : { params: Params }>>

  type EmptyRecord = Record<string, never>

  type PickOptional<O, Keys extends keyof O> = Partial<Pick<O, Keys>>
}
