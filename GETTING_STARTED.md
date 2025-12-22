# 🎯 С чего начать разработку?

Этот файл поможет вам быстро начать работу с проектом на FSD.

## ✅ Проект готов!

Структура создана, примеры добавлены, документация написана. Что дальше?

## 📋 Шаг 1: Изучите структуру

Откройте [`src/README.md`](./src/README.md) и познакомьтесь с архитектурой FSD.

Кратко:
- **app** - инициализация (провайдеры, роутинг, глобальные стили)
- **pages** - страницы приложения
- **widgets** - крупные UI блоки (header, product-card)
- **features** - действия пользователя (add-to-cart, auth)
- **entities** - данные (product, user, cart)
- **shared** - переиспользуемый код (UI kit, утилиты)

## 📚 Шаг 2: Изучите примеры

Уже созданы примеры в `src/shared/`:

### 🎨 UI компонент
```tsx
// src/shared/ui/button/Button.tsx
import { Button } from '@/shared/ui/button';

<Button variant="primary">Нажми меня</Button>
```

### 🪝 Хук
```tsx
// src/shared/lib/hooks/useDebounce.ts
import { useDebounce } from '@/shared/lib/hooks/useDebounce';

const debouncedSearch = useDebounce(search, 500);
```

### 🔧 Утилита
```tsx
// src/shared/lib/utils/format.ts
import { formatPrice } from '@/shared/lib/utils/format';

formatPrice(1500); // "1 500 ₽"
```

### 🌐 API клиент
```tsx
// src/shared/api/instance.ts
import { api } from '@/shared/api';

const response = await api.get('/products');
```

## 🚀 Шаг 3: Создайте свою первую сущность

Давайте создадим сущность **Product** (товар).

### 3.1 Создайте типы

```tsx
// src/entities/product/model/types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}
```

### 3.2 Создайте API

```tsx
// src/entities/product/api/productApi.ts
import { api } from '@/shared/api';
import { Product } from '../model/types';

export const productApi = {
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },
  
  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};
```

### 3.3 Создайте хуки (если используете React Query)

```tsx
// src/entities/product/model/hooks.ts
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/productApi';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getProducts(),
  });
};
```

### 3.4 Экспортируйте Public API

```tsx
// src/entities/product/index.ts
export type { Product } from './model/types';
export { useProducts } from './model/hooks';
export { productApi } from './api/productApi';
```

## ⚡️ Шаг 4: Создайте фичу

Создадим фичу "Добавить в корзину".

### 4.1 Создайте логику

```tsx
// src/features/add-to-cart/model/useAddToCart.ts
import { useState } from 'react';

export const useAddToCart = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = async (productId: string) => {
    setIsLoading(true);
    try {
      // Логика добавления в корзину
      console.log('Добавлен товар:', productId);
    } finally {
      setIsLoading(false);
    }
  };

  return { addToCart, isLoading };
};
```

### 4.2 Создайте UI

```tsx
// src/features/add-to-cart/ui/AddToCartButton.tsx
import { useAddToCart } from '../model/useAddToCart';
import { Button } from '@/shared/ui/button';

interface Props {
  productId: string;
}

export const AddToCartButton = ({ productId }: Props) => {
  const { addToCart, isLoading } = useAddToCart();

  return (
    <Button 
      onClick={() => addToCart(productId)}
      loading={isLoading}
    >
      В корзину
    </Button>
  );
};
```

### 4.3 Экспортируйте

```tsx
// src/features/add-to-cart/index.ts
export { AddToCartButton } from './ui/AddToCartButton';
```

## 🧩 Шаг 5: Создайте виджет

Соберем карточку товара из фичи и сущности.

```tsx
// src/widgets/product-card/ui/ProductCard.tsx
import { Product } from '@/entities/product';
import { AddToCartButton } from '@/features/add-to-cart';
import { formatPrice } from '@/shared/lib/utils/format';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  return (
    <article className={styles.card}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className={styles.price}>{formatPrice(product.price)}</p>
      <AddToCartButton productId={product.id} />
    </article>
  );
};
```

## 📄 Шаг 6: Создайте страницу

```tsx
// src/pages/home/ui/HomePage.tsx
import { useProducts } from '@/entities/product';
import { ProductCard } from '@/widgets/product-card';

export const HomePage = () => {
  const { data: products, isLoading } = useProducts();

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Товары</h1>
      <div className="products-grid">
        {products?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
```

## 🎨 Шаг 7: Добавьте роутинг (опционально)

```bash
pnpm add react-router-dom
```

```tsx
// src/app/providers/RouterProvider.tsx
import { BrowserRouter } from 'react-router-dom';
import { ReactNode } from 'react';

export const RouterProvider = ({ children }: { children: ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};
```

```tsx
// src/app/router/AppRouter.tsx
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/home';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};
```

## 📚 Рекомендуемые библиотеки

### State Management
- **Zustand** - простой и легкий
- **Redux Toolkit** - для крупных приложений

```bash
pnpm add zustand
```

### Data Fetching
- **TanStack Query (React Query)** - лучший выбор!

```bash
pnpm add @tanstack/react-query
```

### Роутинг
- **React Router** - стандарт

```bash
pnpm add react-router-dom
```

### Формы
- **React Hook Form** - производительные формы

```bash
pnpm add react-hook-form
```

### UI библиотеки (опционально)
- **Radix UI** - headless компоненты
- **shadcn/ui** - красивые компоненты

## 🎓 Полезные ссылки

- 📖 [FSD документация](https://feature-sliced.design/)
- 🎥 [FSD видео-курс](https://www.youtube.com/playlist?list=PLYyPcR0PAuL6-p84SMk9kqEJp3k9xKqYZ)
- 💬 [FSD Telegram](https://t.me/feature_sliced)
- 📘 [React Query](https://tanstack.com/query)
- 🐻 [Zustand](https://zustand-demo.pmnd.rs/)

## ✅ Чек-лист перед началом

- [ ] Прочитал `src/README.md`
- [ ] Изучил примеры в `src/shared/`
- [ ] Понял правило импортов (app → pages → widgets → features → entities → shared)
- [ ] Установил дополнительные библиотеки (если нужно)
- [ ] Готов создавать свои сущности и фичи!

---

**Удачи в разработке!** 🚀

Если возникнут вопросы - каждый слой имеет свою подробную документацию с примерами в `README.md`.
