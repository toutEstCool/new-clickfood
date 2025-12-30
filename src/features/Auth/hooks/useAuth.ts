/**
 * useAuth Hook for Telegram Mini App
 * Управление авторизацией через JWT токен от Telegram
 */

import { useContext } from 'react'
import { AuthContext } from '@/app/providers/AuthProvider'

/**
 * useAuth - главный хук авторизации для Telegram Mini App
 *
 * Теперь использует контекст для предотвращения лишних ререндеров
 * и централизации логики
 *
 * @example
 * const { user, isAuth, isInitializing, logout } = useAuth()
 *
 * if (isInitializing) return <div>Loading...</div>
 * if (!isAuth) return <div>Not authenticated</div>
 * return <Dashboard user={user} />
 */
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return {
    ...context,
    // isLoading теперь отражает состояние инициализации
    isLoading: context.isInitializing,
  }
}
