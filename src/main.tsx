import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { App } from './app/App'
import { ErrorBoundary } from './app/providers/ErrorBoundary'
import { AuthProvider } from './app/providers/AuthProvider'

/**
 * Main entry point для Telegram Mini App
 * Авторизация теперь происходит автоматически в AuthProvider
 */

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
