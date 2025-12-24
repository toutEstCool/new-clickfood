import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'

/**
 * SuperadminLayout - layout для панели суперадминистратора
 * Специализированный layout для административной панели
 * Включает:
 * - Admin sidebar с навигацией
 * - Admin header с действиями
 * - Breadcrumbs
 */
export const SuperadminLayout = () => {
  return (
    <div className="superadmin-layout-grid">
      <aside className="superadmin-sidebar">
        <nav>
          <div>Superadmin Navigation</div>
          {/* Здесь будет навигация суперадмина */}
        </nav>
      </aside>

      <div className="superadmin-main">
        <header className="superadmin-header">
          <div>Superadmin Header</div>
          {/* Breadcrumbs, actions */}
        </header>

        <main className="superadmin-content">
          <Suspense fallback={<div className="superadmin-loading">Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
