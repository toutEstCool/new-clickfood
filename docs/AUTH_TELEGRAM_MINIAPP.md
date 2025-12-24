# 🎯 Telegram Mini App Auth - Implementation Guide

## ✅ **Что было реализовано:**

### 📱 **Telegram Mini App Authentication**

**Ключевые отличия от обычной авторизации:**
- ✅ **Автоматическая авторизация** при запуске приложения
- ✅ **initData → JWT** обмен вместо phone/code
- ✅ **JWT декодирование** для получения user data
- ✅ **Нет форм входа** - все происходит автоматически

---

## 🔄 **Как это работает:**

```
1. User открывает Mini App в Telegram
       ↓
2. Telegram передает initData + startParam
       ↓
3. bootstrap() отправляет initData на /v2/jwt
       ↓
4. Backend возвращает JWT токен
       ↓
5. JWT сохраняется в localStorage
       ↓
6. useAuth() декодирует JWT и извлекает user data
       ↓
7. ProtectedRoute автоматически проверяет авторизацию
```

---

## 📦 **Структура:**

```
entities/User/
├── api/
│   ├── userApi.ts         # Старые API (не используются)
│   └── telegramAuth.ts    # 🎯 exchangeInitDataForJwt
└── model/
    ├── types.ts           # User, AuthTokens types
    └── queries.ts         # React Query (не используются для Telegram)

features/Auth/
├── hooks/
│   └── useAuth.ts         # 🎯 JWT-based auth hook
└── lib/
    └── tokenStorage.ts    # localStorage для JWT

shared/lib/utils/
└── jwt.ts                 # 🎯 JWT decoder

main.tsx                   # 🎯 Bootstrap с Telegram init
```

---

## 🚀 **Использование:**

### **1. Bootstrap (main.tsx):**

```tsx
import { retrieveLaunchParams } from '@tma.js/sdk-react'
import { exchangeInitDataForJwt } from '@/entities/User/api/telegramAuth'

async function bootstrap() {
  try {
    const launchParams = retrieveLaunchParams()
    const initDataRaw = launchParams.initDataRaw || ''
    const startParam = launchParams.startParam || ''

    if (initDataRaw) {
      await exchangeInitDataForJwt(initDataRaw, startParam)
    }
  } catch (error) {
    console.warn('Auth failed:', error)
  } finally {
    // Render app
  }
}

bootstrap()
```

### **2. useAuth Hook:**

```tsx
import { useAuth } from '@/features/Auth'

function App() {
  const { user, isAuth, logout } = useAuth()
  
  if (!isAuth) {
    return <div>Not authenticated</div>
  }
  
  return (
    <div>
      <p>User ID: {user.id}</p>
      <p>Role: {user.role}</p>
      <p>Source: {user.source}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### **3. ProtectedRoute:**

```tsx
// Автоматически работает!
<Route element={<ProtectedRoute roles={[UserRole.PARTNER]} />}>
  <Route path="/partner" element={<PartnerPage />} />
</Route>
```

---

## 🔑 **API Reference:**

### **exchangeInitDataForJwt()**

```typescript
exchangeInitDataForJwt(
  initData: string,    // От Telegram
  source: string       // startParam
): Promise<string>     // JWT токен
```

**Backend endpoint:** `POST /v2/jwt`
```json
{
  "init_data": "string",
  "source": "string"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **JWT Payload:**

```typescript
{
  user_id: string | number,  // ID пользователя
  user_role: string,          // Роль (user, partner, superadmin)
  source: string,             // Откуда пришел
  exp: number,                // Expiration timestamp
  iat: number                 // Issued at timestamp
}
```

### **useAuth() Return:**

```typescript
{
  user: JwtUser | null,      // { id, role, source }
  isAuth: boolean,           // Авторизован ли
  authStatus: string,        // 'authenticated' | 'unauthenticated'
  token: string | null,      // JWT токен
  
  logout: () => void,        // Очистка токена + redirect
  refetch: () => void,       // Перечитать токен из localStorage
  hasRole: (role) => boolean,// Проверка роли
  
  isLoading: false           // Всегда false (токен синхронный)
}
```

---

## 📱 **Telegram SDK (@tma.js/sdk-react):**

### **Установлен:**
```json
{
  "@tma.js/sdk-react": "^3.0.11"
}
```

### **Используется:**
- `retrieveLaunchParams()` - получение initData и startParam

### **Дополнительные возможности:**
```tsx
import { useWebApp, useInitData, useThemeParams } from '@tma.js/sdk-react'

// WebApp instance
const webApp = useWebApp()
webApp.ready()
webApp.MainButton.show()

// Init data
const initData = useInitData()
console.log(initData.user)

// Theme
const themeParams = useThemeParams()
console.log(themeParams.bgColor)
```

---

## 🔒 **Security:**

### **JWT хранение:**
- localStorage с ключом `clickfood_jwt_token`
- ✅ Подходит для Telegram Mini App
- ⚠️ НЕ использовать для web (используй httpOnly cookies)

### **Expiration handling:**
```tsx
// В useAuth автоматически
if (isJwtExpired(token)) {
  return null // User будет null, isAuth = false
}
```

### **Auto-logout при истечении:**
- JWT проверяется каждый раз при доступе к user
- Если истек → user = null → ProtectedRoute редиректит

---

## 🐛 **Development / Testing:**

### **Без Telegram (локальная разработка):**

```tsx
// bootstrap() просто пропустит auth
if (!initDataRaw) {
  // Приложение запустится БЕЗ токена
  // isAuth будет false
}
```

### **Мок токена для теста:**

```tsx
// В localStorage Руками
localStorage.setItem('clickfood_jwt_token', 'YOUR_JWT_TOKEN')

// Или в коде
import { setAuthToken } from '@/features/Auth'
setAuthToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
```

---

## 📊 **Отличия от предыдущей версии:**

| Аспект | До (Phone Auth) | После (Telegram) |
|--------|-----------------|------------------|
| **Auth Method** | Phone + Code | initData → JWT |
| **User Flow** | Ручной вход | Автоматический |
| **User Data Source** | API /auth/me | JWT decode |
| **State Management** | React Query | Простой useState |
| **Login UI** | LoginPage формы | Нет форм |
| **Logout** | API call | Clear localStorage |

---

## ✅ **Checklist:**

- [x] @tma.js/sdk-react установлен
- [x] exchangeInitDataForJwt реализован
- [x] JWT decoder создан
- [x] useAuth адаптирован под JWT
- [x] ProtectedRoute работает
- [x] tokenStorage обновлен
- [x] Bootstrap в main.tsx
- [x] Документация обновлена

---

## 🚀 **Следующие шаги:**

1. **Тестирование:**
   - Запустить в Telegram Bot Father
   - Проверить initData exchange
   - Проверить роли (user, partner, superadmin)

2. **UI/UX:**
   - Добавить loading при bootstrap
   - Добавить error handling UI
   - Splash screen для Telegram

3. **Advanced:**
   - JWT refresh mechanism
   - Offline support
   - Analytics integration

---

## 💡 **Pro Tips:**

### **1. Telegram WebApp готовность:**

```tsx
import { useWebApp } from '@tma.js/sdk-react'

const webApp = useWebApp()
webApp.ready() // Уведомляет Telegram о готовности
webApp.expand() // Раз ворачивает на весь экран
```

### **2. Haptic Feedback:**

```tsx
webApp.HapticFeedback.impactOccurred('medium')
```

### **3. BackButton:**

```tsx
webApp.BackButton.show()
webApp.BackButton.onClick(() => navigate(-1))
```

---

**Готово!** 🎉 Telegram Mini App Auth полностью интегрирован!
