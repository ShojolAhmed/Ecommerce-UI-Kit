// Build entry for consumers: the public API plus the compiled stylesheet.
// (`index.js` stays style-free so this repo's own app can import it with its own Tailwind setup.)
import './styles/bundle.css'
export * from './index.js'
