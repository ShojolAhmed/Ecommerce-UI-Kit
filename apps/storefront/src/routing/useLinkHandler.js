import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * One handler that turns the kit's link callbacks into client-side navigation.
 *
 * The kit renders real <a href> elements and reports clicks as `(item, event)`: Navbar and Footer `onNavigate`,
 * Breadcrumbs `onNavigate`, `onProductClick`, `onCategoryClick`, and the sections' `onAction`. Pass this handler
 * to any of them. Internal paths (starting with "/") navigate without a page load; external links, new-tab
 * clicks (ctrl, cmd, shift, alt, middle button) and anything without an `href` keep their native behaviour.
 *
 *   const handleLink = useLinkHandler()
 *   <Navbar onNavigate={handleLink} ... />
 */
export function useLinkHandler() {
  const navigate = useNavigate()

  return useCallback(
    (item, event) => {
      const href = item?.href
      if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return
      if (event) {
        if (event.defaultPrevented) return
        if (event.button !== undefined && event.button !== 0) return
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
      }
      navigate(href)
    },
    [navigate],
  )
}
