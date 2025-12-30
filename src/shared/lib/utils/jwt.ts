/**
 * JWT Decoder Utility
 * Декодирует JWT токен и извлекает payload
 */

interface JwtPayload {
  user_id?: string | number
  user_role?: string
  chat_id?: string | number
  first_name?: string
  nick_name?: string
  source?: string
  points?: number
  start_time?: string
  lang?: string
  exp?: number
  iat?: number
  [key: string]: unknown
}

/**
 * Декодирует JWT токен (только payload, без валидации подписи)
 * ВАЖНО: Используется только для чтения данных, валидация происходит на сервере
 */
export function decodeJwt(token: string | null): JwtPayload | null {
  if (!token) return null

  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.warn('Invalid JWT format')
      return null
    }

    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded) as JwtPayload
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

/**
 * Проверяет, истек ли JWT токен
 */
export function isJwtExpired(token: string | null): boolean {
  const payload = decodeJwt(token)
  if (!payload || !payload.exp) return true

  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}

/**
 * Извлекает user_id из JWT токена
 */
export function getUserIdFromToken(token: string | null): string | null {
  const payload = decodeJwt(token)
  if (!payload?.user_id) return null

  return String(payload.user_id)
}

/**
 * Извлекает role из JWT токена
 */
export function getRoleFromToken(token: string | null): string | null {
  const payload = decodeJwt(token)
  return payload?.user_role || null
}
