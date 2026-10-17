import { useCallback, useMemo, useReducer } from 'react'
import { collectInitialState, resolveProps } from './resolveProps.js'

/**
 * Holds the page-owned state of one preview (the gallery's stand-in for a store's own state)
 * and resolves the variant's props description into real props.
 * Mount it with `key={family.id + variant.id}` so state resets when the variant changes.
 */
export function useStage(propsDescription, log) {
  const [values, dispatch] = useReducer(
    (current, action) => ({
      ...current,
      [action.name]: action.compute ? action.compute(current[action.name]) : action.value,
    }),
    propsDescription,
    collectInitialState,
  )

  const set = useCallback((name, value) => dispatch({ name, value }), [])
  const update = useCallback((name, compute) => dispatch({ name, compute }), [])
  const store = useMemo(() => ({ values, set, update }), [values, set, update])

  const props = useMemo(() => resolveProps(propsDescription, store, log), [propsDescription, store, log])
  return { props, store }
}
