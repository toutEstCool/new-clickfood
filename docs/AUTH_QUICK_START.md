# 🔐 Authentication System - Quick Start

## ⚡ TL;DR (для быстрого старта)

```tsx
// 1. Import хук
import { useAuth } from '@/features/Auth'

// 2. Используй в компоненте
const { user, isAuth, login, logout } = useAuth()

// 3. Готово!
if (!isAuth) return <LoginPage />
return <Dashboard user={user} />
```

---

## 📦 Что уже настроено:

✅ React Query (server state management)  
✅ useAuth hook (главный хук авторизации)  
✅ Token storage (localStorage wrapper)  
✅ ProtectedRoute (route guards)  
✅ Type-safe API (TypeScript)  
✅ Auto-caching & refetching  
✅ DevTools для debugging  

---

## 🚀 Примеры использования:

### 1️⃣ **Login Page**

```tsx
import { useAuth } from '@/features/Auth'

export const LoginPage = () => {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const { sendCode, login, isLoading } = useAuth()

  const handleSendCode = () => sendCode(phone)
  const handleLogin = () => login(phone, code)

  return (
    <div>
      <input value={phone} onChange={e => setPhone(e.target.value)} />
      <button onClick={handleSendCode}>Send Code</button>
      
      <input value={code} onChange={e => setCode(e.target.value)} />
      <button onClick={handleLogin} disabled={isLoading}>
        Login
      </button>
    </div>
  )
}
```

### 2️⃣ **Protected Dashboard**

```tsx
import { useAuth } from '@/features/Auth'

export const Dashboard = () => {
  const { user, logout, hasRole } = useAuth()

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Role: {user?.role}</p>
      
      {hasRole('SUPERADMIN') && <AdminPanel />}
      
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### 3️⃣ **Conditional Rendering**

```tsx
import { useAuth } from '@/features/Auth'

export const App = () => {
  const { isAuth, isLoading } = useAuth()

  if (isLoading) return <Loader />
  if (!isAuth) return <LoginPage />
  return <Dashboard />
}
```

---

## 🎯 API Reference: useAuth()

```tsx
const {
  // User data
  user,           // User | null - данные пользователя
  isAuth,         // boolean - авторизован ли
  authStatus,     // 'authenticated' | 'unauthenticated' | 'loading'
  hasTokens,      // boolean - есть ли токены в localStorage
  
  // Actions
  login,          // (phone, code) => Promise - вход
  logout,         // () => Promise - выход
  sendCode,       // (phone) => Promise - отправка кода
  refetch,        // () => Promise - перезагрузка данных
  hasRole,        // (role) => boolean - проверка роли
  
  // Loading states
  isLoading,      // boolean - любая загрузка
  isLoginLoading, // boolean - загрузка входа
  isLogoutLoading,// boolean - загрузка выхода
  isSendCodeLoading, // boolean - отправка кода
  
  // Errors
  error,          // Error | null - общая ошибка
  loginError,     // Error | null - ошибка входа
  logoutError,    // Error | null - ошибка выхода
  sendCodeError,  // Error | null - ошибка отправки кода
} = useAuth()
```

---

## 🛡️ ProtectedRoute (уже работает!)

```tsx
// В роутах
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>

// С проверкой ролей
<Route element={<ProtectedRoute roles={['SUPERADMIN']} />}>
  <Route path="/admin" element={<AdminPanel />} />
</Route>
```

**Работает автоматически!** Использует useAuth под капотом.

---

## 🔧 Подключение к реальному API

### 1. Обновите endpoints в `shared/api/instance.ts`:

```tsx
export const api = axios.create({
  baseURL: 'https://your-api.com/api', // ← Ваш API
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 2. API автоматически использует токены:

```tsx
// entities/User/api/userApi.ts
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me')
  return response.data
}
```

### 3. Добавьте interceptor для auto-refresh (опционально):

```tsx
// shared/api/instance.ts
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Auto-refresh token logic
      const refreshToken = getRefreshToken()
      // ... retry request
    }
    return Promise.reject(error)
  }
)
```

---

## 🐛 Debugging

### React Query DevTools (уже включены в dev mode):

1. Запусти `pnpm dev`
2. Открой приложение
3. Внизу экрана увидишь **React Query DevTools**
4. Просмотри все queries:
   - `['user', 'current']` - текущий пользователь
   - Статус: loading, success, error
   - Кэшированные данные

### Console Logging:

```tsx
const auth = useAuth()
console.log('Auth state:', auth)
```

---

## 📁 Структура файлов:

```
src/
├── entities/User/          # User entity
│   ├── api/userApi.ts     # API calls
│   ├── model/
│   │   ├── types.ts       # TypeScript types
│   │   └── queries.ts     # React Query hooks
│   └── index.ts
│
├── features/Auth/          # Auth feature
│   ├── hooks/useAuth.ts   # 🎯 Main hook
│   ├── lib/tokenStorage.ts
│   └── index.ts
│
├── app/providers/AuthProvider/
│   ├── ui/AuthProvider.tsx
│   └── index.ts
│
└── pages/examples/
    └── AuthExample.tsx     # Working examples!
```

---

## ❓ FAQ

**Q: Нужен ли Zustand для auth?**  
A: **Нет!** React Query достаточно. Zustand только для UI state.

**Q: Где хранятся токены?**  
A: localStorage (для demo). Production: httpOnly cookies.

**Q: Как обновляются токены?**  
A: Добавь interceptor (см. docs/AUTH_IMPLEMENTATION.md).

**Q: Безопасно ли localStorage?**  
A: Для MVP - да. Production - используй httpOnly cookies.

**Q: Как тестировать без API?**  
A: Mock API в `entities/User/api/userApi.ts`.

---

## 🎓 Learn More

📖 **Подробная документация:** `docs/AUTH_IMPLEMENTATION.md`  
💻 **Примеры кода:** `pages/examples/AuthExample.tsx`  
📊 **Архитектурная диаграмма:** См. artifacts  

---

## ✅ Checklist для начала работы:

- [ ] Прочитал Quick Start
- [ ] Посмотрел примеры в `AuthExample.tsx`
- [ ] Обновил API endpoints
- [ ] Создал LoginPage
- [ ] Протестировал login flow
- [ ] Добавил error handling
- [ ] Открыл React Query DevTools
- [ ] Прочитал полную документацию

---

**Готово к работе!** 🚀 Начни с создания LoginPage используя примеры выше.
