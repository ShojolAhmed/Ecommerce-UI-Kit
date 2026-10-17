import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Tabs } from '../library/index.js'
import { buildUsage } from './engine/usage.js'
import { getFamily, getVariant, families } from './registry/index.js'
import { THEMES, VIEWS, galleryHash, useGalleryLocation } from './route.js'
import CodeBlock from './ui/CodeBlock.jsx'
import EventsPanel from './ui/EventsPanel.jsx'
import FamilyNav from './ui/FamilyNav.jsx'
import PreviewViewport from './ui/PreviewViewport.jsx'
import PropsPanel from './ui/PropsPanel.jsx'
import Segmented from './ui/Segmented.jsx'
import VariantSwitcher from './ui/VariantSwitcher.jsx'

const FRAME = 'ecom-gallery-frame'
const GALLERY = 'ecom-gallery'

const viewports = {
  desktop: { label: 'Desktop', width: 1280 },
  tablet: { label: 'Tablet', width: 768 },
  mobile: { label: 'Mobile', width: 390 },
}
const viewOptions = VIEWS.map((id) => ({ id, label: viewports[id].label, hint: viewports[id].width }))
const themeOptions = THEMES.map((id) => ({ id, label: id[0].toUpperCase() + id.slice(1) }))

const frameSrc = (config) =>
  `${window.location.pathname}${window.location.search}${galleryHash(config, 'gallery-frame')}`

const linkClass = 'underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

/** Developer-facing component gallery. Separate from the library: it only imports its public exports. */
export default function GalleryPage() {
  const { location, navigate } = useGalleryLocation()
  const family = getFamily(location.familyId)
  const variant = family && (getVariant(family, location.variantId) ?? family.variants[0])

  // No family in the URL (or an unknown one): land on the first component.
  useEffect(() => {
    if (!family && !location.familyId) navigate({ familyId: families[0].id }, { replace: true })
  }, [family, location.familyId, navigate])

  const iframeRef = useRef(null)
  const [nonce, setNonce] = useState(0)
  const [fit, setFit] = useState(true)
  const [navOpen, setNavOpen] = useState(false)
  const [eventsByVariant, setEventsByVariant] = useState({})

  // The iframe loads once, with the first config in its URL. Later changes are posted to it,
  // so switching variants never reloads the frame.
  const [initialSrc] = useState(() => {
    const first = getFamily(location.familyId) ?? families[0]
    return frameSrc({ familyId: first.id, variantId: getVariant(first, location.variantId)?.id ?? first.variants[0].id, theme: location.theme })
  })

  const config = useMemo(
    () => ({ source: GALLERY, type: 'config', familyId: family?.id, variantId: variant?.id, theme: location.theme, nonce }),
    [family?.id, variant?.id, location.theme, nonce],
  )
  const configRef = useRef(config)
  useEffect(() => {
    configRef.current = config
    if (config.familyId) iframeRef.current?.contentWindow?.postMessage(config, window.location.origin)
  }, [config])

  const eventId = useRef(0)
  useEffect(() => {
    const onMessage = (event) => {
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return
      const data = event.data
      if (data?.source !== FRAME) return
      if (data.type === 'ready') {
        if (configRef.current.familyId) event.source.postMessage(configRef.current, window.location.origin)
      } else if (data.type === 'event' || data.type === 'error') {
        const entry = data.type === 'error' ? { label: 'render error', detail: data.message, at: Date.now() } : data
        const key = `${data.familyId}/${data.variantId}`
        eventId.current += 1
        const withId = { ...entry, id: eventId.current }
        setEventsByVariant((current) => ({ ...current, [key]: [withId, ...(current[key] ?? [])].slice(0, 60) }))
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const eventKey = family ? `${family.id}/${variant.id}` : ''
  const events = eventsByVariant[eventKey] ?? []
  const clearEvents = useCallback(() => setEventsByVariant((current) => ({ ...current, [eventKey]: [] })), [eventKey])

  const usage = useMemo(() => (family ? buildUsage({ family, variant, props: variant.props }) : null), [family, variant])

  const width = viewports[location.view].width
  const height = family ? (family.frame[location.view] ?? family.frame.desktop) : 560
  const standaloneHref = family ? galleryHash({ familyId: family.id, variantId: variant.id, theme: location.theme }, 'gallery-frame') : '#'

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {
      /* clipboard unavailable: the address bar already holds the link */
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[96rem] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-bold">Ecom UI Kit <span className="font-normal text-foreground-muted">· Component gallery</span></h1>
            <p className="text-sm text-foreground-muted">Real components, shared sample data, desktop and mobile layouts.</p>
          </div>
          <nav aria-label="Other pages" className="flex gap-4 text-sm font-medium">
            <a href="#/" className={linkClass}>Preview page</a>
            <a href="#/home" className={linkClass}>Demo homepage</a>
          </nav>
        </div>
      </header>

      <div className="mx-auto grid max-w-[96rem] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto">
          <button
            type="button"
            aria-expanded={navOpen}
            aria-controls="gallery-nav"
            onClick={() => setNavOpen((open) => !open)}
            className="mb-3 w-full rounded-control border border-border bg-surface px-3 py-2 text-start text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
          >
            Components{family ? `: ${family.name}` : ''}
          </button>
          <div id="gallery-nav" className={navOpen ? 'block' : 'hidden lg:block'}>
            <FamilyNav location={location} />
          </div>
        </aside>

        <main className="min-w-0 space-y-6">
          {!family ? (
            <p role="alert" className="rounded-surface border border-border bg-surface p-4 text-sm">
              There is no component called “{location.familyId}”. Pick one from the list.
            </p>
          ) : (
            <>
              <section aria-labelledby="family-title" className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                  {family.category === 'chrome' ? 'Navigation & site chrome' : family.category}
                </p>
                <h2 id="family-title" className="text-2xl font-bold">{family.name}</h2>
                <p className="max-w-3xl text-foreground-muted">{family.summary}</p>
                <p className="font-mono text-xs text-foreground-muted">
                  <code>{family.source}</code> · {family.variants.length} {family.variants.length === 1 ? 'variant' : 'variants'}
                  {family.variantProp ? ` (prop: ${family.variantProp})` : ' (prop presets)'}
                </p>
              </section>

              <section aria-label="Variant" className="space-y-2">
                <VariantSwitcher
                  variants={family.variants}
                  value={variant.id}
                  onChange={(variantId) => navigate({ familyId: family.id, variantId })}
                />
                {variant.description && <p className="max-w-3xl text-sm text-foreground-muted">{variant.description}</p>}
              </section>

              <section aria-label="Preview" className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Segmented label="Viewport" options={viewOptions} value={location.view} onChange={(view) => navigate({ view }, { replace: true })} />
                  <Segmented label="Preview theme" options={themeOptions} value={location.theme} onChange={(theme) => navigate({ theme }, { replace: true })} />
                  <label className="flex items-center gap-1.5 text-xs text-foreground-muted">
                    <input type="checkbox" checked={fit} onChange={(event) => setFit(event.target.checked)} />
                    Fit to width
                  </label>
                  <div className="ms-auto flex gap-4 text-xs font-medium">
                    <button type="button" onClick={() => setNonce((value) => value + 1)} className={linkClass}>Reload preview</button>
                    <button type="button" onClick={copyLink} className={linkClass}>Copy link</button>
                    <a href={standaloneHref} target="_blank" rel="noreferrer" className={linkClass}>Open alone<span className="sr-only"> (new tab)</span></a>
                  </div>
                </div>
                <PreviewViewport
                  src={initialSrc}
                  iframeRef={iframeRef}
                  width={width}
                  height={height}
                  fit={fit}
                  title={`${family.name}, ${variant.label} variant, ${location.view} layout`}
                />
              </section>

              <Tabs
                label="Inspect"
                value={location.panel}
                onChange={(panel) => navigate({ panel }, { replace: true })}
                unmountInactive
                items={[
                  {
                    id: 'usage',
                    label: 'Usage',
                    content: (
                      <div className="space-y-2 pt-4">
                        <p className="text-sm text-foreground-muted">
                          Generated from the props this preview renders, with the same sample data (abbreviated).
                        </p>
                        <CodeBlock code={usage.code} label={`${family.name} ${variant.label} usage`} />
                      </div>
                    ),
                  },
                  { id: 'props', label: 'Props', content: <div className="pt-4"><PropsPanel family={family} /></div> },
                  { id: 'events', label: 'Events', badge: events.length || undefined, content: <div className="pt-4"><EventsPanel events={events} onClear={clearEvents} /></div> },
                ]}
              />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
