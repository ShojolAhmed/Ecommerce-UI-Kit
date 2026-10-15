import { useCallback, useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

/**
 * Scroll state for a horizontally scrolling, snap-aligned list.
 * Returns the ref for the list, whether it sits at either end, and a
 * `scrollByPage(direction)` where -1 / 1 follow reading order (also in RTL).
 */
export function useCarousel(itemCount) {
  const listRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  const [edges, setEdges] = useState({ atStart: true, atEnd: false })

  const measure = useCallback(() => {
    const list = listRef.current
    if (!list) return
    const offset = Math.abs(list.scrollLeft) // negative in RTL
    setEdges({
      atStart: offset <= 1,
      atEnd: offset + list.clientWidth >= list.scrollWidth - 1,
    })
  }, [])

  useEffect(() => {
    const list = listRef.current
    if (!list) return undefined
    measure()
    list.addEventListener('scroll', measure, { passive: true })
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => {
      list.removeEventListener('scroll', measure)
      observer.disconnect()
    }
  }, [measure, itemCount])

  const scrollByPage = useCallback(
    (direction) => {
      const list = listRef.current
      if (!list) return
      const rtl = getComputedStyle(list).direction === 'rtl'
      list.scrollBy({
        left: direction * (rtl ? -1 : 1) * list.clientWidth * 0.9,
        behavior: reducedMotion ? 'auto' : 'smooth',
      })
    },
    [reducedMotion],
  )

  return { listRef, ...edges, scrollByPage }
}
