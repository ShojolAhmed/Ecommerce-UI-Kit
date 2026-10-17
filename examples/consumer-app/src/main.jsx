import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'ecom-ui-kit/styles.css' // the kit's compiled stylesheet: no Tailwind setup needed in this app
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
