import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'

/**
 * WebAppLayout - layout для основной части webapp
 * Общий layout для всех страниц webapp
 * Здесь можно добавить:
 * - Navigation bar
 * - Bottom navigation (для мобильных)
 * - Global search
 */
export const WebAppLayout = () => {
  return (
    <div className="webapp-layout">
      <header className="webapp-header">
        <div>WebApp Header</div>
      </header>

      <main className="webapp-content">
        <Suspense fallback={<div className="webapp-loading">Loading page...</div>}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="webapp-footer">{/* Bottom navigation для мобильных */}</footer>
    </div>
  )
}
