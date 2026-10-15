import { useEffect, useState } from 'react'
import PreviewPage from './preview/PreviewPage.jsx'
import HomepageDemo from './preview/home/HomepageDemo.jsx'

// Preview-only routing: `#/home` shows the demo homepage, anything else the component preview.
const isHomeRoute = () => window.location.hash === '#/home'

export default function App() {
  const [home, setHome] = useState(isHomeRoute)

  useEffect(() => {
    const onHashChange = () => setHome(isHomeRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return home ? <HomepageDemo /> : <PreviewPage />
}
