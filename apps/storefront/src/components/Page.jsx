import { useEffect } from 'react'
import { Breadcrumbs, Container } from 'ecom-ui-kit'
import { site } from '../config/site.js'
import { useLinkHandler } from '../routing/useLinkHandler.js'

/**
 * Standard page frame for every non-home route: breadcrumbs, one <h1>, optional intro, then the content.
 * It also sets the document title.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.intro]
 * @param {{ label: string, href?: string }[]} [props.breadcrumbs]  Root first, current page last (no href).
 * @param {'narrow'|'default'|'wide'} [props.size='default']  Container width.
 */
export default function Page({ title, intro, breadcrumbs, size = 'default', children }) {
  const handleLink = useLinkHandler()

  useEffect(() => {
    document.title = `${title} | ${site.brand.name}`
  }, [title])

  return (
    <Container size={size} className="page">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} onNavigate={handleLink} />}
      <header className="page-header">
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </header>
      {children}
    </Container>
  )
}
