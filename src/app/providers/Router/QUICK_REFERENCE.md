# ⚡ Quick Reference - Шпаргалка по роутингу

## 🚀 Быстрый старт

### 1. Добавить новый публичный роут

```tsx
// В routeConfigNew.tsx, внутри webapp children:
{
  path: 'webapp',
  element: <WebAppLayout />,
  children: [
    // ... существующие роуты
    {
      path: 'new-page',  // URL: /webapp/new-page
      element: <NewPage />,
    },
  ],
}
```

### 2. Добавить защищенный роут (только для авторизованных)

```tsx
{
  path: 'webapp',
  children: [
    {
      path: 'profile',
      element: <ProtectedRoute />,  // Без roles = только auth
      children: [
        {
          path: '',
          element: <ProfilePage />,
        },
      ],
    },
  ],
}
```

### 3. Добавить роут с проверкой роли

```tsx
{
  path: 'webapp',
  children: [
    {
      path: 'admin',
      element: <ProtectedRoute roles={[UserRole.SUPERADMIN]} />,
      children: [
        {
          path: '',
          element: <AdminDashboard />,
        },
      ],
    },
  ],
}
```

### 4. Добавить вложенные роуты с общим Layout

```tsx
{
  path: 'dashboard',
  element: <ProtectedRoute />,
  children: [
    {
      element: <DashboardLayout />,  // Общий layout
      children: [
        { index: true, element: <DashboardHome /> },        // /dashboard
        { path: 'analytics', element: <Analytics /> },      // /dashboard/analytics
        { path: 'settings', element: <Settings /> },        // /dashboard/settings
      ],
    },
  ],
}
```

## 🔗 Навигация

### Декларативная (Link)

```tsx
import { Link } from 'react-router-dom'

<Link to="/webapp/partner/menu">Меню</Link>
<Link to="/webapp/partner/menu" replace>Меню (replace)</Link>
<Link to="/webapp/partner/menu" state={{ from: 'dashboard' }}>Меню (с state)</Link>
```

### Программная (useNavigate)

```tsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

// Простой переход
navigate('/webapp/partner/menu')

// С replace (без записи в историю)
navigate('/webapp/partner/menu', { replace: true })

// С state
navigate('/webapp/partner/menu', { state: { orderId: 123 } })

// Назад
navigate(-1)

// Вперед
navigate(1)
```

### Условный редирект (Navigate)

```tsx
import { Navigate } from 'react-router-dom'

if (!isAuth) {
  return <Navigate to="/" replace />
}

// С state
return <Navigate to="/login" state={{ from: location }} replace />
```

## 🎣 Хуки

### useLocation

```tsx
import { useLocation } from 'react-router-dom'

const location = useLocation()

console.log(location.pathname)  // '/webapp/partner/menu'
console.log(location.search)    // '?tab=items'
console.log(location.state)     // { from: 'dashboard' }
```

### useParams

```tsx
import { useParams } from 'react-router-dom'

// Роут: /webapp/profile/:id
const { id } = useParams()  // id = '123'
```

### useSearchParams

```tsx
import { useSearchParams } from 'react-router-dom'

const [searchParams, setSearchParams] = useSearchParams()

// Чтение: /webapp/menu?category=pizza&sort=price
const category = searchParams.get('category')  // 'pizza'
const sort = searchParams.get('sort')          // 'price'

// Обновление
setSearchParams({ category: 'burger', sort: 'name' })
// URL станет: /webapp/menu?category=burger&sort=name
```

### useNavigate

```tsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()
navigate('/path')
```

### Custom hooks (наши утилиты)

```tsx
// Проверка активного роута
import { useActiveRoute } from '@/app/providers/Router/utils/hooks'

const isActive = useActiveRoute('/webapp/partner')
<Link className={isActive ? 'active' : ''}>Partner</Link>

// Breadcrumbs
import { useBreadcrumbs } from '@/app/providers/Router/utils/hooks'

const breadcrumbs = useBreadcrumbs()
breadcrumbs.map(crumb => (
  <Link to={crumb.path}>{crumb.label}</Link>
))
```

## 🛡️ Guards

### ProtectedRoute - защита от неавторизованных

```tsx
// Только авторизация (без проверки роли)
<Route element={<ProtectedRoute />}>
  <Route path="profile" element={<Profile />} />
</Route>

// С проверкой роли
<Route element={<ProtectedRoute roles={[UserRole.ADMIN]} />}>
  <Route path="admin" element={<Admin />} />
</Route>

// С custom redirect
<Route element={<ProtectedRoute redirectTo="/login" />}>
  <Route path="dashboard" element={<Dashboard />} />
</Route>
```

### PublicRoute - только для неавторизованных

```tsx
<Route element={<PublicRoute />}>
  <Route path="login" element={<Login />} />
</Route>

// С custom redirect
<Route element={<PublicRoute redirectTo="/dashboard" />}>
  <Route path="register" element={<Register />} />
</Route>
```

## 📐 Layouts

### Создание Layout

```tsx
import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'

export const MyLayout = () => {
  return (
    <div className="my-layout">
      <header>Header</header>
      <aside>Sidebar</aside>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />  {/* Здесь рендерятся дочерние роуты */}
        </Suspense>
      </main>
      <footer>Footer</footer>
    </div>
  )
}
```

### Использование в config

```tsx
{
  path: 'dashboard',
  element: <MyLayout />,  // Layout
  children: [
    { path: 'home', element: <Home /> },      // Рендерится в <Outlet />
    { path: 'settings', element: <Settings /> },
  ],
}
```

## 🔄 Lazy Loading

```tsx
import { lazy } from 'react'

// Загрузка компонента
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))

// Использование в config
{
  path: 'profile',
  element: <ProfilePage />,  // Автоматически lazy loaded
}

// НЕ забыть Suspense!
<Suspense fallback={<div>Loading...</div>}>
  <Outlet />
</Suspense>
```

## 📊 URL Patterns

### Index route (default)

```tsx
{
  path: 'dashboard',
  children: [
    { index: true, element: <Home /> },  // /dashboard
    { path: 'settings', element: <Settings /> },  // /dashboard/settings
  ],
}
```

### Dynamic segments

```tsx
{
  path: 'users/:userId',  // /users/123
  element: <UserProfile />,
}

// В компоненте:
const { userId } = useParams()  // '123'
```

### Optional segments

```tsx
{
  path: 'users/:userId?',  // /users или /users/123
  element: <UserList />,
}
```

### Wildcard

```tsx
{
  path: 'docs/*',  // /docs/anything/here
  element: <Docs />,
}
```

### Catch-all (404)

```tsx
{
  path: '*',
  element: <NotFound />,
}
```

## 🎯 Common Patterns

### Redirect from old URL

```tsx
import { Navigate } from 'react-router-dom'

{
  path: 'old-path',
  element: <Navigate to="/new-path" replace />,
}
```

### Conditional rendering

```tsx
const MyPage = () => {
  const { isAuth } = useAuth()
  
  if (!isAuth) {
    return <Navigate to="/login" replace />
  }
  
  return <div>Protected Content</div>
}
```

### Preserve scroll position

```tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const useScrollTop = () => {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
}
```

### Loading state

```tsx
import { Suspense } from 'react'

<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

## 🐛 Debugging

### Вывести текущий location

```tsx
import { useLocation } from 'react-router-dom'

const location = useLocation()
console.log('Current location:', location)
```

### Вывести params

```tsx
import { useParams } from 'react-router-dom'

const params = useParams()
console.log('Route params:', params)
```

### Проверить, какой роут активен

```tsx
import { useMatches } from 'react-router-dom'

const matches = useMatches()
console.log('Matched routes:', matches)
```

## ⚠️ Типичные ошибки

### ❌ Забыли <Outlet /> в Layout

```tsx
// НЕПРАВИЛЬНО
export const Layout = () => (
  <div>
    <Header />
    <main>{/* Здесь ничего не будет! */}</main>
  </div>
)

// ПРАВИЛЬНО
export const Layout = () => (
  <div>
    <Header />
    <main><Outlet /></main>
  </div>
)
```

### ❌ Забыли Suspense с lazy

```tsx
// НЕПРАВИЛЬНО
const Page = lazy(() => import('./Page'))
<Page />  // Error!

// ПРАВИЛЬНО
const Page = lazy(() => import('./Page'))
<Suspense fallback={<Loading />}>
  <Page />
</Suspense>
```

### ❌ Неправильный path в nested routes

```tsx
// НЕПРАВИЛЬНО
{
  path: 'dashboard',
  children: [
    { path: '/settings', element: <Settings /> }  // Абсолютный path!
  ]
}

// ПРАВИЛЬНО
{
  path: 'dashboard',
  children: [
    { path: 'settings', element: <Settings /> }  // Относительный path
  ]
}
```

## 📚 Полезные ссылки

- [React Router Docs](https://reactrouter.com/)
- [useRoutes API](https://reactrouter.com/en/main/hooks/use-routes)
- [Nested Routes Guide](https://reactrouter.com/en/main/start/concepts#nested-routes)
- [Наш README.md](./README.md)
- [Наш EXAMPLES.md](./EXAMPLES.md)

---

**Quick Tips:**
- ✅ Используйте относительные пути в nested routes
- ✅ Всегда оборачивайте lazy в Suspense
- ✅ Не забывайте <Outlet /> в layouts
- ✅ Guards на уровне route config, не в компонентах
- ✅ index route для default child route
