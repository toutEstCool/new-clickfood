import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { retrieveLaunchParams } from '@tma.js/sdk-react'
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { decodeJwt, isJwtExpired } from '@/shared/lib/utils/jwt'
import { UserRole } from '@/shared/types/router'

import { exchangeInitDataForJwt } from '@/entities/User/api/telegramAuth'

import { clearAuthToken, getAuthToken } from '@/features/Auth/lib/tokenStorage'

import { AuthContext, type JwtUser } from '../lib/authContext'
import { queryClient } from '../lib/queryClient'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => getAuthToken())

  // Проверяем токен сразу при инициализации
  // Если токен валиден - не показываем лоадер
  const [isInitializing, setIsInitializing] = useState(() => {
    const existingToken = getAuthToken()
    // Если токен есть и не истек - инициализация не нужна
    if (existingToken && !isJwtExpired(existingToken)) {
      return false
    }
    // Иначе нужна авторизация
    return true
  })

  // Защита от двойного вызова в React StrictMode
  const isAuthInitialized = useRef(false)

  // Автоматическая авторизация при монтировании
  useEffect(() => {
    const initializeAuth = async () => {
      // Защита от повторного выполнения в StrictMode
      if (isAuthInitialized.current) {
        // eslint-disable-next-line no-console
        console.log('⏭️ Auth already initialized, skipping...')
        return
      }
      isAuthInitialized.current = true

      try {
        // Проверяем, есть ли уже токен
        const existingToken = getAuthToken()
        if (existingToken && !isJwtExpired(existingToken)) {
          // Токен валиден, авторизация не нужна
          // eslint-disable-next-line no-console
          console.log('✅ Using existing valid token')
          setIsInitializing(false)
          return
        }

        // Пытаемся получить launch params от Telegram
        let initDataRaw = ''
        let startParam = ''

        try {
          const launchParams = retrieveLaunchParams()
          initDataRaw = typeof launchParams.initDataRaw === 'string' ? launchParams.initDataRaw : ''
          startParam = typeof launchParams.startParam === 'string' ? launchParams.startParam : ''
        } catch (launchError) {
          // Ошибка получения launch params (вне Telegram или browser)
          console.warn('⚠️ Unable to retrieve Telegram launch params (browser mode):', launchError)
        }

        // Всегда пытаемся получить JWT
        // В development режиме initData будет пустым, но сервер должен обработать это
        console.log('🔐 Initializing authentication...')

        if (!initDataRaw) {
          console.warn('⚠️ No initData available (development mode)')
        }

        await exchangeInitDataForJwt(initDataRaw, startParam)
        setToken(getAuthToken())
        // eslint-disable-next-line no-console
        console.log('✅ Authentication successful')
      } catch (error) {
        // Если обмен failed - продолжаем без токена
        console.error('❌ Authentication failed:', error)
      } finally {
        // Всегда завершаем инициализацию
        setIsInitializing(false)
      }
    }

    initializeAuth()
  }, [])

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
    if (isJwtExpired(token)) return null

    const payload = decodeJwt(token)
    if (!payload?.user_id) return null

    return {
      id: String(payload.user_id),
      chatId: payload.chat_id ? String(payload.chat_id) : undefined,
      role: (payload.user_role as UserRole) || UserRole.USER,
      firstName: payload.first_name,
      nickName: payload.nick_name,
      source: payload.source,
    }
  }, [token])

  const isAuth = Boolean(user)
  const authStatus: 'authenticated' | 'unauthenticated' = isAuth
    ? 'authenticated'
    : 'unauthenticated'

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!user) return false
      const roleArray = Array.isArray(roles) ? roles : [roles]
      return roleArray.includes(user.role)
    },
    [user]
  )

  const logout = useCallback(() => {
    clearAuthToken()
    setToken(null)
    window.location.href = '/'
  }, [])

  const refetch = useCallback(() => {
    setToken(getAuthToken())
  }, [])

  const contextValue = useMemo(
    () => ({
      user,
      isAuth,
      authStatus,
      token,
      isInitializing,
      logout,
      refetch,
      hasRole,
    }),
    [user, isAuth, authStatus, token, isInitializing, logout, refetch, hasRole]
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
