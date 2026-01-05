/**
 * Telegram Auth API
 * Обмен initData от Telegram на JWT токен
 */
import { api } from '@/shared/api/instance'
import { decodeJwt } from '@/shared/lib/utils/jwt'

import { setAuthToken } from '@/features/Auth/lib/tokenStorage'

export interface JwtResponse {
  token: string
}

/**
 * Обменивает Telegram initData на JWT токен
 *
 * @param initData - initData от Telegram WebApp
 * @param source - источник запуска (start_param)
 * @returns JWT токен
 */
export async function exchangeInitDataForJwt(initData: string, source = ''): Promise<string> {
  // TODO: В будущем заменить на реальный user_id из initData
  const STATIC_USER_ID = 1212753058

  // Debug: логируем URL для отладки
  // eslint-disable-next-line no-console
  console.log('🔐 Requesting JWT token from:', api.defaults.baseURL + '/v2/jwt')

  const response = await api.post<JwtResponse>('/v2/jwt', {
    init_data: initData,
    source,
    user_id: STATIC_USER_ID,
  })

  const token = response.data?.token
  if (!token) {
    throw new Error('JWT token not found in response')
  }

  // Сохраняем токен в localStorage
  setAuthToken(token)

  // Декодируем и логируем для дебага
  const payload = decodeJwt(token)
  // eslint-disable-next-line no-console
  console.log('JWT payload:', payload)

  return token
}
