import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getRouteMain } from '@/shared/constants/router'
import type { UserRole } from '@/shared/types/router'
import { useAuth } from '@/features/Auth'

interface ProtectedRouteProps {
  roles?: UserRole[]
  redirectTo?: string
}

/**
 * ProtectedRoute - защищенный роут с проверкой авторизации и ролей
 * Использует Outlet для рендеринга вложенных роутов
 *
 * @example
 * <Route element={<ProtectedRoute roles={[UserRole.ADMIN]} />}>
 *   <Route path="/admin" element={<AdminPage />} />
 * </Route>
 */
export const ProtectedRoute = ({ roles, redirectTo = getRouteMain() }: ProtectedRouteProps) => {
  const location = useLocation()
  const { isAuth, user, isLoading } = useAuth()

  // Показываем загрузку, пока проверяем авторизацию
  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Checking authentication...</div>
      </div>
    )
  }

  // Проверка авторизации
  if (!isAuth) {
    // Сохраняем путь, на который пытался зайти пользователь
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Проверка ролей (если указаны)
  if (roles && roles.length > 0) {
    const hasRequiredRole = user?.role && roles.includes(user.role)

    if (!hasRequiredRole) {
      // Пользователь авторизован, но не имеет нужной роли
      return (
        <Navigate
          to={redirectTo}
          state={{ from: location, reason: 'insufficient_permissions' }}
          replace
        />
      )
    }
  }

  // Все проверки пройдены - рендерим дочерние роуты через Outlet
  return <Outlet />
}
