/**
 * useAuth Hook for Telegram Mini App
 * Управление авторизацией через JWT токен от Telegram
 */

import { useEffect, useMemo, useState, useCallback } from 'react'
import { UserRole } from '@/shared/types/router'
import { getAuthToken, clearAuthToken } from '../lib/tokenStorage'
import { decodeJwt, isJwtExpired } from '@/shared/lib/utils/jwt'

/**
 * User data извлеченный из JWT токена
 */
interface JwtUser {
  id: string
  role: UserRole
  source?: string
}

/**
 * useAuth - главный хук авторизации для Telegram Mini App
 *
 * Отличия от обычной авторизации:
 * - Токен получается автоматически при запуске (в main.tsx)
 * - User data извлекается из JWT (не с сервера)
 * - Нет login/sendCode методов (авторизация автоматическая)
 *
 * @example
 * const { user, isAuth, logout } = useAuth()
 *
 * if (!isAuth) return <div>Not authenticated</div>
 * return <Dashboard user={user} />
 */
export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() => getAuthToken())

  // Слушаем изменения токена (для синхронизации между вкладками)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'clickfood_jwt_token') {
        setToken(getAuthToken())
      }
    }

    const handleCustomStorageEvent = () => {
      setToken(getAuthToken())
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('storage', handleCustomStorageEvent)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('storage', handleCustomStorageEvent)
    }
  }, [])

  // Извлекаем user data из JWT
  const user = useMemo((): JwtUser | null => {
    if (!token) return null

    // Если токен истек - возвращаем null (очистка произойдет через logout)
    if (isJwtExpired(token)) {
      return null
    }

    const payload = decodeJwt(token)
    if (!payload?.user_id) return null

    return {
      id: String(payload.user_id),
      role: (payload.user_role as UserRole) || UserRole.USER,
      source: payload.source,
    }
  }, [token])

  /**
   * Статус авторизации
   */
  const isAuth = Boolean(user)
  const authStatus = isAuth ? 'authenticated' : 'unauthenticated'

  /**
   * Проверка роли пользователя
   */
  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!user) return false

      const roleArray = Array.isArray(roles) ? roles : [roles]
      return roleArray.includes(user.role)
    },
    [user]
  )

  /**
   * Выход из системы (очистка токена)
   */
  const logout = useCallback(() => {
    clearAuthToken()
    setToken(null)
    // Опционально: редирект или reload
    window.location.href = '/'
  }, [])

  /**
   * Обновить токен (принудительно перечитать из localStorage)
   */
  const refetch = useCallback(() => {
    setToken(getAuthToken())
  }, [])

  return {
    // User data
    user,
    isAuth,
    authStatus,
    token,

    // Actions
    logout,
    refetch,
    hasRole,

    // Loading states (для совместимости с ProtectedRoute)
    isLoading: false, // Токен синхронный, загрузки нет
  }
}
