import { useCallback, useState } from 'react'

/**
 * State that can be controlled (`value` + `onChange`) or uncontrolled
 * (`defaultValue`). Used for purely visual state such as a collapsed sidebar,
 * so the page may own it, but does not have to.
 */
export function useControllableState({ value, defaultValue, onChange }) {
  const isControlled = value !== undefined
  const [inner, setInner] = useState(defaultValue)

  const set = useCallback(
    (next) => {
      if (!isControlled) setInner(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  return [isControlled ? value : inner, set]
}
