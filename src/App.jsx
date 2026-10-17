import { lazy, Suspense, useEffect, useState } from 'react'
import { ToastProvider } from './library/index.js'
import PreviewPage from './preview/PreviewPage.jsx'
import HomepageDemo from './preview/home/HomepageDemo.jsx'

// The gallery is its own tool: load it only when its routes are opened.
const GalleryPage = lazy(() => import('./gallery/GalleryPage.jsx'))
const FramePage = lazy(() => import('./gallery/FramePage.jsx'))

// Preview-only routing: `#/gallery…` the component gallery (`#/gallery-frame…` is the bare page inside
// its iframes), `#/home` the demo homepage, anything else the component preview.
const readRoute = () => {
  const hash = window.location.hash
  if (hash.startsWith('#/gallery-frame')) return 'frame'
  if (hash.startsWith('#/gallery')) return 'gallery'
  if (hash === '#/home') return 'home'
  return 'preview'
}

const pages = {
  frame: FramePage,
  gallery: GalleryPage,
  home: HomepageDemo,
  preview: PreviewPage,
}

export default function App() {
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    const onHashChange = () => setRoute((current) => {
      const next = readRoute()
      // Navigating inside the gallery keeps the same page mounted (the iframe must not reload).
      return next === current ? current : next
    })
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const Page = pages[route]

  // One toast viewport for the whole preview; demos call `useToast()`.
  return (
    <ToastProvider>
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    </ToastProvider>
  )
}
