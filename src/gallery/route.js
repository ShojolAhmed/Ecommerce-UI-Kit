import { useCallback, useSyncExternalStore } from 'react'

/**
 * Hash routes of the gallery (the preview app has no router):
 *   #/gallery                           first component
 *   #/gallery/<family>                  a component family (its first variant)
 *   #/gallery/<family>/<variant>        one variant
 *   ?view=desktop|tablet|mobile  &theme=system|light|dark  &panel=usage|props|events
 *   #/gallery-frame/<family>/<variant>  the bare preview that is loaded inside the iframe
 */
export const VIEWS = ['desktop', 'tablet', 'mobile']
export const THEMES = ['system', 'light', 'dark']
export const PANELS = ['usage', 'props', 'events']

const DEFAULTS = { view: 'desktop', theme: 'system', panel: 'usage' }

export function parseHash(hash) {
  const [path, query = ''] = hash.replace(/^#/, '').split('?')
  const [root, familyId, variantId] = path.split('/').filter(Boolean).map(decodeURIComponent)
  const params = new URLSearchParams(query)
  const pick = (name, allowed) => (allowed.includes(params.get(name)) ? params.get(name) : DEFAULTS[name])
  return {
    root,
    familyId,
    variantId,
    view: pick('view', VIEWS),
    theme: pick('theme', THEMES),
    panel: pick('panel', PANELS),
  }
}

export const isGalleryHash = (hash) => parseHash(hash).root === 'gallery'
export const isFrameHash = (hash) => parseHash(hash).root === 'gallery-frame'

export function galleryHash({ familyId, variantId, view, theme, panel }, root = 'gallery') {
  const path = ['', root, familyId, variantId].filter((part, index) => index === 0 || part).map((part, index) => (index === 0 ? part : encodeURIComponent(part))).join('/')
  const params = new URLSearchParams()
  if (view && view !== DEFAULTS.view) params.set('view', view)
  if (theme && theme !== DEFAULTS.theme) params.set('theme', theme)
  if (panel && panel !== DEFAULTS.panel) params.set('panel', panel)
  const query = params.toString()
  return `#${path}${query ? `?${query}` : ''}`
}

const EVENT = 'gallery:navigate'
const subscribe = (callback) => {
  window.addEventListener('hashchange', callback)
  window.addEventListener(EVENT, callback)
  return () => {
    window.removeEventListener('hashchange', callback)
    window.removeEventListener(EVENT, callback)
  }
}
const getSnapshot = () => window.location.hash

/** The current gallery location, plus `navigate(patch, { replace })` to change part of it. */
export function useGalleryLocation() {
  const hash = useSyncExternalStore(subscribe, getSnapshot)
  const location = parseHash(hash)

  const navigate = useCallback((patch, { replace = false } = {}) => {
    const next = galleryHash({ ...parseHash(window.location.hash), ...patch })
    if (next === window.location.hash) return
    if (replace) {
      window.history.replaceState(null, '', next)
      window.dispatchEvent(new Event(EVENT))
    } else {
      window.location.hash = next
    }
  }, [])

  return { location, navigate }
}
