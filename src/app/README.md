# App Layer (Слой приложения)

## 📋 Назначение

Слой **app** отвечает за инициализацию всего приложения. Здесь происходит:
- Подключение глобальных провайдеров (роутинг, стейт-менеджмент, темы)
- Настройка глобальных стилей
- Инициализация приложения

## 📁 Структура

```
app/
├── providers/          # React-провайдеры (Router, Query, Theme, etc.)
│   ├── RouterProvider.tsx
│   ├── ThemeProvider.tsx
│   └── index.ts
├── styles/            # Глобальные стили
│   ├── global.css
│   ├── reset.css
│   └── variables.css
├── App.tsx           # Корневой компонент приложения
└── README.md         # Эта документация
```

## 🎯 Принципы

1. **Только инициализация** - никакой бизнес-логики
2. **Композиция провайдеров** - оборачиваем приложение в необходимые контексты
3. **Глобальные стили** - применяются ко всему приложению

## 💡 Примеры использования

### Пример 1: Создание провайдера роутинга

```tsx
// app/providers/RouterProvider.tsx
import { BrowserRouter } from 'react-router-dom';
import { ReactNode } from 'react';

interface RouterProviderProps {
  children: ReactNode;
}

export const RouterProvider = ({ children }: RouterProviderProps) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};
```

### Пример 2: Композиция провайдеров

```tsx
// app/providers/index.ts
import { ReactNode } from 'react';
import { RouterProvider } from './RouterProvider';
import { ThemeProvider } from './ThemeProvider';
import { QueryProvider } from './QueryProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <RouterProvider>
      <QueryProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryProvider>
    </RouterProvider>
  );
};
```

### Пример 3: Главный файл приложения

```tsx
// app/App.tsx
import { AppProviders } from './providers';
import { AppRouter } from './router';
import './styles/global.css';

export const App = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};
```

### Пример 4: Глобальные CSS переменные

```css
/* app/styles/variables.css */
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-success: #10b981;
  --color-error: #ef4444;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
}
```

## ⚠️ Что НЕ должно быть в app

- ❌ Бизнес-логика
- ❌ Компоненты UI
- ❌ Фичи приложения
- ❌ API запросы

## ✅ Что ДОЛЖНО быть в app

- ✅ Провайдеры
- ✅ Глобальные стили
- ✅ Инициализация приложения
- ✅ Роутинг (конфигурация маршрутов)
