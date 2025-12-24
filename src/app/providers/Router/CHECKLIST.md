# ✅ Checklist - Внедрение нового роутинга

## 📋 Pre-Migration Checklist

- [ ] Сделан бэкап кода (git commit/branch)
- [ ] Прочитана документация:
  - [ ] README.md
  - [ ] ARCHITECTURE.md
  - [ ] EXAMPLES.md
  - [ ] MIGRATION.md
- [ ] Понятна новая структура роутинга
- [ ] Команда проинформирована о изменениях

## 🔧 Implementation Checklist

### Шаг 1: Подготовка

- [ ] Создана новая ветка: `git checkout -b feature/router-refactoring`
- [ ] Установлены зависимости: `npm install`
- [ ] Проект билдится без ошибок: `npm run build`

### Шаг 2: Интеграция Auth

- [ ] Создан/обновлен AuthContext
- [ ] Обновлен `ProtectedRoute.tsx`:
  ```tsx
  const { isAuth, user } = useAuth()
  const userRole = user?.role || null
  ```
- [ ] Обновлен `PublicRoute.tsx`:
  ```tsx
  const { isAuth } = useAuth()
  ```

### Шаг 3: Обновление App.tsx

- [ ] Импортирован новый AppRouter:
  ```tsx
  import AppRouter from '@/app/providers/Router/ui/AppRouterNew'
  ```
- [ ] Добавлен ScrollToTop:
  ```tsx
  import { ScrollToTop } from '@/app/providers/Router/utils/ScrollToTop'
  ```
- [ ] Обновлен render:
  ```tsx
  <BrowserRouter>
    <ScrollToTop />
    <AppRouter />
  </BrowserRouter>
  ```

### Шаг 4: Создание страниц

- [ ] Создана MainPage или используется TempPage
- [ ] Создана WebAppHomePage или используется TempPage
- [ ] Создана NotFoundPage или используется TempPage
- [ ] Созданы страницы Superadmin или используются TempPage
- [ ] Созданы страницы Partner или используются TempPage
- [ ] Созданы страницы Order или используются TempPage

### Шаг 5: Обновление Layouts

- [ ] Добавлена навигация в SuperadminLayout
- [ ] Добавлена навигация в PartnerLayout
- [ ] Добавлена навигация в WebAppLayout
- [ ] Добавлен stepper в OrderLayout
- [ ] Добавлены стили для layouts (опционально)

## 🧪 Testing Checklist

### Функциональное тестирование

- [ ] **Публичные роуты работают:**
  - [ ] `/` - MainPage
  - [ ] `/webapp` - WebAppHomePage
  - [ ] `/webapp/privacy-policy` - PrivacyPolicyPage
  - [ ] `/webapp/public-offer` - PublicOfferPage
  - [ ] `/404` - NotFoundPage
  - [ ] Любой несуществующий путь → редирект на `/404`

- [ ] **Защищенные роуты (Order) работают:**
  - [ ] Без авторизации → редирект на `/`
  - [ ] С авторизацией → доступ разрешен
  - [ ] `/webapp/order` - OrderRootPage
  - [ ] `/webapp/order/shops` - OrderShopsPage
  - [ ] `/webapp/order/menu` - OrderMenuPage
  - [ ] `/webapp/order/checkout` - OrderCheckoutPage

- [ ] **Роуты с ролью PARTNER работают:**
  - [ ] Без авторизации → редирект на `/`
  - [ ] С авторизацией но не PARTNER → редирект
  - [ ] С ролью PARTNER → доступ разрешен
  - [ ] `/webapp/partner` - PartnerHomePage
  - [ ] `/webapp/partner/menu/form` - PartnerMenuFormPage
  - [ ] `/webapp/partner/menu/list` - PartnerMenuListPage
  - [ ] `/webapp/partner/report` - PartnerReportPage

- [ ] **Роуты с ролью SUPERADMIN работают:**
  - [ ] Без авторизации → редирект на `/`
  - [ ] С авторизацией но не SUPERADMIN → редирект
  - [ ] С ролью SUPERADMIN → доступ разрешен
  - [ ] `/webapp/superadmin` - SuperadminHomePage
  - [ ] `/webapp/superadmin/shops` - SuperadminShopsPage
  - [ ] `/webapp/superadmin/create` - SuperadminCreatePage

### UX тестирование

- [ ] **Навигация:**
  - [ ] Клик по Link работает
  - [ ] Программная навигация (navigate) работает
  - [ ] Back button браузера работает
  - [ ] Forward button браузера работает
  - [ ] Прямой ввод URL работает

- [ ] **Loading states:**
  - [ ] При переходе показывается Loading индикатор
  - [ ] Loading не блокирует весь экран (только контент)
  - [ ] Sidebar/Header не перерисовываются

- [ ] **Scroll behavior:**
  - [ ] При переходе страница скроллится вверх
  - [ ] ScrollToTop работает корректно

- [ ] **Layouts:**
  - [ ] SuperadminLayout рендерится с sidebar
  - [ ] PartnerLayout рендерится с sidebar
  - [ ] OrderLayout рендерится со stepper
  - [ ] Layouts не перерисовываются при смене страниц

### Performance тестирование

- [ ] Lazy loading работает (проверить в Network tab)
- [ ] Code splitting по секциям (отдельные chunks)
- [ ] Нет memory leaks при навигации
- [ ] Transitions плавные

### Browser compatibility

- [ ] Chrome - работает
- [ ] Firefox - работает
- [ ] Safari - работает
- [ ] Edge - работает
- [ ] Mobile browsers - работает

## 🎨 Code Quality Checklist

- [ ] **TypeScript:**
  - [ ] Нет ошибок типизации
  - [ ] Все типы корректны
  - [ ] Нет использования `any`

- [ ] **Linting:**
  - [ ] ESLint проходит без ошибок
  - [ ] Prettier применен
  - [ ] Нет console.log в production коде

- [ ] **Best Practices:**
  - [ ] Используются Nested Routes
  - [ ] Используются Layout-компоненты с Outlet
  - [ ] Guards правильно реализованы
  - [ ] Lazy loading применен
  - [ ] Suspense boundaries установлены

- [ ] **Documentation:**
  - [ ] Добавлены JSDoc комментарии
  - [ ] README актуален
  - [ ] EXAMPLES актуален

## 📦 Deployment Checklist

- [ ] **Pre-deployment:**
  - [ ] Все тесты проходят: `npm test`
  - [ ] Production build успешен: `npm run build`
  - [ ] Bundle size приемлем
  - [ ] Нет критических warnings

- [ ] **Code Review:**
  - [ ] PR создан
  - [ ] Code review пройден
  - [ ] Все комментарии учтены
  - [ ] Approval получен

- [ ] **Deployment:**
  - [ ] Deployed на dev environment
  - [ ] Smoke tests пройдены на dev
  - [ ] Deployed на staging
  - [ ] Full tests пройдены на staging
  - [ ] Deployed на production
  - [ ] Production monitoring настроен

## 🧹 Cleanup Checklist

- [ ] **Старые файлы удалены:**
  - [ ] `routeConfig.tsx` (старый)
  - [ ] `AppRouter.tsx` (старый)
  - [ ] `AuthGuard.tsx` (старый)

- [ ] **Новые файлы переименованы:**
  - [ ] `routeConfigNew.tsx` → `routeConfig.tsx`
  - [ ] `AppRouterNew.tsx` → `AppRouter.tsx`

- [ ] **Импорты обновлены:**
  - [ ] В App.tsx
  - [ ] В других файлах если нужно

- [ ] **Git:**
  - [ ] Коммит сделан: `git commit -m "Implement new routing architecture"`
  - [ ] Пуш выполнен: `git push`
  - [ ] Старая ветка удалена (после merge)

## 📊 Metrics Checklist

- [ ] **Performance:**
  - [ ] Initial load time улучшен
  - [ ] Page transition time приемлем
  - [ ] Bundle size не увеличился значительно

- [ ] **DX (Developer Experience):**
  - [ ] Легче добавлять новые роуты
  - [ ] Меньше дублирования кода
  - [ ] Лучше читаемость

- [ ] **UX:**
  - [ ] Loading states не раздражают
  - [ ] Навигация responsive
  - [ ] Нет багов с авторизацией

## 🎓 Team Knowledge Transfer

- [ ] Документация передана команде
- [ ] Презентация проведена (если нужно)
- [ ] FAQ составлен
- [ ] Менторинг назначен для новых членов команды

## ✅ Final Sign-off

- [ ] PM approved
- [ ] Tech Lead approved
- [ ] QA approved
- [ ] Product Owner approved
- [ ] Ready for production

---

**Статус**: ⏳ В процессе  
**Последнее обновление**: _________  
**Ответственный**: _________
