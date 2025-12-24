/**
 * Telegram Auth API
 * Обмен initData от Telegram на JWT токен
 */

import { api } from '@/shared/api/instance'
import { setAuthToken } from '@/features/Auth/lib/tokenStorage'
import { decodeJwt } from '@/shared/lib/utils/jwt'

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
  const response = await api.post<JwtResponse>('/v2/jwt', {
    init_data: initData,
    source,
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
