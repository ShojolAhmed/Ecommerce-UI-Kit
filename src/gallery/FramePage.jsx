import { useCallback, useEffect, useState } from 'react'
import { cn } from '../library/utils/cn.js'
import { useStage } from './engine/useStage.js'
import { getFamily, getVariant } from './registry/index.js'
import { FakePage } from './registry/stages.jsx'
import { parseHash } from './route.js'
import ErrorBoundary from './ui/ErrorBoundary.jsx'

/**
 * The bare page that runs inside the gallery's iframe (`#/gallery-frame/<family>/<variant>`).
 * It is the same app, so the real components get the real stylesheet and the real media queries:
 * a 390px-wide iframe shows the actual mobile layout, not a scaled screenshot.
 * The gallery sends `{ familyId, variantId, theme, nonce }` by postMessage, so changing variant
 * never reloads the frame; opened on its own in a tab it reads the same values from the hash.
 */
const FRAME = 'ecom-gallery-frame'
const GALLERY = 'ecom-gallery'

const readConfig = () => {
  const { familyId, variantId, theme } = parseHash(window.location.hash)
  return { familyId, variantId, theme, nonce: 0 }
}

function Preview({ family, variant, log }) {
  const { props, store } = useStage(variant.props, log)
  const { Stage, component: Component, frame } = family
  const stageProps = family.variantProp ? { ...props, [family.variantProp]: variant.id } : props

  return (
    <div className={cn(frame.padded && 'p-4 sm:p-6')}>
      <div className={cn(frame.padded && frame.stageClassName)}>
        <Stage Component={Component} variant={variant} props={stageProps} store={store} description={variant.props} log={log} />
      </div>
      {frame.filler && <FakePage />}
    </div>
  )
}

export default function FramePage() {
  const [config, setConfig] = useState(readConfig)
  const family = getFamily(config.familyId)
  const variant = family && (getVariant(family, config.variantId) ?? family.variants[0])
  const embedded = window.parent !== window

  useEffect(() => {
    const root = document.documentElement
    if (config.theme === 'light' || config.theme === 'dark') root.setAttribute('data-theme', config.theme)
    else root.removeAttribute('data-theme')
  }, [config.theme])

  // Opened on its own (not inside the gallery's iframe): follow the address bar, so editing the
  // #/gallery-frame/<family>/<variant> fragment in the same tab shows that component.
  useEffect(() => {
    if (embedded) return undefined
    const onHashChange = () => setConfig(readConfig())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [embedded])

  useEffect(() => {
    if (!embedded) return undefined
    const onMessage = (event) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (event.data?.source !== GALLERY || event.data.type !== 'config') return
      const { familyId, variantId, theme, nonce } = event.data
      setConfig({ familyId, variantId, theme, nonce })
    }
    window.addEventListener('message', onMessage)
    window.parent.postMessage({ source: FRAME, type: 'ready' }, window.location.origin)
    return () => window.removeEventListener('message', onMessage)
  }, [embedded])

  const send = useCallback(
    (message) => {
      if (embedded) window.parent.postMessage({ source: FRAME, familyId: family?.id, variantId: variant?.id, ...message }, window.location.origin)
    },
    [embedded, family?.id, variant?.id],
  )
  const log = useCallback((label, detail = '') => send({ type: 'event', label, detail, at: Date.now() }), [send])

  // The sample links point at #anchors: keep them from moving the frame, and report them instead.
  const handleClickCapture = (event) => {
    const anchor = event.target.closest?.('a[href]')
    if (!anchor) return
    const href = anchor.getAttribute('href')
    if (href.startsWith('#') || href.startsWith('http')) {
      event.preventDefault()
      log('link', anchor.getAttribute('aria-label') || anchor.textContent.trim())
    }
  }

  if (!family) {
    return <p role="alert" className="p-6 text-sm">Unknown component: {config.familyId ?? '(none)'}</p>
  }

  return (
    <div
      onClickCapture={handleClickCapture}
      data-gallery-family={family.id}
      data-gallery-variant={variant.id}
      className="min-h-screen bg-background text-foreground"
    >
      <ErrorBoundary key={`${family.id}/${variant.id}/${config.nonce}`} onError={(error) => send({ type: 'error', message: error.message })}>
        <Preview key={`${family.id}/${variant.id}/${config.nonce}`} family={family} variant={variant} log={log} />
      </ErrorBoundary>
    </div>
  )
}
