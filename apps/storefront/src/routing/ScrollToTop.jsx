import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/** On a new page (not when only the query string changes): scroll to the top and move focus to <main>. */
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false // do not steal focus on the initial page load
      return
    }
    window.scrollTo(0, 0)
    // Without this, keyboard and screen-reader users stay on the link they just activated.
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname])

  return null
}
