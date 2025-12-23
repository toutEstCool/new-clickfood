// ============================================
// ПРИМЕР: Типы для API
// ============================================

/**
 * Стандартный ответ API
 */
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

/**
 * Ошибка API
 */
export interface ApiError {
  message: string
  code: string
  errors?: Record<string, string[]>
}

/**
 * Пагинированный ответ
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
