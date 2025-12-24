import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop - утилита для автоматического скролла вверх при навигации
 * Используется в RootLayout или App component
 *
 * @example
 * function App() {
 *   return (
 *     <Router>
 *       <ScrollToTop />
 *       <AppRouter />
 *     </Router>
 *   )
 * }
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    })
  }, [pathname])

  return null
}
