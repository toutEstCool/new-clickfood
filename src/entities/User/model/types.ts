/**
 * User Entity Types
 * Типы для работы с пользователем и авторизацией
 */

import type { UserRole } from '@/shared/types/router'

/**
 * Основная информация о пользователе
 */
export interface User {
  id: string
  phone: string
  name?: string
  email?: string
  avatar?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

/**
 * Токены авторизации
 */
export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/**
 * Ответ от сервера при авторизации
 */
export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

/**
 * Данные для авторизации по номеру телефона
 */
export interface PhoneAuthRequest {
  phone: string
  code?: string
}

/**
 * Тип состояния авторизации
 */
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
