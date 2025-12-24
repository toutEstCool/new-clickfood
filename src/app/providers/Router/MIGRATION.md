# 🚀 Migration Guide: Переход на новый роутинг

## Шаг 1: Подготовка (5 мин)

1. **Сделайте бэкап** текущих файлов:
   ```bash
   git checkout -b feature/router-refactoring
   git add .
   git commit -m "Backup before router refactoring"
   ```

2. **Убедитесь, что все тесты проходят**:
   ```bash
   npm test
   ```

## Шаг 2: Обновление импортов (2 мин)

### Обновите `App.tsx` или главный файл приложения:

```tsx
// Было:
import AppRouter from '@/app/providers/Router/ui/AppRouter'

// Стало:
import AppRouter from '@/app/providers/Router/ui/AppRouterNew'
import { ScrollToTop } from '@/app/providers/Router/utils/ScrollToTop'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />  {/* Опционально, но рекомендуется */}
      <AppRouter />
    </BrowserRouter>
  )
}
```

## Шаг 3: Подключение Auth контекста (10 мин)

### Обновите ProtectedRoute и PublicRoute:

```tsx
// src/app/providers/Router/guards/ProtectedRoute.tsx

import { useAuth } from '@/shared/contexts/AuthContext' // Ваш auth context

export const ProtectedRoute = ({ roles, redirectTo = getRouteMain() }: ProtectedRouteProps) => {
  const location = useLocation()
  
  // Замените эти строки:
  // const isAuth = false
  // const userRole: UserRole | null = null
  
  // На:
  const { isAuth, user } = useAuth()
  const userRole = user?.role || null

  // ... остальной код остается без изменений
}
```

## Шаг 4: Создание реальных страниц (по мере необходимости)

Сейчас используются временные компоненты `TempPage`. Заменяйте их постепенно:

### Пример: Создание страницы партнера

```tsx
// src/pages/PartnerHomePage/PartnerHomePage.tsx
import { FC } from 'react'

export const PartnerHomePage: FC = () => {
  // Ваша логика страницы
  return (
    <div>
      <h1>Partner Dashboard</h1>
      {/* Ваш контент */}
    </div>
  )
}

export default PartnerHomePage
```

### Обновите конфигурацию:

```tsx
// src/app/providers/Router/config/routeConfigNew.tsx

// Добавьте lazy импорт
const PartnerHomePage = lazy(() => import('@/pages/PartnerHomePage'))

// Замените в конфигурации:
{
  index: true,
  // Было: element: <TempPage title="Partner Home" />,
  element: <PartnerHomePage />,  // Стало
}
```

## Шаг 5: Тестирование (15 мин)

1. **Проверьте все роуты вручную:**
   - Публичные страницы (/)
   - WebApp секция (/webapp)
   - Superadmin секция (/webapp/superadmin)
   - Partner секция (/webapp/partner)
   - Order секция (/webapp/order)

2. **Проверьте навигацию:**
   - Прямой переход по URL
   - Клик по ссылкам
   - Программная навигация (navigate)
   - Back/Forward кнопки браузера

3. **Проверьте guards:**
   - Попробуйте зайти на защищенные роуты без авторизации
   - Попробуйте зайти на роуты с неправильной ролью
   - Проверьте редиректы

4. **Проверьте layouts:**
   - Sidebar отображается правильно
   - Header отображается правильно
   - Переключение между страницами не перерисовывает layout

## Шаг 6: Очистка (5 мин)

После успешного тестирования удалите старые файлы:

```bash
# Удалите или переименуйте старые файлы
mv src/app/providers/Router/config/routeConfig.tsx src/app/providers/Router/config/routeConfig.old.tsx
mv src/app/providers/Router/ui/AppRouter.tsx src/app/providers/Router/ui/AppRouter.old.tsx
mv src/app/providers/Router/guards/AuthGuard.tsx src/app/providers/Router/guards/AuthGuard.old.tsx

# После полного тестирования удалите .old файлы
# rm src/app/providers/Router/config/routeConfig.old.tsx
# rm src/app/providers/Router/ui/AppRouter.old.tsx
# rm src/app/providers/Router/guards/AuthGuard.old.tsx
```

## Шаг 7: Переименование (2 мин)

Уберите суффикс "New" из файлов:

```bash
# Переименуйте файлы
mv src/app/providers/Router/config/routeConfigNew.tsx src/app/providers/Router/config/routeConfig.tsx
mv src/app/providers/Router/ui/AppRouterNew.tsx src/app/providers/Router/ui/AppRouter.tsx

# Обновите импорты в App.tsx
# routeConfigNew -> routeConfig
# AppRouterNew -> AppRouter
```

## Checklist миграции

- [ ] Создана новая ветка для изменений
- [ ] Обновлены импорты в App.tsx
- [ ] Добавлен ScrollToTop
- [ ] Подключен auth context в Guards
- [ ] Созданы реальные страницы (или используются TempPage)
- [ ] Проверены все роуты
- [ ] Проверена навигация
- [ ] Проверены guards
- [ ] Проверены layouts
- [ ] Удалены старые файлы
- [ ] Переименованы новые файлы
- [ ] Все тесты проходят
- [ ] Код ревью пройден
- [ ] Изменения задеплоены на dev

## Возможные проблемы и решения

### Проблема 1: "Cannot find module '@/pages/...'"

**Решение**: Создайте отсутствующие страницы или используйте `TempPage` как заглушку:

```tsx
element: <TempPage title="Partner Home" />
```

### Проблема 2: Бесконечный редирект в guards

**Решение**: Проверьте, что `isAuth` правильно возвращается из auth context и логика в guards корректна.

### Проблема 3: Layout не применяется

**Решение**: Убедитесь, что в Layout есть `<Outlet />` и он обернут правильно в конфигурации:

```tsx
{
  element: <PartnerLayout />,  // Layout
  children: [
    { path: 'menu', element: <Menu /> }  // Будет рендериться в Outlet
  ]
}
```

### Проблема 4: Страница не перерисовывается при навигации

**Решение**: Добавьте `key` prop к роуту или проверьте, что используете `useEffect` с зависимостью от `location`.

## Поддержка

Если возникли вопросы:
1. Прочитайте [README.md](./README.md)
2. Посмотрите [EXAMPLES.md](./EXAMPLES.md)
3. Проверьте [React Router документацию](https://reactrouter.com/)

---

**Время на полную миграцию**: ~40-60 минут  
**Сложность**: 🟢 Средняя  
**Риски**: 🟢 Низкие (при следовании гайду)
