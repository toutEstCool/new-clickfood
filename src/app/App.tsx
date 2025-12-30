import { useAuth } from '@/features/Auth'
import { AuthLoadingScreen } from '@/shared/ui/AuthLoadingScreen'
import AppRouter from './providers/Router/ui/AppRouter'
import { ScrollToTop } from './providers/Router/utils/ScrollToTop'
import './styles/global.css'

/**
 * Main App Component
 * Uses new React Router v7 architecture with Nested Routes
 * Shows loading screen during initial authentication
 */
export const App = () => {
  const { isInitializing } = useAuth()

  // Показываем лоадер пока идет авторизация
  if (isInitializing) {
    return <AuthLoadingScreen />
  }

  return (
    <>
      <ScrollToTop />
      <AppRouter />
    </>
  )
}
