import type { ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'

/**
 * Роли пользователей в системе
 */
export enum UserRole {
  USER = 'user',
  PARTNER = 'partner',
  SUPERADMIN = 'superadmin',
}

/**
 * Расширенные props для роутинга приложения
 * Поддерживает:
 * - Защищенные роуты (authOnly)
 * - Роли доступа (roles)
 * - Вложенные роуты (children)
 * - Lazy loading (lazy)
 */
export interface AppRoutesProps extends Omit<RouteObject, 'children'> {
  path: string
  element?: ReactNode
  /**
   * Требуется ли авторизация для доступа к роуту
   */
  authOnly?: boolean
  /**
   * Список ролей, которым разрешен доступ
   * Если не указан - доступ разрешен всем авторизованным пользователям
   */
  roles?: UserRole[]
  /**
   * Вложенные дочерние роуты
   */
  children?: AppRoutesProps[]
  /**
   * Метаданные для SEO и аналитики
   */
  meta?: {
    title?: string
    description?: string
    requiresOnboarding?: boolean
  }
}

/**
 * Конфигурация роута с метаданными
 */
export interface RouteConfig {
  /**
   * Уникальный идентификатор роута
   */
  id: string
  /**
   * Путь роута
   */
  path: string
  /**
   * Props роута
   */
  props: AppRoutesProps
}
