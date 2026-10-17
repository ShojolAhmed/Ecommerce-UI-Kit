import { useLayoutEffect, useRef, useState } from 'react'
import { cn } from '../../library/utils/cn.js'

/**
 * The preview itself: an iframe of the app (see FramePage) at a fixed logical width, so the
 * components' own breakpoints decide the layout. When the pane is narrower than the width,
 * the iframe is scaled down to fit (the iframe still lays out at its real width).
 */
export default function PreviewViewport({ src, iframeRef, width, height, title, fit }) {
  const paneRef = useRef(null)
  const [available, setAvailable] = useState(0)

  useLayoutEffect(() => {
    const pane = paneRef.current
    const measure = () => setAvailable(pane.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(pane)
    return () => observer.disconnect()
  }, [])

  const scale = fit && available > 0 ? Math.min(1, available / width) : 1

  return (
    <div ref={paneRef} className={cn('rounded-surface bg-surface-sunken p-0', !fit && 'overflow-x-auto')}>
      <div className="mx-auto" style={{ width: width * scale, height: height * scale }}>
        <iframe
          ref={iframeRef}
          title={title}
          src={src}
          style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}
          className="block border-0 bg-background shadow-md"
        />
      </div>
      <p className="px-3 py-1.5 text-center font-mono text-xs text-foreground-muted">
        {width} × {height}px{scale < 1 && ` · scaled to ${Math.round(scale * 100)}%`}
      </p>
    </div>
  )
}
