/**
 * User React Query Hooks
 * Хуки для работы с пользователем через React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PhoneAuthRequest, User } from './types'
import * as userApi from '../api/userApi'
import { saveTokens, clearTokens } from '@/features/Auth/lib/tokenStorage'

/**
 * Query Keys для React Query
 */
export const userKeys = {
  all: ['user'] as const,
  current: () => [...userKeys.all, 'current'] as const,
}

/**
 * Hook для получения текущего пользователя
 * Автоматически кэширует и обновляет данные
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: userApi.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 1,
  })
}

/**
 * Hook для авторизации по телефону
 */
export const usePhoneLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PhoneAuthRequest) => userApi.loginByPhone(data),
    onSuccess: (response) => {
      // Сохраняем токены
      saveTokens(response.tokens)

      // Обновляем кэш пользователя
      queryClient.setQueryData(userKeys.current(), response.user)

      // Инвалидируем все queries пользователя
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

/**
 * Hook для отправки кода на телефон
 */
export const useSendAuthCode = () => {
  return useMutation({
    mutationFn: (phone: string) => userApi.sendAuthCode(phone),
  })
}

/**
 * Hook для выхода из системы
 */
export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.logout,
    onSuccess: () => {
      // Очищаем токены
      clearTokens()

      // Очищаем весь кэш (пользователь, заказы, и т.д.)
      queryClient.clear()
    },
  })
}

/**
 * Hook для обновления данных пользователя
 * Можно использовать для optimistic updates
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (user: Partial<User>) => {
      // TODO: Implement API call
      return user as User
    },
    onMutate: async (newUser) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.current() })

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(userKeys.current())

      // Optimistically update
      queryClient.setQueryData(userKeys.current(), (old: User | undefined) => {
        if (!old) return old
        return { ...old, ...newUser }
      })

      return { previousUser }
    },
    onError: (_err, _newUser, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.current(), context.previousUser)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.current() })
    },
  })
}
