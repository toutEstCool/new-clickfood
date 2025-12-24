import AppRouter from './providers/Router/ui/AppRouter'
import { ScrollToTop } from './providers/Router/utils/ScrollToTop'
import './styles/global.css'

/**
 * Main App Component
 * Uses new React Router v7 architecture with Nested Routes
 */
export const App = () => {
  return (
    <>
      <ScrollToTop />
      <AppRouter />
    </>
  )
}
