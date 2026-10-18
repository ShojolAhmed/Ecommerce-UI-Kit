import { infoPages } from '../data/infoPages.js'
import Page from '../components/Page.jsx'
import { paths } from '../routing/paths.js'
import NotFoundPage from './NotFoundPage.jsx'

/**
 * Informational page (about, contact, FAQ, shipping, returns, privacy, terms), rendered from data/infoPages.js.
 * @param {{ id: string }} props  An `InfoPage.id`.
 */
export default function InfoPage({ id }) {
  const page = infoPages.find((item) => item.id === id)
  if (!page) return <NotFoundPage />

  return (
    <Page
      title={page.title}
      intro={page.intro}
      size="narrow"
      breadcrumbs={[{ label: 'Home', href: paths.home }, { label: page.title }]}
    >
      <div className="prose">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
    </Page>
  )
}
