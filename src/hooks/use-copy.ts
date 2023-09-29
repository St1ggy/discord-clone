import { useCallback, useMemo } from 'react'

import { useBoolean } from './use-boolean'

export const useCopy = (value: string, timeout = 1000) => {
  const [isCopied, setCopiedTrue, setIsCopiedFalse] = useBoolean()

  const copy = useCallback(() => {
    if (isCopied) return

    setCopiedTrue()
    navigator.clipboard.writeText(value)
    setTimeout(setIsCopiedFalse, timeout)
  }, [isCopied, setCopiedTrue, setIsCopiedFalse, timeout, value])

  return useMemo(() => ({ isCopied, copy }), [copy, isCopied])
}
