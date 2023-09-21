import { useEffect } from 'react'

import { useBoolean } from './use-boolean'

export const useOrigin = () => {
  const [isMounted, setIsMountedTrue] = useBoolean()

  useEffect(() => {
    setIsMountedTrue()
  }, [setIsMountedTrue])

  const origin = window?.location.origin ? window.location.origin : ''

  return isMounted ? origin : ''
}
