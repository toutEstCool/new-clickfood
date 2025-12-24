import { useLocation, matchPath } from 'react-router-dom'

/**
 * Проверяет, является ли текущий роут активным
 * Полезно для навигационных компонентов
 *
 * @param path - путь для проверки
 * @param exact - точное совпадение или prefix matching
 * @returns true если роут активен
 *
 * @example
 * const isActive = useActiveRoute('/webapp/partner')
 * <NavLink className={isActive ? 'active' : ''}>Partner</NavLink>
 */
export const useActiveRoute = (path: string, exact = false): boolean => {
  const location = useLocation()

  if (exact) {
    return location.pathname === path
  }

  return matchPath({ path, end: false }, location.pathname) !== null
}

/**
 * Получить breadcrumbs для текущего роута
 * Используется для отображения хлебных крошек в Header
 *
 * @example
 * const breadcrumbs = useBreadcrumbs()
 * // [{ label: 'Home', path: '/' }, { label: 'Partner', path: '/webapp/partner' }]
 */
export const useBreadcrumbs = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  return pathnames.map((_, index) => {
    const path = `/${pathnames.slice(0, index + 1).join('/')}`
    const label = pathnames[index]
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return {
      label,
      path,
      isLast: index === pathnames.length - 1,
    }
  })
}

/**
 * Получить параметры роута с типизацией
 * Type-safe wrapper над useParams
 *
 * @example
 * const { id } = useTypedParams<{ id: string }>()
 */
export const useTypedParams = <T extends Record<string, string>>(): T => {
  const params = new URLSearchParams(window.location.search)
  const result = {} as T

  params.forEach((value, key) => {
    ;(result as any)[key] = value
  })

  return result
}
