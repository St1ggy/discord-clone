import { type FC, type PropsWithChildren } from 'react'

declare global {
  type NextPage = FC
  type NextLayout<Params = void> = FC<PropsWithChildren<Params extends void ? void : { params: Params }>>
}
