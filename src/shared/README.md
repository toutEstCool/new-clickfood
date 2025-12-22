# Shared Layer (Общий слой)

## 📋 Назначение

Слой **shared** содержит переиспользуемый код, который не имеет привязки к бизнес-логике:
- UI Kit - базовые компоненты интерфейса
- Утилиты - вспомогательные функции
- API клиент - базовая настройка
- Константы и конфигурация
- Типы - общие TypeScript типы
- Ассеты - изображения, иконки, шрифты

> **Главное:** Shared не знает о бизнес-логике приложения

## 📁 Структура

```
shared/
├── ui/                      # UI компоненты
│   ├── button/
│   ├── input/
│   ├── modal/
│   └── ...
├── lib/                     # Утилиты и хелперы
│   ├── hooks/              # Общие React хуки
│   ├── utils/              # Вспомогательные функции
│   └── constants/          # Константы
├── api/                    # API клиент
│   ├── instance.ts         # Axios instance
│   ├── types.ts            # API типы
│   └── index.ts
├── config/                 # Конфигурация
│   ├── env.ts             # Переменные окружения
│   └── routes.ts          # Маршруты
├── types/                  # Общие TypeScript типы
│   ├── common.ts
│   └── index.ts
├── assets/                 # Статические ресурсы
│   ├── images/
│   ├── icons/
│   └── fonts/
└── README.md
```

## 💡 Примеры: UI компоненты

### Пример 1: Button (Кнопка)

```tsx
// shared/ui/button/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`
        ${styles.button}
        ${styles[variant]}
        ${styles[size]}
        ${fullWidth ? styles.fullWidth : ''}
        ${className || ''}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className={styles.spinner} />}
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};
```

```ts
// shared/ui/button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

### Пример 2: Input (Поле ввода)

```tsx
// shared/ui/input/Input.tsx
import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  helperText,
  className,
  ...props
}, ref) => {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {icon && (
          <span className={styles.icon}>{icon}</span>
        )}
        <input
          ref={ref}
          className={`
            ${styles.input}
            ${error ? styles.error : ''}
            ${icon ? styles.withIcon : ''}
            ${className || ''}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <span className={styles.errorText}>{error}</span>
      )}
      
      {helperText && !error && (
        <span className={styles.helperText}>{helperText}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
```

### Пример 3: Modal (Модальное окно)

```tsx
// shared/ui/modal/Modal.tsx
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
}: ModalProps) => {
  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${styles[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className={styles.header}>
            <h2>{title}</h2>
            <button className={styles.close} onClick={onClose}>
              ✕
            </button>
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body
  );
};
```

## 💡 Примеры: Lib (Утилиты)

### Пример 4: Custom Hooks

```ts
// shared/lib/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

```ts
// shared/lib/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  // Получаем значение из localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Сохраняем в localStorage при изменении
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};
```

```ts
// shared/lib/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Использование
// const isMobile = useMediaQuery('(max-width: 768px)');
```

### Пример 5: Utility Functions

```ts
// shared/lib/utils/format.ts

// Форматирование цены
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

// Форматирование даты
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};

// Склонение числительных
export const pluralize = (
  count: number,
  one: string,
  few: string,
  many: string
): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
};

// Пример: pluralize(5, 'товар', 'товара', 'товаров') => 'товаров'
```

```ts
// shared/lib/utils/validation.ts

// Валидация email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Валидация телефона
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
  return phoneRegex.test(phone);
};

// Форматирование телефона
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
  
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }
  
  return phone;
};
```

```ts
// shared/lib/utils/cn.ts (classnames utility)

// Утилита для объединения классов
type ClassValue = string | number | boolean | undefined | null;

export const cn = (...classes: ClassValue[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Использование:
// cn('base', isActive && 'active', styles.button) => 'base active button_hash'
```

### Пример 6: Constants

```ts
// shared/lib/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  PRODUCT: (id: string) => `/product/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  PROFILE: '/profile',
  ORDERS: '/orders',
  ORDER: (id: string) => `/orders/${id}`,
} as const;
```

```ts
// shared/lib/constants/api.ts
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT: (id: string) => `/products/${id}`,
  CATEGORIES: '/categories',
  CART: '/cart',
  ORDERS: '/orders',
  USER: '/user',
  AUTH: {
    SEND_CODE: '/auth/send-code',
    VERIFY_CODE: '/auth/verify-code',
    LOGOUT: '/auth/logout',
  },
} as const;
```

## 💡 Примеры: API

```ts
// shared/api/instance.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

```ts
// shared/api/types.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

## 💡 Примеры: Config

```ts
// shared/config/env.ts
export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;
```

## 💡 Примеры: Types

```ts
// shared/types/common.ts

// Общие типы для всего приложения
export type ID = string;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncData<T> {
  data: Nullable<T>;
  loading: boolean;
  error: Nullable<string>;
}
```

## 🎯 Принципы Shared

1. **Переиспользуемость** - код должен использоваться минимум в 2-х местах
2. **Независимость** - не должно быть бизнес-логики
3. **Универсальность** - подходит для любого проекта

## ⚠️ Что НЕ должно быть в shared

- ❌ Бизнес-логика
- ❌ Знание о сущностях (Product, User, etc.)
- ❌ Знание о фичах
- ❌ Одноразовый код

## ✅ Что ДОЛЖНО быть в shared

- ✅ UI Kit компоненты
- ✅ Хелперы и утилиты
- ✅ Общие хуки
- ✅ API клиент
- ✅ Константы
- ✅ Типы

## 📝 Naming Convention

- UI компоненты: `PascalCase` (Button, Input, Modal)
- Хуки: `use` + имя (useDebounce, useLocalStorage)
- Утилиты: `camelCase` (formatPrice, isValidEmail)
- Константы: `UPPER_SNAKE_CASE` (API_URL, ROUTES)
