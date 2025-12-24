/**
 * Auth Provider for Telegram Mini App
 * Manages JWT-based authentication from Telegram initData
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'

// Создаем QueryClient с настройками для Telegram Mini App
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 10 * 60 * 1000, // 10 минут (бывший cacheTime)
      retry: 1,
      refetchOnWindowFocus: false, // Для Mini App не нужно
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
})

interface AuthProviderProps {
  children: ReactNode
}

/**
 * AuthProvider - провайдер авторизации для Telegram Mini App
 * Оборачивает приложение и предоставляет React Query context
 *
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools только в development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

// Экспортируем queryClient для использования вне React
export { queryClient }
