import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from 'ecom-ui-kit'
import 'ecom-ui-kit/styles.css' // the kit's compiled stylesheet: no Tailwind setup is needed in this app
import './app.css'
import App from './App.jsx'
import StoreProvider from './state/StoreProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
