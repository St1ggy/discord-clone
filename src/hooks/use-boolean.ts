import { useCallback, useMemo, useState } from 'react'

export const useBoolean = (
  initialValue: boolean = false,
): [value: boolean, setTrue: VoidFunction, setFalse: VoidFunction] => {
  const [value, setValue] = useState(initialValue)

  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return useMemo(() => [value, setTrue, setFalse], [setFalse, setTrue, value])
}
