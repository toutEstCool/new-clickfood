import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'

/**
 * RootLayout - корневой layout для всего приложения
 * Оборачивает все остальные layouts
 * Здесь можно добавить глобальные элементы UI:
 * - Toast notifications
 * - Global modals
 * - Error boundaries
 */
export const RootLayout = () => {
  return (
    <div className="root-layout">
      <Suspense fallback={<div className="root-loading">Loading...</div>}>
        <Outlet />
      </Suspense>
    </div>
  )
}
