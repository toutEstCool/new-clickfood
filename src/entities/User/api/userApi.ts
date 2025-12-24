/**
 * User API
 * Все API-запросы, связанные с пользователем и авторизацией
 */

import { api } from '@/shared/api/instance'
import type { AuthResponse, PhoneAuthRequest, User } from '../model/types'

/**
 * Отправка кода авторизации на телефон
 */
export const sendAuthCode = async (phone: string): Promise<void> => {
  await api.post('/auth/send-code', { phone })
}

/**
 * Авторизация по номеру телефона и коду
 */
export const loginByPhone = async (data: PhoneAuthRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data)
  return response.data
}

/**
 * Обновление access token через refresh token
 */
export const refreshTokens = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken })
  return response.data
}

/**
 * Получение текущего пользователя
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me')
  return response.data
}

/**
 * Выход из системы
 */
export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
}
