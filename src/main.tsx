import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { retrieveLaunchParams } from '@tma.js/sdk-react'

import { App } from './app/App'
import { ErrorBoundary } from './app/providers/ErrorBoundary'
import { AuthProvider } from './app/providers/AuthProvider'
import { exchangeInitDataForJwt } from '@/entities/User/api/telegramAuth'

/**
 * Bootstrap function для Telegram Mini App
 * 1. Получаем initData от Telegram
 * 2. Обмениваем на JWT токен
 * 3. Рендерим приложение
 */
async function bootstrap() {
  try {
    // Получаем launch params от Telegram
    const launchParams = retrieveLaunchParams()

    // Безопасно извлекаем initDataRaw и startParam
    const initDataRaw = typeof launchParams.initDataRaw === 'string' ? launchParams.initDataRaw : ''
    const startParam = typeof launchParams.startParam === 'string' ? launchParams.startParam : ''

    // Если есть initData - обмениваем на JWT
    if (initDataRaw) {
      await exchangeInitDataForJwt(initDataRaw, startParam)
    }
  } catch (error) {
    // Если обмен failed - продолжаем без токена
    // Это нормально для development вне Telegram
    console.warn('Failed to initialize Telegram auth:', error)
  } finally {
    // Рендерим приложение в любом случае
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
  }
}

// Запускаем bootstrap
bootstrap()
