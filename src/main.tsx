import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { ErrorBoundary } from './app/providers/ErrorBoundary'
import { BrowserRouter } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
)

/* Todo 23.12*/
// 1. Миграция Vite 7.2 / React Compiler * Version: "Release Candidate" [done 23.12.2025]
// 2. Eslint, prettier [done 23.12.2025]
// 3. Рефактор ErrorBoundary, ErrorTestComponent [done 23.12.2025]
// 4. Рефактор роутинга [done 23.12.2025]

/* Todo 24.12*/
// 1. Precommit хуки [24.12.2025]
// 2. Обновить TG-SDK [24.12.2025]
