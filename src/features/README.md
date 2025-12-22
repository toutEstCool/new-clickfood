# Features Layer (Слой фич)

## 📋 Назначение

Слой **features** содержит функциональность приложения - действия, которые несут ценность для пользователя:
- Добавить товар в корзину
- Авторизоваться
- Отфильтровать список
- Поставить лайк
- Оставить отзыв

> **Главный принцип:** Одна фича = одно действие пользователя

## 📁 Структура фичи

```
features/
├── add-to-cart/              # Фича: добавление в корзину
│   ├── model/               # Бизнес-логика
│   │   ├── useAddToCart.ts
│   │   └── index.ts
│   ├── ui/                  # UI компоненты
│   │   ├── AddToCartButton.tsx
│   │   └── AddToCartButton.module.css
│   ├── api/                 # API запросы (опционально)
│   │   └── addToCartApi.ts
│   └── index.ts             # Public API
├── auth/                    # Фича: авторизация
├── search/                  # Фича: поиск
└── README.md
```

## 🎯 Принципы

1. **Одна фича = одно действие** - добавить в корзину, авторизоваться, etc.
2. **Бизнес-ценность** - фича должна нести пользу для пользователя
3. **Независимость** - фича не должна зависеть от других фич
4. **Public API** - наружу экспортируем только необходимое

## 💡 Примеры использования

### Пример 1: Добавление в корзину (Add to Cart)

```tsx
// features/add-to-cart/model/useAddToCart.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCartApi } from '../api/addToCartApi';
import { showNotification } from '@/shared/lib/notifications';

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (productId: string) => addToCartApi(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showNotification({
        type: 'success',
        message: 'Товар добавлен в корзину',
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: 'Не удалось добавить товар',
      });
    },
  });

  return {
    addToCart: mutation.mutate,
    isLoading: mutation.isPending,
  };
};
```

```tsx
// features/add-to-cart/ui/AddToCartButton.tsx
import { useAddToCart } from '../model/useAddToCart';
import { Button } from '@/shared/ui/button';
import { ShoppingCartIcon } from '@/shared/ui/icons';
import styles from './AddToCartButton.module.css';

interface AddToCartButtonProps {
  productId: string;
  className?: string;
}

export const AddToCartButton = ({ 
  productId, 
  className 
}: AddToCartButtonProps) => {
  const { addToCart, isLoading } = useAddToCart();

  return (
    <Button
      className={className}
      onClick={() => addToCart(productId)}
      loading={isLoading}
      icon={<ShoppingCartIcon />}
    >
      В корзину
    </Button>
  );
};
```

```ts
// features/add-to-cart/api/addToCartApi.ts
import { api } from '@/shared/api';

export const addToCartApi = async (productId: string) => {
  const response = await api.post('/cart/items', { productId });
  return response.data;
};
```

```ts
// features/add-to-cart/index.ts
export { AddToCartButton } from './ui/AddToCartButton';
export { useAddToCart } from './model/useAddToCart';
```

### Пример 2: Авторизация по номеру телефона

```tsx
// features/auth/model/useAuth.ts
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendCodeApi, verifyCodeApi } from '../api/authApi';

type AuthStep = 'phone' | 'code' | 'success';

export const useAuth = () => {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');

  const sendCode = useMutation({
    mutationFn: (phoneNumber: string) => sendCodeApi(phoneNumber),
    onSuccess: () => {
      setStep('code');
    },
  });

  const verifyCode = useMutation({
    mutationFn: (code: string) => verifyCodeApi(phone, code),
    onSuccess: () => {
      setStep('success');
    },
  });

  return {
    step,
    phone,
    setPhone,
    sendCode: sendCode.mutate,
    verifyCode: verifyCode.mutate,
    isLoading: sendCode.isPending || verifyCode.isPending,
  };
};
```

```tsx
// features/auth/ui/AuthModal.tsx
import { useAuth } from '../model/useAuth';
import { Modal } from '@/shared/ui/modal';
import { PhoneInput } from '@/shared/ui/phone-input';
import { CodeInput } from '@/shared/ui/code-input';
import { Button } from '@/shared/ui/button';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { 
    step, 
    phone, 
    setPhone, 
    sendCode, 
    verifyCode, 
    isLoading 
  } = useAuth();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modal}>
        <h2>Вход</h2>
        
        {step === 'phone' && (
          <>
            <PhoneInput 
              value={phone} 
              onChange={setPhone} 
            />
            <Button 
              onClick={() => sendCode(phone)}
              loading={isLoading}
              fullWidth
            >
              Получить код
            </Button>
          </>
        )}
        
        {step === 'code' && (
          <>
            <p>Введите код из SMS</p>
            <CodeInput 
              length={4}
              onComplete={verifyCode}
            />
          </>
        )}
        
        {step === 'success' && (
          <p>Вы успешно авторизованы!</p>
        )}
      </div>
    </Modal>
  );
};
```

### Пример 3: Поиск с дебаунсом

```tsx
// features/search/model/useSearch.ts
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchProductsApi } from '../api/searchApi';
import { useDebounce } from '@/shared/lib/hooks';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchProductsApi(debouncedQuery),
    enabled: debouncedQuery.length > 2,
  });

  return {
    query,
    setQuery,
    results: results || [],
    isLoading,
  };
};
```

```tsx
// features/search/ui/SearchBar.tsx
import { useSearch } from '../model/useSearch';
import { Input } from '@/shared/ui/input';
import { SearchIcon } from '@/shared/ui/icons';
import { SearchResults } from './SearchResults';
import styles from './SearchBar.module.css';

export const SearchBar = () => {
  const { query, setQuery, results, isLoading } = useSearch();

  return (
    <div className={styles.search}>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск товаров..."
        icon={<SearchIcon />}
      />
      
      {query && (
        <SearchResults 
          results={results}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
```

### Пример 4: Toggle фича (Избранное)

```tsx
// features/toggle-favorite/model/useFavorite.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleFavoriteApi } from '../api/favoriteApi';
import { useFavorites } from '@/entities/favorite';

export const useFavorite = (productId: string) => {
  const queryClient = useQueryClient();
  const { favorites } = useFavorites();
  
  const isFavorite = favorites.includes(productId);

  const mutation = useMutation({
    mutationFn: () => toggleFavoriteApi(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  return {
    isFavorite,
    toggle: mutation.mutate,
    isLoading: mutation.isPending,
  };
};
```

```tsx
// features/toggle-favorite/ui/FavoriteButton.tsx
import { useFavorite } from '../model/useFavorite';
import { IconButton } from '@/shared/ui/icon-button';
import { HeartIcon } from '@/shared/ui/icons';
import styles from './FavoriteButton.module.css';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
}

export const FavoriteButton = ({ 
  productId, 
  className 
}: FavoriteButtonProps) => {
  const { isFavorite, toggle, isLoading } = useFavorite(productId);

  return (
    <IconButton
      className={className}
      onClick={toggle}
      disabled={isLoading}
      aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
    >
      <HeartIcon 
        filled={isFavorite}
        className={isFavorite ? styles.active : ''}
      />
    </IconButton>
  );
};
```

### Пример 5: Форма с валидацией

```tsx
// features/leave-review/model/useReviewForm.ts
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitReviewApi } from '../api/reviewApi';
import { validateReview } from '../lib/validation';

interface ReviewFormData {
  rating: number;
  text: string;
  author: string;
}

export const useReviewForm = (productId: string) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    text: '',
    author: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: () => submitReviewApi(productId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      setFormData({ rating: 0, text: '', author: '' });
    },
  });

  const handleSubmit = () => {
    const validationErrors = validateReview(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    mutation.mutate();
  };

  return {
    formData,
    setFormData,
    errors,
    handleSubmit,
    isLoading: mutation.isPending,
  };
};
```

## 🤔 Фича или не фича?

### ✅ Это фича:

- ✅ **Добавить в корзину** - действие пользователя
- ✅ **Авторизоваться** - пользовательский сценарий
- ✅ **Отфильтровать товары** - взаимодействие
- ✅ **Поставить лайк** - действие
- ✅ **Оставить отзыв** - функциональность

### ❌ Это НЕ фича:

- ❌ **Кнопка** - это UI компонент → `shared/ui`
- ❌ **Товар** - это сущность → `entities/product`
- ❌ **Список товаров** - это виджет → `widgets`
- ❌ **API клиент** - это утилита → `shared/api`

## ⚠️ Что НЕ должно быть в features

- ❌ Зависимости от других фич
- ❌ Прямой доступ к глобальному стейту (только через entities)
- ❌ Универсальные UI компоненты

## ✅ Что ДОЛЖНО быть в features

- ✅ Бизнес-логика действия
- ✅ UI для выполнения действия
- ✅ Валидация
- ✅ Обработка ошибок

## 🔄 Взаимодействие с другими слоями

```
features
   ↓ импортирует
entities + shared
   ↑ НЕ импортирует
pages, widgets, другие features
```

## 📝 Naming Convention

- Папка: глагол в инфинитиве `add-to-cart`, `toggle-favorite`
- Компонент: существительное `AddToCartButton`, `FavoriteButton`
- Хук: `use` + название фичи `useAddToCart`, `useFavorite`
