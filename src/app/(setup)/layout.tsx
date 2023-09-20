import { type FC, type PropsWithChildren } from 'react'

const SetupLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className="h-full flex justify-center items-center">{children}</div>
)

export default SetupLayout
