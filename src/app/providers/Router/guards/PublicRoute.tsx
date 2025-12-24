import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getRouteWebApp } from '@/shared/constants/router'

interface PublicRouteProps {
  redirectTo?: string
}

/**
 * PublicRoute - публичный роут, доступный только неавторизованным
 * При попытке доступа авторизованного пользователя - редирект
 *
 * @example
 * <Route element={<PublicRoute />}>
 *   <Route path="/login" element={<LoginPage />} />
 * </Route>
 */
interface LocationState {
  from?: {
    pathname: string
  }
}

export const PublicRoute = ({ redirectTo = getRouteWebApp() }: PublicRouteProps) => {
  const location = useLocation()

  // TODO: Получить из контекста авторизации
  // const { isAuth } = useAuth()
  const isAuth = false // Временная заглушка

  // Если пользователь уже авторизован - редирект
  if (isAuth) {
    const state = location.state as LocationState | undefined
    const from = state?.from?.pathname || redirectTo
    return <Navigate to={from} replace />
  }

  // Пользователь не авторизован - показываем публичную страницу
  return <Outlet />
}
