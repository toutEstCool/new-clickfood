/**
 * Token Storage Utility
 * Безопасное хранение JWT токена в localStorage для Telegram Mini App
 *
 * NOTE: В production рекомендуется использовать httpOnly cookies,
 * но для Telegram Mini App localStorage - стандартный подход
 */

const TOKEN_STORAGE_KEY = 'clickfood_jwt_token'

/**
 * Сохранить JWT токен в localStorage
 */
export const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    // Триггерим storage event для синхронизации между вкладками
    window.dispatchEvent(new Event('storage'))
  } catch (e) {
    console.error('Failed to save auth token:', e)
  }
}

/**
 * Получить JWT токен из localStorage
 */
export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch (e) {
    console.error('Failed to get auth token:', e)
    return null
  }
}

/**
 * Удалить JWT токен из localStorage
 */
export const clearAuthToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    // Триггерим storage event для синхронизации между вкладками
    window.dispatchEvent(new Event('storage'))
  } catch (e) {
    console.error('Failed to clear auth token:', e)
  }
}

/**
 * Проверить, есть ли JWT токен
 */
export const hasAuthToken = (): boolean => {
  return Boolean(getAuthToken())
}

// Backward compatibility (старые названия)
export const saveTokens = (tokens: { accessToken: string }) => setAuthToken(tokens.accessToken)
export const getAccessToken = getAuthToken
export const getRefreshToken = () => null // У нас только JWT
export const clearTokens = clearAuthToken
export const hasValidTokens = hasAuthToken
