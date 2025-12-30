# 🧪 Руководство по тестированию авторизации

## Текущая реализация

Ваша авторизация работает через JWT токены для Telegram Mini App:
- **Backend**: `https://stage.clickfood.pro/api/v2/jwt`
- **User ID**: Статический `1212753058` (для разработки)
- **Хранение**: `localStorage` под ключом `clickfood_jwt_token`

---

## Способ 1: Тестирование через DevTools Console

### Шаг 1: Откройте приложение
```bash
pnpm run dev
```
Откройте `http://localhost:5173` в браузере

### Шаг 2: Откройте DevTools Console (F12)

### Шаг 3: Проверьте текущий статус авторизации
```javascript
// Проверить наличие токена
localStorage.getItem('clickfood_jwt_token')

// Если токена нет, можно вручную получить его
```

### Шаг 4: Вручную получить JWT токен
```javascript
// Вариант A: Через fetch
fetch('https://stage.clickfood.pro/api/v2/jwt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    init_data: '',
    source: 'test',
    user_id: 1212753058
  })
})
.then(r => r.json())
.then(data => {
  console.log('JWT Response:', data)
  localStorage.setItem('clickfood_jwt_token', data.token)
  window.dispatchEvent(new Event('storage'))
  location.reload()
})
```

### Шаг 5: Проверить декодированный токен
```javascript
// Декодировать JWT
const token = localStorage.getItem('clickfood_jwt_token')
const payload = JSON.parse(atob(token.split('.')[1]))
console.log('JWT Payload:', payload)
```

### Шаг 6: Проверить данные пользователя в React DevTools
1. Установите React DevTools
2. Найдите компонент с `useAuth()`
3. Проверьте значения `user`, `isAuth`, `token`

---

## Способ 2: Создать тестовую страницу

### Создайте файл для тестирования
```tsx
// src/pages/TestAuth.tsx
import { useAuth } from '@/features/Auth'
import { exchangeInitDataForJwt } from '@/entities/User/api/telegramAuth'

export const TestAuthPage = () => {
  const { user, isAuth, token, logout, hasRole } = useAuth()

  const handleLogin = async () => {
    try {
      await exchangeInitDataForJwt('', 'manual-test')
      window.location.reload()
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1>🔐 Auth Test Page</h1>
      
      <div style={{ marginTop: '20px', padding: '20px', background: '#f5f5f5' }}>
        <h2>Current Status</h2>
        <p><strong>Authenticated:</strong> {isAuth ? '✅ Yes' : '❌ No'}</p>
        <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
        <p><strong>Role:</strong> {user?.role || 'N/A'}</p>
        <p><strong>Source:</strong> {user?.source || 'N/A'}</p>
        <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'N/A'}</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Actions</h2>
        {!isAuth ? (
          <button 
            onClick={handleLogin}
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            🔑 Login (Get JWT)
          </button>
        ) : (
          <>
            <button 
              onClick={logout}
              style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px' }}
            >
              🚪 Logout
            </button>
            <button 
              onClick={() => console.log('Has ADMIN role:', hasRole('ADMIN'))}
              style={{ padding: '10px 20px', fontSize: '16px' }}
            >
              🔍 Check Role
            </button>
          </>
        )}
      </div>

      {token && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#e8f5e9' }}>
          <h2>Decoded JWT</h2>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(
              JSON.parse(atob(token.split('.')[1])),
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  )
}
```

### Добавьте роут в ваш роутер
```tsx
// В вашем роутере добавьте:
{
  path: '/test-auth',
  element: <TestAuthPage />
}
```

Затем откройте `http://localhost:5173/test-auth`

---

## Способ 3: Тестирование через curl

### Получить токен
```bash
curl -X POST https://stage.clickfood.pro/api/v2/jwt \
  -H "Content-Type: application/json" \
  -d '{
    "init_data": "",
    "source": "curl-test",
    "user_id": 1212753058
  }'
```

### Декодировать JWT (в консоли)
```bash
# Скопируйте токен из ответа
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Декодируйте payload (средняя часть)
echo $TOKEN | cut -d. -f2 | base64 -d | jq
```

---

## Способ 4: Проверка API запросов с токеном

### В DevTools Console
```javascript
// Проверить, что токен добавляется к запросам
const token = localStorage.getItem('clickfood_jwt_token')

fetch('https://stage.clickfood.pro/api/v2/some-endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(console.log)
```

---

## Чек-лист тестирования

- [ ] Токен сохраняется в localStorage при получении
- [ ] `useAuth()` возвращает корректные данные пользователя
- [ ] `isAuth` = `true` когда токен валиден
- [ ] `logout()` очищает токен и редиректит на главную
- [ ] Axios автоматически добавляет `Authorization` header
- [ ] При 401 ошибке происходит редирект на `/login`
- [ ] Токен синхронизируется между вкладками
- [ ] `hasRole()` корректно проверяет роли
- [ ] Истекший токен (`exp`) корректно обрабатывается

---

## Известные ограничения

1. **Статический user_id**: Сейчас используется `1212753058` для всех запросов
   - Для production нужно извлекать реальный `user_id` из Telegram `initData`

2. **initData пустой в dev**: Вне Telegram Mini App `initData` будет пустым
   - Сервер должен обрабатывать такие случаи для разработки

3. **Нет refresh token**: Используется только JWT без механизма обновления
   - При истечении токена нужно заново получать JWT

---

## Troubleshooting

### Проблема: "useAuth must be used within an AuthProvider"
**Решение**: Убедитесь, что компонент обернут в `<AuthProvider>`

### Проблема: Токен не сохраняется
**Решение**: Проверьте консоль на ошибки, убедитесь что сервер возвращает `{ token: "..." }`

### Проблема: 401 Unauthorized
**Решение**: 
1. Проверьте что токен не истек
2. Проверьте что токен корректно добавляется в header
3. Проверьте формат: `Authorization: Bearer <token>`

### Проблема: user = null при наличии токена
**Решение**:
1. Проверьте что токен не истек (`exp`)
2. Проверьте что payload содержит `user_id`
3. Проверьте консоль на ошибки декодирования
