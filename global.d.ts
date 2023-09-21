import { type FC, type PropsWithChildren } from 'react'

declare global {
  type NextPage<Params = void> = FC<Params extends void ? void : { params: Params }>
  type NextLayout<Params = void> = FC<PropsWithChildren<Params extends void ? void : { params: Params }>>
}
