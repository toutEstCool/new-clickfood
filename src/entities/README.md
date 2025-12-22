# Entities Layer (Слой сущностей)

## 📋 Назначение

Слой **entities** содержит бизнес-сущности приложения:
- Модели данных (types/interfaces)
- Хранилище данных (state management)
- API методы для работы с сущностью
- Селекторы и хуки для доступа к данным

> **Главное:** Entities описывают "ЧТО есть в приложении", а не "ЧТО с этим делать"

## 📁 Структура сущности

```
entities/
├── product/                  # Сущность: Товар
│   ├── model/               # Бизнес-логика
│   │   ├── types.ts        # Типы и интерфейсы
│   │   ├── store.ts        # State (опционально)
│   │   ├── hooks.ts        # Хуки для работы с данными
│   │   └── index.ts
│   ├── api/                # API методы
│   │   ├── productApi.ts
│   │   └── index.ts
│   ├── ui/                 # UI компоненты (опционально)
│   │   └── ProductSkeleton.tsx
│   └── index.ts            # Public API
├── user/                   # Сущность: Пользователь
├── cart/                   # Сущность: Корзина
└── README.md
```

## 🎯 Принципы

1. **Бизнес-сущность** - описывает реальный объект предметной области
2. **Переиспользуемость** - используется в разных фичах и виджетах
3. **Независимость** - не зависит от фич и страниц
4. **Единственный источник правды** - все данные о сущности здесь

## 💡 Примеры использования

### Пример 1: Сущность Product (Товар)

```ts
// entities/product/model/types.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  categoryId: string;
  inStock: boolean;
  vendor: string;
  createdAt: string;
}

export interface ProductsFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}
```

```ts
// entities/product/api/productApi.ts
import { api } from '@/shared/api';
import { Product, ProductsFilters } from '../model/types';

export const productApi = {
  // Получить список товаров
  getProducts: async (filters?: ProductsFilters): Promise<Product[]> => {
    const response = await api.get('/products', { params: filters });
    return response.data;
  },

  // Получить товар по ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Получить похожие товары
  getSimilarProducts: async (id: string): Promise<Product[]> => {
    const response = await api.get(`/products/${id}/similar`);
    return response.data;
  },
};
```

```ts
// entities/product/model/hooks.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import { Product, ProductsFilters } from './types';

// Получить список товаров
export const useProducts = (filters?: ProductsFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productApi.getProducts(filters),
  });
};

// Получить товар по ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProduct(id),
    enabled: !!id,
  });
};

// Получить похожие товары
export const useSimilarProducts = (id: string) => {
  return useQuery({
    queryKey: ['products', 'similar', id],
    queryFn: () => productApi.getSimilarProducts(id),
    enabled: !!id,
  });
};

// Префетч товара (для оптимизации)
export const usePrefetchProduct = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ['product', id],
      queryFn: () => productApi.getProduct(id),
    });
  };
};
```

```ts
// entities/product/index.ts
export type { Product, ProductsFilters } from './model/types';
export { useProducts, useProduct, useSimilarProducts } from './model/hooks';
export { productApi } from './api/productApi';
```

### Пример 2: Сущность User (Пользователь)

```ts
// entities/user/model/types.ts
export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  avatar?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  street: string;
  house: string;
  apartment?: string;
  floor?: number;
  entrance?: string;
  comment?: string;
  isDefault: boolean;
}
```

```ts
// entities/user/model/store.ts (используя Zustand)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'user-storage',
    }
  )
);
```

```ts
// entities/user/model/hooks.ts
import { useUserStore } from './store';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/userApi';

// Получить текущего пользователя из стора
export const useUser = () => {
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const setUser = useUserStore((state) => state.setUser);
  const logout = useUserStore((state) => state.logout);

  return {
    user,
    isAuthenticated,
    setUser,
    logout,
  };
};

// Загрузить данные пользователя с сервера
export const useUserProfile = () => {
  const { isAuthenticated } = useUser();
  
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userApi.getProfile(),
    enabled: isAuthenticated,
  });
};
```

### Пример 3: Сущность Cart (Корзина)

```ts
// entities/cart/model/types.ts
import { Product } from '@/entities/product';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemsCount: number;
}
```

```ts
// entities/cart/model/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './types';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (item) => set((state) => ({
        items: [...state.items, item],
      })),
      
      removeItem: (itemId) => set((state) => ({
        items: state.items.filter(item => item.id !== itemId),
      })),
      
      updateQuantity: (itemId, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      })),
      
      clear: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

```ts
// entities/cart/model/hooks.ts
import { useMemo } from 'react';
import { useCartStore } from './store';

export const useCart = () => {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clear = useCartStore((state) => state.clear);

  // Вычисляемые значения
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const itemsCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return {
    items,
    total,
    itemsCount,
    addItem,
    removeItem,
    updateQuantity,
    clear,
  };
};
```

### Пример 4: Сущность Category (Категория)

```ts
// entities/category/model/types.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  productsCount: number;
  parentId?: string;
  children?: Category[];
}
```

```ts
// entities/category/api/categoryApi.ts
import { api } from '@/shared/api';
import { Category } from '../model/types';

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};
```

```ts
// entities/category/model/hooks.ts
import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../api/categoryApi';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryApi.getCategory(id),
    enabled: !!id,
  });
};
```

### Пример 5: Сущность с UI компонентами

```tsx
// entities/product/ui/ProductSkeleton.tsx
import { Skeleton } from '@/shared/ui/skeleton';
import styles from './ProductSkeleton.module.css';

export const ProductSkeleton = () => {
  return (
    <div className={styles.skeleton}>
      <Skeleton height={200} />
      <Skeleton height={24} width="80%" />
      <Skeleton height={20} width="60%" />
      <Skeleton height={32} width="40%" />
    </div>
  );
};
```

## 🤔 Сущность или не сущность?

### ✅ Это сущность:

- ✅ **Product** - товар в магазине
- ✅ **User** - пользователь
- ✅ **Cart** - корзина
- ✅ **Order** - заказ
- ✅ **Review** - отзыв
- ✅ **Category** - категория

### ❌ Это НЕ сущность:

- ❌ **Theme** (светлая/темная) - это shared/lib
- ❌ **Modal** - это shared/ui
- ❌ **Notification** - это shared/lib или app
- ❌ **Form** - это feature

## ⚠️ Что НЕ должно быть в entities

- ❌ Зависимости от features/widgets/pages
- ❌ Знание о том, как данные используются
- ❌ UI логика (она в features/widgets)

## ✅ Что ДОЛЖНО быть в entities

- ✅ Типы и интерфейсы
- ✅ API методы
- ✅ Хуки для получения данных
- ✅ State management (если нужно)
- ✅ Вспомогательные UI (скелетоны, аватары)

## 🔄 Взаимодействие с другими слоями

```
entities
   ↓ импортирует
shared
   ↑ НЕ импортирует
features, widgets, pages, processes
```

## 📝 Naming Convention

- Папка: существительное в единственном числе `product`, `user`, `cart`
- Типы: `PascalCase` (`Product`, `User`, `CartItem`)
- Хуки: `use` + название сущности (`useProduct`, `useCart`)
- API: название + `Api` (`productApi`, `userApi`)
