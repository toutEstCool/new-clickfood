import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'

/**
 * OrderLayout - layout для процесса оформления заказа
 * Специализированный layout для flow заказа
 * Включает:
 * - Stepper (шаги заказа)
 * - Back button
 * - Cart summary (для некоторых шагов)
 */
export const OrderLayout = () => {
  return (
    <div className="order-layout">
      <header className="order-header">
        <button className="order-back-button">← Back</button>
        <div className="order-stepper">{/* Steps: Shops → Menu → Checkout */}</div>
      </header>

      <main className="order-content">
        <Suspense fallback={<div className="order-loading">Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>

      <aside className="order-summary">{/* Cart summary, Order details */}</aside>
    </div>
  )
}
