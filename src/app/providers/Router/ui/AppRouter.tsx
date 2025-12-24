import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { routeConfig } from '../config/routeConfig'

/**
 * AppRouter - главный компонент роутинга приложения
 * Структура:
 * 1. RootLayout - глобальные элементы (toasts, modals)
 * 2. WebAppLayout - основная навигация webapp
 * 3. Специализированные Layouts (Superadmin, Partner, Order)
 * 4. Page components
 *
 * @see routeConfig.tsx для конфигурации роутов
 */
const AppRouter = () => {
  const routes = useRoutes(routeConfig)

  // Suspense на верхнем уровне для lazy-loaded компонентов
  // Каждый Layout также имеет свой Suspense для более гранулированной загрузки
  return (
    <Suspense fallback={<div className="app-loading">Loading application...</div>}>
      {routes}
    </Suspense>
  )
}

export default AppRouter
