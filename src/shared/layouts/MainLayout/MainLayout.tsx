import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'

/**
 * PartnerLayout - layout для панели партнера
 * Специализированный layout для партнерского кабинета
 * Включает:
 * - Partner sidebar с навигацией по меню, отчетам, интеграциям
 * - Partner header с информацией о магазине
 * - Quick actions panel
 */
export const PartnerLayout = () => {
  return (
    <div className="partner-layout-grid">
      <aside className="partner-sidebar">
        <nav>
          <div>Partner Navigation</div>
          {/* Навигация: Меню, Отчеты, Интеграции, Настройки */}
        </nav>
      </aside>

      <div className="partner-main">
        <header className="partner-header">
          <div>Partner Header</div>
          {/* Информация о магазине, быстрые действия */}
        </header>

        <main className="partner-content">
          {/* Suspense здесь важен! Он покажет лоадер ТОЛЬКО в контентной части,
              не скрывая sidebar при переходе между страницами */}
          <Suspense fallback={<div className="partner-loading">Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
