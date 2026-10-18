import { Button } from 'ecom-ui-kit'
import Page from '../components/Page.jsx'
import { paths } from '../routing/paths.js'
import { useLinkHandler } from '../routing/useLinkHandler.js'

/** @param {{ title?: string, message?: string }} props */
export default function NotFoundPage({ title = 'Page not found', message = 'The page you are looking for does not exist or has moved.' }) {
  const handleLink = useLinkHandler()
  return (
    <Page title={title} intro={message}>
      <div>
        <Button as="a" href={paths.shop} onClick={(event) => handleLink({ href: paths.shop }, event)}>
          Continue shopping
        </Button>
      </div>
    </Page>
  )
}
